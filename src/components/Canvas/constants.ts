export type HandlePositionType = [
  x: number, // X-координата
  y: number, // Y-координата
  z: number, // Z-координата
  duration: number, // Продолжительность анимации
  delay: number, // Задержка перед анимацией
  ease: string, // Тип плавности (easing)
];

export type HandleRotationType = [
  y: number, // Y-координата
  duration: number, // Продолжительность анимации
  delay: number, // Задержка перед анимацией
  ease: string, // Тип плавности (easing)
];

export const cameraPosition: HandlePositionType[] = [
  [0, 0.5, 80, 0.5, 0, 'linear'], // 0
  [0, 0.2, 65, 0.5, 0.2, 'linear'], // 1
  [0, -0.345, 48, 1, 0, 'easeIn'], // 2
  [4.32, -0.6, 40, 0.5, 0.2, 'easeIn'], // 3
  [0, -0.56, 30, 0.9, 0, 'easeIn'], // 4
  [5.8, -0.63, 16.5, 0.8, 0, 'linear'], // 5
];

export const cameraRotation: HandleRotationType[] = [
  [0, 0.5, 0, 'linear'], // 0
  [0, 0.7, 0, 'linear'], // 1
  [-0.64, 0.6, 0.4, 'easeOut'], // 2
  [0.2, 0.5, 0.2, 'linear'], // 3
  [-0.79, 0.7, 0.2, 'easeIn'], // 4
  [0.2, 0.6, 0, 'easeIn'], // 5
];

export const carPosition: HandlePositionType[] = [
  [-0.48, -1.56, 71.2, 0.5, 0, 'linear'], // 0
  [-0.55, -1.56, 56.8, 0.5, 0.2, 'elastic.in(1,0.75)'], // 1
  [2.94, -1.56, 38.8, 0.5, 0, 'elastic.in(1.2,0.3)'], // 2
  [0.84, -1.56, 31.9, 0.5, 0, 'easeOut'], // 3
  [2.94, -1.56, 22.8, 0.7, 0, 'easeIn'], // 4
  [2.94, -1.56, 9.7, 0.6, 0, 'easeIn'], // 5
];

export const carRotation: HandleRotationType[] = [
  [1.7 - Math.PI / 2, 0.5, 0, 'back.in(0.3)'], // 0
  [1.41 - Math.PI / 2, 0.4, 0.2, 'back.out(0.7)'], // 1
  [1.82 - Math.PI / 2, 0.2, 0.3, 'back.in(0.7)'], // 2
  [0.74 - Math.PI / 2, 0.3, 0.4, 'easeIn'], // 3
  [2.0 - Math.PI / 2, 0.5, 0.2, 'easeInOut'], // 4
  [3.44 - Math.PI / 2, 0.6, 0, 'easeIn'], // 5
];

export const policePosition: HandlePositionType[] = [
  [0.58, -1.56, 74.6, 0.55, 0, 'linear'], // 0
  [-0.55, -1.56, 60, 0.5, 0.2, 'expoScale(0.5,7,power1.out)'], // 1
  [2.14, -1.56, 43.9, 0.5, 0, 'expoScale(0.5,7,power1.out)'], // 2
  [2.4, -1.56, 35.9, 0.5, 0, 'linear)'], // 3
  [1.36, -1.56, 28, 0.6, 0, 'linear'], // 4
  [4.76, -1.56, 13.6, 0.5, 0.2, 'linear'], // 5
];

export const policeRotation: HandleRotationType[] = [
  [1.7, 0.5, 0, 'back.out(0.3)'], // 0
  [1.7, 0.5, 0.3, 'back.out(0.7)'], // 1
  [0.9, 0.5, 0.2, 'back.out(0.6)'], // 2
  [2.56, 0.6, 0, 'expoScale(0.5,7,power1.out)'], // 3
  [0.85, 0.6, 0, 'linear'], // 4
  [2.14, 0.6, 0, 'easeIn'], // 5
];
