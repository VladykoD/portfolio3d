import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector2,
  WebGLRenderer,
} from 'three';
import { FrameHandler } from '@/assets/helpers/FrameHandler';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class CanvasHandler {
  private readonly renderer: WebGLRenderer;

  private readonly scene: Scene;

  private readonly camera: PerspectiveCamera;

  private readonly resizeObserver: ResizeObserver;

  private readonly frameHandler: FrameHandler;

  private readonly size = new Vector2(1, 1);

  private readonly controls: OrbitControls;

  private activeSlide = 0;
  private cube: Mesh;

  public constructor(private readonly canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.scene = new Scene();
    this.scene.background = new Color(0x111111);

    this.camera = new PerspectiveCamera(45, 1, 0.05, 50);
    this.camera.position.set(3, 3, 3); // Изменили позицию камеры
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

    //  куб
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    this.cube = new Mesh(geometry, material);
    this.scene.add(this.cube);

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

    this.cube.geometry.dispose();
    (this.cube.material as MeshBasicMaterial).dispose();
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

    this.controls.update();

    // Вращаем куб
    this.cube.rotation.x += delta * 0.005;
    this.cube.rotation.y += delta * 0.007;

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

    this.size.set(width, height);

    this.renderer.setSize(width, height, false);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
