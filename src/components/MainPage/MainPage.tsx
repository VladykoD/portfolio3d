import clsx from 'clsx';
import styles from './styles.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination } from 'swiper/modules';
import 'swiper/css';
import { useEffect, useRef, useState } from 'react';
import { CanvasHandler } from '@/components/Canvas/CanvasHandler';

export const MainPage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handlerRef = useRef<CanvasHandler | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const handler = new CanvasHandler(canvas);

    handlerRef.current = handler;

    return () => {
      handler.dispose();
      handlerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (handlerRef.current) {
      handlerRef.current.updateSlide(activeSlide);
    }
  }, [activeSlide]);

  return (
    <main className={clsx(styles.hero)}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <Swiper
        className={styles.swiper}
        spaceBetween={0}
        slidesPerView={1}
        direction="vertical"
        speed={1000}
        mousewheel={{
          sensitivity: 1,
          releaseOnEdges: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Mousewheel, Pagination]}
        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
        //onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide className={clsx(styles.slide, styles.slide__1)}>
          <div>
            0
            {/*
            <h1>
              Дарья Владыко,
              <br /> Креативный фронтенд
            </h1>
            */}
          </div>
        </SwiperSlide>
        <SwiperSlide className={clsx(styles.slide, styles.slide__1)}>
          <div>
            1
            {/*
            <p>
              10 лет в разработке. Мои проекты получили награды Red Dot, Awwwards, Tagline,
              Orpetron, Золотой сайт, Рейтинг рунета.
            </p>*/}
          </div>
        </SwiperSlide>
        <SwiperSlide className={clsx(styles.slide, styles.slide__1)}>2</SwiperSlide>
        <SwiperSlide className={clsx(styles.slide, styles.slide__1)}>3</SwiperSlide>
        <SwiperSlide className={clsx(styles.slide, styles.slide__1)}>4</SwiperSlide>
        <SwiperSlide className={clsx(styles.slide, styles.slide__1)}>5</SwiperSlide>
      </Swiper>
    </main>
  );
};
