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

  constructor() {
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
      },
      () => {},
      (error) => {
        console.error(`Error loading ${modelType} model:`, error);
      },
    );
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
