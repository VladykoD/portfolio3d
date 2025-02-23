import {
  BufferGeometry,
  Float32BufferAttribute,
  FrontSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Vector3,
} from 'three';

export class NightSky {
  private group: Group | null = null;
  private stars: Vector3[] = [];

  constructor() {
    this.group = new Group();
    const size = [100, 60];
    const starsCount = 300;

    const skyGeometry = new PlaneGeometry(size[0], size[1]);
    const skyMaterial = new MeshBasicMaterial({
      color: 0x000000,
      side: FrontSide,
    });
    const sky = new Mesh(skyGeometry, skyMaterial);

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

    this.group.add(sky);
    this.group.add(starsPoints);
    this.group.position.set(0, 0, -80);
  }

  public getGroup(): Group {
    return this.group!;
  }

  public getStars(): Vector3[] {
    return this.stars;
  }

  public dispose() {
    if (this.group) {
      const sky = this.group.children[0] as Mesh;
      sky.geometry.dispose();
      (sky.material as MeshBasicMaterial).dispose();

      const stars = this.group.children[1] as Points;
      stars.geometry.dispose();
      (stars.material as PointsMaterial).dispose();

      this.stars = [];
      this.group = null;
    }
  }
}
