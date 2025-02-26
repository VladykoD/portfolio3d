import {
  CatmullRomCurve3,
  DoubleSide,
  FrontSide,
  Group,
  InstancedMesh,
  Mesh,
  MeshLambertMaterial,
  Path,
  Shape,
  ShapeGeometry,
  TubeGeometry,
  Vector3,
} from 'three';
import { TextureLoad } from '@/components/Canvas/TextureLoad';

export class Tunnel {
  private mesh: InstancedMesh | null = null;
  private group: Group | null = null;

  constructor() {
    this.group = new Group();

    const points = [
      new Vector3(-4, 0, 40),
      new Vector3(-4, 0, 32),
      new Vector3(0, 0, 24),
      new Vector3(-4, 0, 16),
      new Vector3(0, 0, 8),
      new Vector3(0, 0, 5),
    ];

    const curve = new CatmullRomCurve3(points);
    const tubeGeometry = new TubeGeometry(curve, 32, 2, 8, false);
    const tubeTexture = TextureLoad.loadTexture('/img/grid.png', 20, 20);

    const tubeMaterial = new MeshLambertMaterial({
      color: 0x00ff00,
      side: DoubleSide,
      map: tubeTexture,
    });

    this.mesh = new InstancedMesh(tubeGeometry, tubeMaterial, 1);
    this.mesh.position.set(4, -1, 15);

    // Оптимизация для статических объектов
    this.mesh.matrixAutoUpdate = false;
    this.mesh.updateMatrix();

    // плоскость с дыркой
    const planeWithHole = this.createPlaneWithHole();

    planeWithHole.position.set(0, -1, 55);
    this.group.add(planeWithHole, this.mesh);
  }

  public createPlaneWithHole(): Mesh {
    // Размеры плоскости
    const width = 12;
    const height = 5;
    const holeRadius = 1.82;

    // Создаем внешний контур (плоскость)
    const shape = new Shape();
    shape.moveTo(-width / 2, -height / 2);
    shape.lineTo(width / 2, -height / 2);
    shape.lineTo(width / 4, height / 2);
    shape.lineTo(-width / 4, height / 2);
    shape.closePath();

    // Создаем внутренний контур (дырку)
    const holePath = new Path();
    holePath.absarc(0, -0.1, holeRadius, 0, Math.PI * 2, true);
    shape.holes.push(holePath);

    // Создаем геометрию из формы
    const geometry = new ShapeGeometry(shape);

    const planeTexture = TextureLoad.loadTexture('/img/grid.png', 1, 1);

    const planeMaterial = new MeshLambertMaterial({
      color: 0x00ff00,
      side: FrontSide,
      map: planeTexture,
    });

    return new Mesh(geometry, planeMaterial);
  }

  public getGroup(): Group {
    return this.group!;
  }

  public dispose() {
    if (this.group) {
      this.group.children.forEach((child) => {
        if (child instanceof Mesh) {
          child.geometry.dispose();

          if (Array.isArray(child.material)) {
            child.material.forEach((material) => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });

      this.group.clear();
      this.group = null;
    }
  }
}
