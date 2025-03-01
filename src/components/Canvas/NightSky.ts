import { Color, Group, Mesh, MeshLambertMaterial, SphereGeometry } from 'three';

export class NightSky {
  private group: Group | null = null;

  constructor() {
    this.group = new Group();

    const geometrySun = new SphereGeometry(6, 32, 32);

    // Создаем материал
    const materialSun = new MeshLambertMaterial({
      color: new Color('#ff00ff'),
      emissive: new Color('#ff00ff'),
      emissiveIntensity: 0.3,
    });

    const sun = new Mesh(geometrySun, materialSun);
    sun.position.set(-8, 20, 30);

    this.group.add(sun);
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
