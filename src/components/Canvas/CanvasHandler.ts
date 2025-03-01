import {
  AmbientLight,
  DirectionalLight,
  Fog,
  PerspectiveCamera,
  Scene,
  Texture,
  WebGLRenderer,
} from 'three';
import { FrameHandler } from '@/assets/helpers/FrameHandler';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Car } from '@/components/Canvas/Car';
import { RoadPlane } from '@/components/Canvas/Road';
import { Tunnel } from '@/components/Canvas/Tunnel';
import { NightSky } from '@/components/Canvas/NightSky';
import { TerrainPlane } from '@/components/Canvas/Mountains';
// @ts-ignore
import GUI from 'three/examples/jsm/libs/lil-gui.module.min';
import gsap from 'gsap';

// [x, y, z, duration, delay]
const cameraPosition = [
  [0, 0.5, 80, 0.5, 0], // 0
  [0, 0.2, 65, 0.5, 0.2], // 1
  [0, -0.345, 48, 0.5, 0.2], // 2
  [4.32, -0.6, 40, 0.5, 0.2], // 3
  [0, -0.56, 30, 0.7, 0], // 4
  [4.8, -0.63, 18.5, 0.5, 0], // 5
  [1.35, -0.3, 13.74, 0.5, 0], // 6
];

// [rotate Y, duration, delay]
const cameraRotation = [
  [0, 0.5, 0], // 0
  [0, 0.5, 0], // 1
  [-0.64, 0.5, 0.2], // 2
  [0.063, 0.5, 0.2], // 3
  [-0.79, 0.5, 0.2], // 4
  [0.06, 0.5, 0], // 5
  [-0.05, 0.5, 0], // 6
];

export class CanvasHandler {
  private readonly renderer: WebGLRenderer;

  private readonly scene: Scene;

  private readonly camera: PerspectiveCamera;

  private readonly frameHandler: FrameHandler;

  private readonly resizeHandler: () => void;

  /// elements

  private car: Car | null = null;
  private roadPlane: RoadPlane | null = null;
  private tunnel: Tunnel | null = null;
  private nightSky: NightSky | null = null;
  private terrainPlane: TerrainPlane | null = null;

  public constructor(private readonly canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: 'high-performance',
      precision: 'mediump',
      alpha: true,
    });
    this.scene = new Scene();

    const color = 0x471f53; // белый цвет тумана
    const near = 2; // расстояние, с которого начинается туман
    const far = 20; // расстояние, на котором туман достигает максимальной плотности
    this.scene.fog = new Fog(color, near, far);

    this.camera = new PerspectiveCamera(45, 1, 0.05, 150);
    this.camera.position.set(0, 0.5, 84);
    // this.camera.position.set(0, 8, 84);
    // this.camera.rotation.set(-0.5, 0, 0);

    //  освещение
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const mainLight = new DirectionalLight(0xffffff, 5);
    mainLight.position.set(2, 2, 5);
    this.scene.add(mainLight);

    this.createShapes();

    // ресайз
    this.handleResize();
    this.resizeHandler = () => this.handleResize();
    window.addEventListener('resize', this.resizeHandler);

    // анимация
    this.frameHandler = new FrameHandler((d) => this.handleFrame(d));
    this.frameHandler.start();
  }

  public dispose() {
    this.frameHandler.stop();

    if (this.scene.background instanceof Texture) {
      this.scene.background.dispose();
    }

    this.car?.dispose();
    this.roadPlane?.dispose();
    this.tunnel?.dispose();
    this.nightSky?.dispose();
    this.terrainPlane?.dispose();

    this.scene.clear();
    this.renderer.dispose();

    window.removeEventListener('resize', this.resizeHandler);
  }

  public createShapes() {
    this.car = new Car();
    this.roadPlane = new RoadPlane();
    this.tunnel = new Tunnel();
    this.nightSky = new NightSky();

    this.terrainPlane = new TerrainPlane();

    this.scene.add(
      this.roadPlane.getGroup(),
      this.car.getMesh(),
      this.tunnel.getGroup(),
      this.nightSky.getGroup(),
      this.terrainPlane.getGroup(),
    );
  }

  public updateSlide(slideIndex: number) {
    if (slideIndex < 0 || slideIndex >= cameraPosition.length) {
      console.error(`Слайд с индексом ${slideIndex} не существует`);
      return;
    }

    gsap.to(this.camera.position, {
      x: cameraPosition[slideIndex][0],
      y: cameraPosition[slideIndex][1],
      z: cameraPosition[slideIndex][2],
      duration: cameraPosition[slideIndex][3],
      delay: cameraPosition[slideIndex][4],
      ease: 'linear',
      onComplete: () => {},
    });

    gsap.to(this.camera.rotation, {
      y: cameraRotation[slideIndex][0],
      duration: cameraRotation[slideIndex][1],
      delay: cameraRotation[slideIndex][2],
      ease: 'linear',
      onComplete: () => {},
    });
  }

  private handleFrame(rawDelta: number) {
    const delta = Math.min(rawDelta, 2);

    if (document.hidden) return;

    if (this.car) {
      this.car.update(delta);
    }

    // Рендерим сцену
    this.renderer.render(this.scene, this.camera);
  }

  private handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpi = window.devicePixelRatio;

    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.canvas.width = width * dpi;
    this.canvas.height = height * dpi;

    this.renderer.setSize(width, height, false);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
