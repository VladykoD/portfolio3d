import { FrontSide, Material, Mesh, MeshLambertMaterial, PlaneGeometry, Texture } from 'three';
import { TextureLoad } from '@/components/Canvas/TextureLoad';

export class RoadPlane {
  private mesh: Mesh | null = null;
  private texture: Texture | null = null;

  constructor() {
    this.createPlane();
  }

  private createPlane() {
    this.texture = TextureLoad.loadTexture('/img/grid.png', 12, 72);

    // Используем BufferGeometry
    const planeGeometry = new PlaneGeometry(20, 80, 1, 1);
    const planeMaterial = new MeshLambertMaterial({
      map: this.texture,
      side: FrontSide,
    });

    this.mesh = new Mesh(planeGeometry, planeMaterial);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.set(0, -2, 36);

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
