import {
  AmbientLight,
  Color,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { FrameHandler } from '@/assets/helpers/FrameHandler';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Car } from '@/components/Canvas/Car';
import { RoadPlane } from '@/components/Canvas/Road';
import { Tunnel } from '@/components/Canvas/Tunnel';
import { NightSky } from '@/components/Canvas/NightSky';

export class CanvasHandler {
  private readonly renderer: WebGLRenderer;

  private readonly scene: Scene;

  private readonly camera: PerspectiveCamera;

  private readonly resizeObserver: ResizeObserver;

  private readonly frameHandler: FrameHandler;

  private readonly controls: OrbitControls;

  private activeSlide = 0;

  /// elements

  private car: Car | null = null;
  private roadPlane: RoadPlane | null = null;
  private tunnel: Tunnel | null = null;
  private nightSky: NightSky | null = null;

  public constructor(private readonly canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: 'high-performance',
      precision: 'mediump',
    });
    this.scene = new Scene();
    this.scene.background = new Color(0x111111);

    this.camera = new PerspectiveCamera(45, 1, 0.05, 150);
    this.camera.position.set(0, 0.5, 3);
    this.camera.lookAt(0, 0, 0);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true; // Плавное управление
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;

    //  освещение
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const mainLight = new DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 5, 5);
    this.scene.add(mainLight);

    this.createShapes();

    // ресайз
    this.handleResize();
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.canvas);

    // анимация
    this.frameHandler = new FrameHandler((d) => this.handleFrame(d));
    this.frameHandler.start();
  }

  public dispose() {
    this.frameHandler.stop();
    this.resizeObserver.disconnect();

    this.controls.dispose();
  }

  public createShapes() {
    this.car = new Car();
    this.roadPlane = new RoadPlane();
    this.tunnel = new Tunnel();
    this.nightSky = new NightSky();

    this.scene.add(this.car.getMesh());

    const roadMesh = this.roadPlane.getMesh();
    if (roadMesh) this.scene.add(roadMesh);

    this.scene.add(this.tunnel.getMesh());
    this.scene.add(this.nightSky.getGroup());
  }

  public updateSlide(slideIndex: number) {
    this.activeSlide = slideIndex;
    console.log('Current slide:', this.activeSlide);
    // You can add more logic here to handle slide changes
  }

  // eslint-disable-next-line complexity
  private handleFrame(rawDelta: number) {
    const delta = Math.min(rawDelta, 2);
    // const speed = performance.now() * 0.001;

    if (document.hidden) return;

    this.controls.update();

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
