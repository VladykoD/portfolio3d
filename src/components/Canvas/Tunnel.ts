import {
  CatmullRomCurve3,
  DoubleSide,
  InstancedMesh,
  Material,
  MeshLambertMaterial,
  TubeGeometry,
  Vector3,
} from 'three';

export class Tunnel {
  private mesh: InstancedMesh | null = null;

  constructor() {
    const points = [
      new Vector3(-4, 0, 40),
      new Vector3(-4, 0, 32),
      new Vector3(0, 0, 24),
      new Vector3(-4, 0, 16),
      new Vector3(0, 0, 8),
      new Vector3(0, 0, 0),
    ];

    const curve = new CatmullRomCurve3(points);
    const tubeGeometry = new TubeGeometry(curve, 32, 2, 8, false);
    const tubeMaterial = new MeshLambertMaterial({
      color: 0x00ff00,
      side: DoubleSide,
    });

    this.mesh = new InstancedMesh(tubeGeometry, tubeMaterial, 1);
    this.mesh.position.set(4, -1, -60);

    // Оптимизация для статических объектов
    this.mesh.matrixAutoUpdate = false;
    this.mesh.updateMatrix();
  }

  public getMesh(): InstancedMesh {
    return this.mesh!;
  }

  public dispose() {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      if (this.mesh.material instanceof Material) {
        this.mesh.material.dispose();
      }
      this.mesh = null;
    }
  }
}
