import {
  FrontSide,
  Material,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
  RepeatWrapping,
  Texture,
  TextureLoader,
} from 'three';

export class RoadPlane {
  private mesh: Mesh | null = null;
  private texture: Texture | null = null;

  constructor() {
    this.createPlane();
  }

  private createPlane() {
    const textureLoader = new TextureLoader();

    // Оптимизированная загрузка текстуры
    this.texture = textureLoader.load('/img/grid.png', (texture) => {
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      texture.repeat.set(12, 72);
      texture.anisotropy = 16; // Улучшаем качество при наклонном просмотре
      texture.generateMipmaps = true;
    });

    // Используем BufferGeometry
    const planeGeometry = new PlaneGeometry(12, 80, 1, 1);
    const planeMaterial = new MeshLambertMaterial({
      map: this.texture,
      side: FrontSide,
    });

    this.mesh = new Mesh(planeGeometry, planeMaterial);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.set(0, -2, -40);

    // Оптимизация для статических объектов
    this.mesh.matrixAutoUpdate = false;
    this.mesh.updateMatrix();
  }

  public getMesh(): Mesh | null {
    return this.mesh;
  }

  public dispose() {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      if (this.mesh.material instanceof Material) {
        this.mesh.material.dispose();
      }
      if (this.texture) {
        this.texture.dispose();
      }
      this.mesh = null;
    }
  }
}
