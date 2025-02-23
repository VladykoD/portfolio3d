import { BoxGeometry, Mesh, MeshLambertMaterial } from 'three';

export class Car {
  private mesh: Mesh | null = null;

  constructor() {
    const geometry = new BoxGeometry(0.5, 0.5, 0.5);
    const material = new MeshLambertMaterial({ color: 0x00ff00, wireframe: true });
    this.mesh = new Mesh(geometry, material);
    this.mesh.position.set(0, -1, -1);
  }

  public getMesh(): Mesh {
    return this.mesh!;
  }

  public dispose() {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      (this.mesh.material as MeshLambertMaterial).dispose();
      this.mesh = null;
    }
  }

  public update(delta: number) {
    if (this.mesh) {
      this.mesh.rotation.x += delta * 0.005;
      this.mesh.rotation.y += delta * 0.007;
    }
  }
}
