import {
  BackSide,
  CatmullRomCurve3,
  FrontSide,
  Group,
  InstancedMesh,
  Mesh,
  MeshLambertMaterial,
  RingGeometry,
  TubeGeometry,
  Vector3,
} from 'three';
import { TextureLoad } from '@/components/Canvas/TextureLoad';
import { PINK } from '@/assets/helpers/variables';

const pointsTunnel = [
  new Vector3(-4, 0, 42),
  new Vector3(-4, 0, 32),
  new Vector3(0, 0, 24),
  new Vector3(-4, 0, 16),
  new Vector3(0, 0, 8),
  new Vector3(0, 0, 5),
];

export class Tunnel {
  private mesh: InstancedMesh | null = null;
  private group: Group | null = null;

  constructor() {
    this.group = new Group();

    const curve = new CatmullRomCurve3(pointsTunnel);
    const tubeGeometry = new TubeGeometry(curve, 52, 2, 8, false);
    const tubeTexture = TextureLoad.loadTexture('/img/line-h.png', 1, 20);

    const tubeMaterial = new MeshLambertMaterial({
      color: PINK,
      side: BackSide,
      map: tubeTexture,
      transparent: true, // Включаем прозрачность
      opacity: 1,
      emissive: PINK, // цвет свечения
      emissiveIntensity: 1,
    });

    this.mesh = new InstancedMesh(tubeGeometry, tubeMaterial, 1);
    this.mesh.position.set(4, -1, 15);

    // Оптимизация для статических объектов
    this.mesh.matrixAutoUpdate = false;
    this.mesh.updateMatrix();

    this.group.add(this.mesh);

    this.addArch();
  }

  private addArch() {
    // Создаем геометрию кольца
    // Параметры: внутренний радиус, внешний радиус, сегменты по окружности, сегменты по радиусу
    const ringGeometry = new RingGeometry(1.99, 2.01, 8, 1);

    // Создаем материал для кольца
    const ringMaterial = new MeshLambertMaterial({
      color: PINK,
      side: FrontSide,
      emissive: PINK,
      emissiveIntensity: 0.5,
    });

    // Создаем меш кольца
    const ringMesh1 = new Mesh(ringGeometry, ringMaterial);
    ringMesh1.position.set(0, -1, 57);

    const ringMesh2 = new Mesh(ringGeometry, ringMaterial);
    ringMesh2.position.set(4, -1, 20);

    // Добавляем кольцо в группу
    this.group?.add(ringMesh1, ringMesh2);
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
