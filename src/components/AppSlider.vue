<template>
  <section class="section__slider">
    <div class="section__slider-swiper swiper mySwiper">
      <div class="swiper-wrapper">
        <div v-for="(slide, index) in slides" :key="index" class="swiper-slide">
          <img :src="slide.image" :alt="'Slide ' + (index + 1)" />
        </div>
      </div>
      <!-- Пагинация -->
      <div class="swiper-pagination"></div>
      <!-- Кнопки навигации -->
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </div>
  </section>
</template>

<script>
import { Swiper } from 'swiper';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';



export default {
  name: 'AppSlider',
  data() {
    return {
      slides: [
        {
          image:
            'https://cdn.esh-derevenskoe.ru/image/cache/catalog/9dd82f-1150x450.jpg?v=3',
        },
        {
          image:
            'https://cdn.esh-derevenskoe.ru/image/cache/catalog/e71527-1150x450.jpg?v=3',
        },
        {
          image:
            'https://cdn.esh-derevenskoe.ru/image/cache/catalog/9dd82f-1150x450.jpg?v=3',
        },
        {
          image:
            'https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg',
        },
        {
          image:
            'https://img.freepik.com/premium-vector/minimalist-shape-background_112769-210.jpg',
        },
      ],
    };
  },
  mounted() {
    new Swiper('.mySwiper', {
      modules: [Navigation, Pagination, Keyboard], // Подключаем модули
      loop: true,
      spaceBetween: 30,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      keyboard: {
        enabled: true,
      },
    });
  },
};
</script>


<style scoped>
.section__slider {
  position: relative;
}
.swiper-wrapper{
  max-height: 420px;
  height: 100%;
}

.section__slider-swiper {
  width: 100%;
  height: 100%;
  
}

.section__slider-swiper-slide {
  text-align: center;
  font-size: 18px;
  background-color: none;
  display: flex;
  justify-content: center;
  align-items: center;

}

.section__slider-swiper-slide img {
  width: 100%;
  object-fit: cover;
  height: 500px !important;
  border-radius: 20px;
}

.section__slider-swiper {

  border-radius: 20px;
}

.swiper-button-next:after,
.swiper-button-prev:after {
  display: none;
}

.swiper-button-next,
.swiper-rtl .swiper-button-prev {
  right: 0!important;
  left: auto;

}

.swiper-button-next {

  background: url('../assets/img/other/arrow-big.png');
  width: 30px !important;
  height: 30px !important;
  background-repeat: no-repeat;
  background-size: contain;
  rotate: 180deg;
}

.swiper-button-prev {
  background: url('../assets/img/other/arrow-big.png');
  width: 30px !important;
  height: 30px !important;
  background-repeat: no-repeat;
  background-size: contain;
}

.swiper-button-prev,
.swiper-button-next {
  background-color: var(--white);
  border-radius: 50%;
}

.swiper-button-prev:hover,
.swiper-button-next:hover {
  background-color: var(--hover-color);
  transition: 0.3s ease-in-out;
}

.swiper-button-prev,
.swiper-rtl .swiper-button-next {
  left: 0 !important;
  right: auto;
}

.swiper-pagination-bullet-active {
  background: #000 !important;
}
</style>