import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  FrontSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  RepeatWrapping,
  Scene,
  TextureLoader,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { FrameHandler } from '@/assets/helpers/FrameHandler';
// @ts-ignore
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

  private cube: Mesh | null = null;

  private nightSky: Group | null = null;
  private stars: Vector3[] = [];

  public constructor(private readonly canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: false,
    });
    this.scene = new Scene();
    this.scene.background = new Color(0x111111);

    this.camera = new PerspectiveCamera(45, 1, 0.05, 150);
    this.camera.position.set(0, 0.5, 3); // Изменили позицию камеры
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

    if (this.cube) {
      this.cube.geometry.dispose();
      (this.cube.material as MeshBasicMaterial).dispose();
    }

    if (this.nightSky) {
      // Удаляем небо (plane)
      const sky = this.nightSky.children[0] as Mesh;
      sky.geometry.dispose();
      (sky.material as MeshBasicMaterial).dispose();

      // Удаляем звезды (points)
      const stars = this.nightSky.children[1] as Points;
      stars.geometry.dispose();
      (stars.material as PointsMaterial).dispose();

      // Удаляем группу из сцены
      this.scene.remove(this.nightSky);

      // Очищаем ссылки
      this.stars = [];
      this.nightSky = null;
    }
  }

  public createShapes() {
    //  куб
    const geometry = new BoxGeometry(0.5, 0.5, 0.5);
    const material = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    this.cube = new Mesh(geometry, material);
    this.cube.position.set(0, -1, -1);

    this.scene.add(this.cube);

    this.roadPlane();
    this.tunnel();
    this.createNightSky();
  }

  public roadPlane() {
    // Создаем загрузчик текстур
    const textureLoader = new TextureLoader();

    // Загружаем текстуру
    textureLoader.load(
      '/img/grid.png',
      (texture) => {
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(12, 72); // Повторить текстуру 2 раза по обеим осям

        // Создаем геометрию плоскости
        const planeGeometry = new PlaneGeometry(10, 80);

        // Создаем материал с текстурой
        const planeMaterial = new MeshStandardMaterial({
          map: texture,
          side: FrontSide,
        });

        // Создаем меш
        const plane = new Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2; // Поворачиваем плоскость горизонтально
        plane.position.set(0, -2, -40);

        this.scene.add(plane);
      },
      undefined,
      (error) => {
        console.error('Ошибка загрузки текстуры:', error);
      },
    );
  }

  public tunnel() {
    const points = [
      new Vector3(-4, 0, 40),
      new Vector3(-4, 0, 32),
      new Vector3(0, 0, 24),
      new Vector3(-4, 0, 16),
      new Vector3(0, 0, 8),
      new Vector3(0, 0, 0),
    ];

    // Создаем кривую, проходящую через эти точки
    const curve = new CatmullRomCurve3(points);

    // Создаем геометрию трубы
    const tubeGeometry = new TubeGeometry(
      curve, // кривая
      64, // количество сегментов
      2, // радиус трубы
      8, // количество сегментов в окружности
      false, // закрытая ли труба
    );

    // Создаем материал для трубы
    const tubeMaterial = new MeshStandardMaterial({
      color: 0x00ff00,
      side: DoubleSide, // TODO: сделать BackSide
    });

    // Создаем меш трубы
    const tube = new Mesh(tubeGeometry, tubeMaterial);

    tube.position.set(4, -1, -60);

    this.scene.add(tube);
  }

  private createNightSky() {
    this.nightSky = new Group();
    const size = [100, 60];
    const starsCount = 300;

    // Создаем темное небо
    const skyGeometry = new PlaneGeometry(size[0], size[1]);
    const skyMaterial = new MeshBasicMaterial({
      color: 0x000000,
      side: FrontSide,
    });
    const sky = new Mesh(skyGeometry, skyMaterial);

    // Создаем звезды
    const positions: number[] = [];

    for (let i = 0; i < starsCount; i++) {
      const x = (Math.random() - 0.5) * size[0];
      const y = (Math.random() - 0.5) * size[1];
      const z = 0.01;

      const star = new Vector3(x, y, z);
      this.stars.push(star);
      positions.push(x, y, z);
    }

    const starsGeometry = new BufferGeometry();
    starsGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

    const starsMaterial = new PointsMaterial({
      color: 0xffffff,
      size: 2,
      sizeAttenuation: false,
    });

    const starsPoints = new Points(starsGeometry, starsMaterial);

    this.nightSky.add(sky);
    this.nightSky.add(starsPoints);

    this.nightSky.position.set(0, 0, -80);
    this.scene.add(this.nightSky);
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
    //console.log(this.camera);

    this.controls.update();

    // Вращаем куб
    if (this.cube) {
      this.cube.rotation.x += delta * 0.005;
      this.cube.rotation.y += delta * 0.007;
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

    this.size.set(width, height);

    this.renderer.setSize(width, height, false);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
