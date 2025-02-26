import { RepeatWrapping, Texture, TextureLoader } from 'three';

export class TextureLoad {
  private static textureLoader = new TextureLoader();
  private static textureCache: Map<string, Texture> = new Map();

  /**
   * Загружает текстуру с указанными параметрами повторения
   * @param path Путь к файлу текстуры
   * @param repeatX Коэффициент повторения по оси X
   * @param repeatY Коэффициент повторения по оси Y
   * @param useCache Использовать ли кэширование (по умолчанию false)
   * @returns Объект текстуры
   */
  public static loadTexture(
    path: string,
    repeatX: number = 1,
    repeatY: number = 1,
    useCache: boolean = false,
  ): Texture {
    // Создаем ключ для кэша
    const cacheKey = `${path}_${repeatX}_${repeatY}`;

    // Проверяем, есть ли текстура в кэше
    if (useCache && this.textureCache.has(cacheKey)) {
      return this.textureCache.get(cacheKey)!;
    }

    // Загружаем текстуру
    const texture = this.textureLoader.load(path, (loadedTexture) => {
      loadedTexture.wrapS = RepeatWrapping;
      loadedTexture.wrapT = RepeatWrapping;
      loadedTexture.repeat.set(repeatX, repeatY);
      loadedTexture.anisotropy = 16;
      loadedTexture.generateMipmaps = true;
    });

    // Сохраняем в кэш, если нужно
    if (useCache) {
      this.textureCache.set(cacheKey, texture);
    }

    return texture;
  }

  // Очищает кэш текстур
  public static clearCache(): void {
    this.textureCache.clear();
  }
}
