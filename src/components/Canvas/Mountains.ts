import {
  BufferAttribute,
  BufferGeometry,
  FrontSide,
  Group,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
  Vector2,
} from 'three';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import { TextureLoad } from '@/components/Canvas/TextureLoad';

export class TerrainPlane {
  private group: Group | null = null;

  constructor() {
    this.group = new Group();

    const mountain1 = this.createMountain(4, 23, 6, 20);
    mountain1.rotateX(-Math.PI / 2);
    mountain1.position.set(-3.5, -2.05, 66.08);

    const mountain2 = this.createMountain(4, 23, 6, 20);
    mountain2.rotateX(-Math.PI / 2);
    mountain2.position.set(3.5, -2.05, 64.08);

    this.group.add(mountain1, mountain2);
  }

  // создание горы с заданными параметрами
  private createMountain(
    width: number,
    height: number,
    widthSegments: number,
    heightSegments: number,
  ): Mesh {
    const geometry = new PlaneGeometry(width, height, widthSegments, heightSegments);

    const mountainTexture = TextureLoad.loadTexture('/img/grid.png', 8, 20);

    const material = new MeshLambertMaterial({
      map: mountainTexture,
      side: FrontSide,
    });

    const mountain = new Mesh(geometry, material);
    this.setNoise(mountain.geometry, new Vector2(1, 1), 1);

    return mountain;
  }

  public setNoise(g: BufferGeometry, uvShift: Vector2, amplitude: number) {
    const perlin = new ImprovedNoise();
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    const vec2 = new Vector2();

    if (!(uv instanceof BufferAttribute)) return;

    for (let i = 0; i < pos.count; i++) {
      vec2.fromBufferAttribute(uv, i);

      // Получаем нормализованные координаты от 0 до 1
      const normalizedX = vec2.x;
      const normalizedY = vec2.y;

      // Создаем маску только для X (ширины), чтобы высота была одинаковой по Y
      const edgeMaskX = 1 - Math.pow(Math.abs(normalizedX - 0.5) * 2, 2);

      // Для Y используем почти постоянное значение с небольшим затуханием на краях
      const edgeMaskY =
        normalizedY > 0.05 && normalizedY < 0.95
          ? 1.0
          : Math.min(normalizedY / 0.05, (1 - normalizedY) / 0.05);

      // Генерируем базовый шум
      vec2.add(uvShift).multiplyScalar(amplitude * 5);

      let noise = 0;
      // Используем одинаковую частоту шума по Y
      noise += perlin.noise(vec2.y * 0.5, vec2.x * 2, 0);
      noise += perlin.noise(vec2.y * 1, vec2.x * 4, 0) * 0.5;

      // Используем абсолютное значение шума
      noise = Math.abs(noise);

      // Делаем горы более острыми
      noise = Math.pow(noise, 0.3);

      // Применяем маску краёв
      const height = noise * amplitude * edgeMaskX * edgeMaskY;

      // Добавляем случайные пики, но только по ширине (X), не по длине (Y)
      if (edgeMaskX > 0.7) {
        const spike = Math.random() * 2 * amplitude * edgeMaskX * edgeMaskY;
        pos.setZ(i, height + spike);
      } else {
        pos.setZ(i, height);
      }
    }

    pos.needsUpdate = true;
    g.computeVertexNormals();
  }

  public getGroup(): Group | null {
    return this.group;
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
