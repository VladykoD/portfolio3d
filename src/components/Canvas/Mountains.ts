import {
  BufferAttribute,
  BufferGeometry,
  FrontSide,
  Group,
  Mesh,
  MeshLambertMaterial,
  Path,
  PlaneGeometry,
  RepeatWrapping,
  Shape,
  ShapeGeometry,
  Texture,
  TextureLoader,
  Vector2,
} from 'three';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';

export class TerrainPlane {
  private group: Group | null = null;

  constructor() {
    // Создаем группу для объединения всех элементов
    this.group = new Group();

    // Создаем первую гору
    const mountain1 = this.createMountain(4, 23, 6, 20);
    mountain1.rotateX(-Math.PI / 2);
    mountain1.position.set(-3.5, -2.05, -12.08);
    this.group.add(mountain1);

    // Создаем вторую гору с другими параметрами
    const mountain2 = this.createMountain(4, 23, 6, 20);
    mountain2.rotateX(-Math.PI / 2);
    mountain2.position.set(3.5, -2.05, -12.08);
    this.group.add(mountain2);

    // Создаем плоскость с дыркой
    const planeWithHole = this.createPlaneWithHole();

    planeWithHole.position.set(0, -1, -20);
    this.group.add(planeWithHole);
  }

  // Метод для создания горы с заданными параметрами
  private createMountain(
    width: number,
    height: number,
    widthSegments: number,
    heightSegments: number,
  ): Mesh {
    const geometry = new PlaneGeometry(width, height, widthSegments, heightSegments);

    const mountainTexture = this.loadTexture('/img/grid.png', 8, 20.85);
    const material1 = new MeshLambertMaterial({
      map: mountainTexture,
      side: FrontSide,
    });

    const mountain = new Mesh(geometry, material1);
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

  public createPlaneWithHole(): Mesh {
    // Размеры плоскости
    const width = 12;
    const height = 5;
    const holeRadius = 1.8;

    // Создаем внешний контур (плоскость)
    const shape = new Shape();
    shape.moveTo(-width / 2, -height / 2);
    shape.lineTo(width / 2, -height / 2);
    shape.lineTo(width / 4, height / 2);
    shape.lineTo(-width / 4, height / 2);
    shape.closePath();

    // Создаем внутренний контур (дырку)
    const holePath = new Path();
    holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
    shape.holes.push(holePath);

    // Создаем геометрию из формы
    const geometry = new ShapeGeometry(shape);

    // Создаем материал с текстурой
    const material1 = new MeshLambertMaterial({
      color: 0x00ff00,
      side: FrontSide,
    });

    const wall = new Mesh(geometry, material1);

    return wall;
  }

  // Возвращаем группу вместо меша
  public getGroup(): Group {
    return this.group!;
  }

  private loadTexture(path: string, repeatX: number = 1, repeatY: number = 1): Texture {
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(path, (loadedTexture) => {
      loadedTexture.wrapS = RepeatWrapping;
      loadedTexture.wrapT = RepeatWrapping;
      loadedTexture.repeat.set(repeatX, repeatY);
      loadedTexture.anisotropy = 16;
      loadedTexture.generateMipmaps = true;
    });

    return texture;
  }

  public dispose() {
    if (this.group) {
      // Перебираем все дочерние элементы группы
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

      this.group.clear(); // Удаляем все дочерние элементы
      this.group = null;
    }
  }
}
