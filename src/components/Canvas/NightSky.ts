import { Group, Mesh, MeshLambertMaterial, SphereGeometry } from 'three';
import { PINK } from '@/assets/helpers/variables';

export class NightSky {
  private group: Group | null = null;

  constructor() {
    this.group = new Group();

    const geometrySun = new SphereGeometry(1, 32, 32);

    // Создаем материал
    const materialSun = new MeshLambertMaterial({
      color: PINK,
      emissive: PINK,
      emissiveIntensity: 0.3,
    });

    const sun = new Mesh(geometrySun, materialSun);
    sun.position.set(-6, 6, 113);
    sun.rotation.set(0, Math.PI / 2, 0);

    const sun2 = new Mesh(geometrySun, materialSun);
    sun2.position.set(6, 4, 113);
    sun2.rotation.set(0, Math.PI / 2, 0);
    sun2.scale.setScalar(2);

    this.group.add(sun, sun2);
    this.group.position.set(0, 0, -50);
  }

  public getGroup(): Group {
    return this.group!;
  }

  public dispose() {
    if (this.group) {
      this.group = null;
    }
  }
}
