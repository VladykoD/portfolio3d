import clsx from 'clsx';
import styles from './styles.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export const MainPage = () => {
  console.log('init');

  return (
    <section className={clsx(styles.hero)}>
      <Swiper
        className={styles.swiper}
        spaceBetween={50}
        slidesPerView={1}
        direction="vertical"
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
      </Swiper>
    </section>
  );
};
