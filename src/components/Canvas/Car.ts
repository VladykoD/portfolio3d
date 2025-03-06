import { Group, Mesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import {
  carPosition,
  carRotation,
  HandlePositionType,
  HandleRotationType,
  policePosition,
  policeRotation,
} from './constants';
// @ts-ignore
import GUI from 'three/examples/jsm/libs/lil-gui.module.min';

export class Car {
  private models: { [key: string]: Group | null } = {
    car: null,
    police: null,
  };
  private loader = new GLTFLoader();
  private isLoaded: { [key: string]: boolean } = {
    car: false,
    police: false,
  };

  private gui: GUI | null = null;
  private positionFolders: { [key: string]: any } = {};
  private rotationFolders: { [key: string]: any } = {};

  private positionControls: { [key: string]: { x: number; y: number; z: number } } = {
    car: { x: carPosition[0][0], y: carPosition[0][1], z: carPosition[0][2] },
    police: { x: policePosition[0][0], y: policePosition[0][1], z: policePosition[0][2] },
  };

  private rotationControls: { [key: string]: { x: number; y: number; z: number } } = {
    car: { x: 0, y: carRotation[0][0], z: 0 },
    police: { x: 0, y: policeRotation[0][0], z: 0 },
  };

  constructor() {
    //this.initGUI();

    // Load car model
    this.loadModel('car', '/models/car.glb', {
      position: { x: carPosition[0][0], y: carPosition[0][1], z: carPosition[0][2] },
      rotation: { x: 0, y: carRotation[0][0], z: 0 },
      scale: { x: 0.2, y: 0.2, z: 0.2 },
    });

    // Load police car model
    this.loadModel('police', '/models/police.glb', {
      position: { x: policePosition[0][0], y: policePosition[0][1], z: policePosition[0][2] },
      rotation: { x: 0, y: policeRotation[0][0], z: 0 },
      scale: { x: 0.00009, y: 0.00009, z: 0.00009 },
    });
  }

  private loadModel(
    modelType: string,
    path: string,
    config: {
      position: { x: number; y: number; z: number };
      rotation: { x: number; y: number; z: number };
      scale: { x: number; y: number; z: number };
    },
  ) {
    this.loader.load(
      path,
      (gltf) => {
        this.models[modelType] = gltf.scene;
        this.models[modelType]!.position.set(
          config.position.x,
          config.position.y,
          config.position.z,
        );
        this.models[modelType]!.scale.set(config.scale.x, config.scale.y, config.scale.z);
        this.models[modelType]!.rotation.set(
          config.rotation.x,
          config.rotation.y,
          config.rotation.z,
        );
        this.isLoaded[modelType] = true;

        // Update GUI values based on actual model position
        this.updateGUIValues(modelType);

        // Configure model materials if needed
        this.models[modelType]!.traverse((child) => {
          if (child instanceof Mesh) {
            // Can configure materials of the loaded model here
            // child.material = new MeshLambertMaterial({ color: 0x00ff00 });
          }
        });
      },
      () => {},
      (error) => {
        console.error(`Error loading ${modelType} model:`, error);
      },
    );
  }

  private initGUI() {
    this.gui = new GUI();
    this.gui.title('Cars Controls');

    // Create folders for each car
    const carFolder = this.gui.addFolder('Car');
    const policeFolder = this.gui.addFolder('Police Car');

    // Create position and rotation folders for each car
    this.positionFolders.car = carFolder.addFolder('Position');
    this.rotationFolders.car = carFolder.addFolder('Rotation');

    this.positionFolders.police = policeFolder.addFolder('Position');
    this.rotationFolders.police = policeFolder.addFolder('Rotation');

    // Add controllers for each car
    this.addControllers('car');
    this.addControllers('police');

    // Open folders by default
    carFolder.open();
    policeFolder.open();
    this.positionFolders.car.open();
    this.rotationFolders.car.open();
    this.positionFolders.police.open();
    this.rotationFolders.police.open();
  }

  private addControllers(modelType: string) {
    // Add position controllers
    this.positionFolders[modelType]
      .add(this.positionControls[modelType], 'x', -10, 10)
      .name('X')
      .listen()
      .onChange((value: number) => {
        if (this.models[modelType]) this.models[modelType]!.position.x = value;
      });
    this.positionFolders[modelType]
      .add(this.positionControls[modelType], 'z', 0, 100)
      .name('Z')
      .listen()
      .onChange((value: number) => {
        if (this.models[modelType]) this.models[modelType]!.position.z = value;
      });

    // Add rotation controllers

    this.rotationFolders[modelType]
      .add(this.rotationControls[modelType], 'y', -Math.PI, Math.PI)
      .name('Y')
      .listen()
      .onChange((value: number) => {
        if (this.models[modelType]) this.models[modelType]!.rotation.y = value;
      });
  }

  // Update GUI values based on model position and rotation
  private updateGUIValues(modelType: string) {
    if (this.models[modelType]) {
      // Update position controls
      this.positionControls[modelType].x = this.models[modelType]!.position.x;
      this.positionControls[modelType].z = this.models[modelType]!.position.z;

      // Update rotation controls
      this.rotationControls[modelType].y = this.models[modelType]!.rotation.y;
    }
  }

  public getMesh(modelType: string = 'car'): Group | null {
    return this.models[modelType];
  }

  public dispose() {
    Object.keys(this.models).forEach((modelType) => {
      if (this.models[modelType]) {
        this.models[modelType]!.traverse((child) => {
          if (child instanceof Mesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((material) => material.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
        this.models[modelType] = null;
      }
    });
  }

  // Method to move models to specific positions
  public moveTo(slideIndex: number, multiplier: number) {
    // Move car
    this.moveModel('car', slideIndex, carPosition, carRotation, multiplier);

    // Move police car
    this.moveModel('police', slideIndex, policePosition, policeRotation, multiplier);
  }

  private moveModel(
    modelType: string,
    slideIndex: number,
    positionArray: HandlePositionType[],
    rotationArray: HandleRotationType[],
    multiplier: number,
  ) {
    if (
      this.models[modelType] &&
      this.isLoaded[modelType] &&
      slideIndex >= 0 &&
      slideIndex < positionArray.length
    ) {
      // Move the model
      gsap.to(this.models[modelType]!.position, {
        x: positionArray[slideIndex][0],
        y: positionArray[slideIndex][1],
        z: positionArray[slideIndex][2],
        duration: positionArray[slideIndex][3] * multiplier,
        delay: positionArray[slideIndex][4] * multiplier,
        ease: 'linear',
        onComplete: () => {
          // Update GUI after animation completes
          this.updateGUIValues(modelType);
        },
      });

      // Rotate the model
      gsap.to(this.models[modelType]!.rotation, {
        y: rotationArray[slideIndex][0],
        duration: rotationArray[slideIndex][1] * multiplier,
        delay: rotationArray[slideIndex][2] * multiplier,
        ease: rotationArray[slideIndex][3],
      });
    }
  }
}
