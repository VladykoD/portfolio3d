import {
  BoxGeometry,
  FrontSide,
  Group,
  Material,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
  Texture,
} from 'three';
import { TextureLoad } from '@/components/Canvas/TextureLoad';

export class RoadPlane {
  private mesh: Mesh | null = null;
  private group: Group = new Group();
  private texture: Texture | null = null;

  constructor() {
    this.createPlane();
    this.createShape();
  }

  private createPlane() {
    this.texture = TextureLoad.loadTexture('/img/grid.png', 42, 45);

    // Используем BufferGeometry
    const planeGeometry = new PlaneGeometry(60, 80, 1, 1);
    const planeMaterial = new MeshLambertMaterial({
      map: this.texture,
      side: FrontSide,
      color: 0x566dca,
    });

    this.mesh = new Mesh(planeGeometry, planeMaterial);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.set(0, -2, 36);

    // Оптимизация для статических объектов
    this.mesh.matrixAutoUpdate = false;
    this.mesh.updateMatrix();

    this.group.add(this.mesh);
  }

  private createShape() {
    const geometry = new BoxGeometry(0.2, 25, 0.1);

    const texture = TextureLoad.loadTexture('/img/line-v.png', 0.4, 1);
    const material = new MeshLambertMaterial({
      map: texture,
      side: FrontSide,
      color: 0x566dca,
    });

    const shapeMesh1 = new Mesh(geometry, material);
    const shapeMesh2 = new Mesh(geometry, material);
    shapeMesh1.rotation.x = -Math.PI / 2;
    shapeMesh1.rotation.y = Math.PI / 5;
    shapeMesh1.position.set(-1.4, -1.5, 68);

    shapeMesh2.rotation.x = -Math.PI / 2;
    shapeMesh2.rotation.y = -Math.PI / 5;
    shapeMesh2.position.set(1.4, -1.5, 68);

    this.group.add(shapeMesh1, shapeMesh2);
  }

  public getGroup(): Group {
    return this.group!;
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
