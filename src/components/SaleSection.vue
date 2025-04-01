<template>
  <section class="sale" v-if="filteredCards.length">
    <div class="sale__container">
      <div class="sale__block-top">
        <div class="sale__block-left">
          <h1 class="sale__title">Скидки</h1>
        </div>
        <div class="sale__block-right">
          <div ref="nextBtn" class="sale__swiper-button-next sale-next"></div>
          <div ref="prevBtn" class="sale__swiper-button-prev sale-prev"></div>
        </div>
      </div>
      <div class="sale__block-middle">
        <div class="sale__swiper swiper myCards">
          <div class="sale__swiper-wrapper swiper-wrapper">
            <div v-for="(card, index) in filteredCards" :key="card.id || `product-${index}`"
              class="sale__swiper-slide swiper-slide">
              <div class="sale__card">
                <img :src="card.image" alt="" class="sale__card-img" @click="openModal(card)" />
                <span class="sale__procent">{{ card.procent }}</span>
                
                <div class="sale__card-middle">
                  <p class="sale__card-date">Скидка действует до {{ card.sale }}</p>
                  <h2 class="sale__card-name" @click="openModal(card)">{{ card.name }}</h2>
                  <div class="sale__card-bottom">
                    <div class="sale__card-bottom-left">
                      <span class="sale__card-oldprice">{{ card.oldprice }}₽</span>
                      <div class="sale__card-redprice">
                        <span class="sale__card-red">{{ card.price }}₽</span>
                        <span class="sale__card-units">{{ card.units }}</span>
                      </div>
                    </div>
                    <div class="sale__card-bottom-right">
                      <button class="sale__card-cart btn" @click="addProductToCart(card)"></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="notification" class="notification">
      {{ notification }}
    </div>
  </section>
</template>

<script>
import { Swiper } from 'swiper';
import { Navigation, Keyboard } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';
import { nextTick } from 'vue';

export default {
  name: 'SaleSection',
  data() {
    return {
      filteredCards: [],
      notification: null,
      swiperInstance: null, // Храним экземпляр Swiper
    };
  },
  computed: {
    ...mapGetters(['isInWhishList']),
  },
  props: {
    product: String
  },
  methods: {
    ...mapActions(['addToCart']),
    openModal(card) {
      this.$emit('open-product', card);
    },
    ...mapActions(['addToWhishList', 'removeFromWhishList']),
    async toggleLike(product) {
      try {
        if (this.isInWhishList(product.id)) {
          await this.removeFromWhishList(product.id);
          this.showNotification('Товар удален из избранного');
        } else {
          await this.addToWhishList(product);
          this.showNotification('Товар добавлен в избранное');
        }
      } catch (error) {
        this.showNotification('Произошла ошибка');
        console.error(error);
      }
    },
    addProductToCart(card) {
      this.addToCart(card);
      this.showNotification('Товар добавлен в корзину');
    },
    showNotification(message) {
      this.notification = message;
      setTimeout(() => {
        this.notification = null;
      }, 2000);
    },

    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        this.filteredCards = response.data.filter(product => Boolean(product.sale));

        console.log('Загруженные товары:', this.filteredCards);

        await nextTick(); // Ждём обновления DOM перед запуском Swiper
        this.initSwiper();
      } catch (error) {
        console.error('Ошибка загрузки продуктов:', error);
      }
    },

    initSwiper() {
      if (this.swiperInstance) {
        this.swiperInstance.destroy(true, true); // Уничтожаем старый экземпляр
      }

      this.swiperInstance = new Swiper('.myCards', {
        modules: [Navigation, Keyboard],
        loop: false,
        slidesPerView: 4,
        spaceBetween: 20,
        navigation: {
          nextEl: this.$refs.nextBtn,
          prevEl: this.$refs.prevBtn,
        },
        keyboard: {
          enabled: true,
        },
      });

      console.log('Swiper инициализирован');
    },
  },
  async mounted() {
    await this.fetchProducts();
  },
};
</script>



<style scoped>
.sale {
  padding: 100px 0;
}

.sale__container {}

.sale__block-top {
  display: flex;
  align-items: center;
}
.like{
  background-color: brown;
}
.sale__block-left {
  display: flex;
  align-items: center;
}

.sale__title {
  font-size: 36px;
  line-height: 42px;
  color: var(--text-color);
  margin-right: 50px;
}

.sale__btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--bg-color);
  background-image: url('../assets/img/other/arrow-mini.png');
  background-size: contain;
  rotate: 180deg;
}

.sale__btn:hover {
  background-color: var(--hover-color);
  transition: 0.3s ease-in-out;
}

.sale__block-right {
  margin-left: auto;
  display: flex;
  flex-direction: row-reverse;
}

.sale__swiper-button-next {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--bg-color);
  margin-left: 10px;
}

.sale__swiper-button-prev {
  width: 30px;
  height: 30px;
  border-radius: 50%;

  background-color: var(--bg-color);
}

.sale__swiper-button-prev:hover,
.sale__swiper-button-next:hover {
  background-color: var(--hover-color);
  transition: 0.3s ease-in-out;
  cursor: pointer;
}

.sale__swiper-button-next {

  background: url('../assets/img/other/arrow-mini.png');
  width: 30px !important;
  height: 30px !important;
  background-repeat: no-repeat;
  background-size: contain;
  rotate: 180deg;
}

.sale__swiper-button-prev {
  background: url('../assets/img/other/arrow-mini.png');
  width: 30px !important;
  height: 30px !important;
  background-repeat: no-repeat;
  background-size: contain;
}

.sale__swiper-button-prev,
.sale__swiper-button-next {
  background-color: var(--white);
  border-radius: 50%;
}

.sale__swiper-button-prev:hover,
.sale__swiper-button-next:hover {
  background-color: var(--hover-color);
  transition: 0.3s ease-in-out;
}

.sale__block-middle {}

.sale__swiper {}

.myCards {}

.sale__swiper-wrapper {

  display: flex;


}

.sale__swiper-slide {
  width: 100%;
}

.sale__card {
  max-width: 270px;
  position: relative;
}

.sale__card-img {
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  margin-bottom: -5px;
  height: 270px;
  position: relative;
  cursor: pointer;
}

.sale__btn-like {
  position: absolute;
  top: 0;
  right: 0;
  margin: 20px;
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 20px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  background-image: url('../assets/img/other/icons8-сердце-50.png');
  background-size: 30px;
  background-position: center;
  background-repeat: no-repeat;
}

.sale__btn-like:hover {
  background-color: var(--hover-color);
  transition: 0.3s ease-in-out;
}

.sale__procent {
  position: absolute;
  left: 0;
  bottom: 34%;
  background-color: var(--bg-color);
  color: var(--text-color);
  margin: 20px;
  padding: 8px;
  border-radius: 50px;

}

.sale__btn-like:hover {
  background-color: var(--hover-color);
  color: var(--text-color);
  transition: 0.3s ease-in-out;
}

.sale__card-middle {
  background-color: var(--white);
  padding: 15px 20px;
  border-end-end-radius: 20px;
  border-end-start-radius: 20px;
  border: 1px solid var(--bg-color);
  min-height: 120px;
  height: auto;
}

.sale__card-date {
  margin: 0;
  color: var(--red);
  font-size: 12px;
  font-weight: 500;

}

.sale__card-name {
  color: var(--text-color);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.sale__card-bottom {
  padding-top: 10px;
  display: flex;
  align-items: center;

}

.sale__card-bottom-left {
  display: flex;
  flex-direction: column;

}

.sale__card-oldprice {
  color: var(--grey);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
  position: relative;
  z-index: 1;
}

.sale__card-oldprice::after {
  content: " ";
  display: block;
  position: absolute;
  top: 5px;
  left: 0px;
  width: 28px;
  height: 1.5px;
  background-color: var(--orange);
  rotate: -20deg;
  z-index: 2;
}

.sale__card-redprice {}

.sale__card-red {
  background: url('data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB2aWV3Qm94PSIwIDAgOTAgMzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik00Ny4wNzY5IDAuNjE1Mzg1TDg1Ljg0NjIgMS4yMzA3N0w5MCAzMkg0OS44NDYyTDQyLjkyMzEgMjguOTIzMUwzNy4zODQ2IDMySDBWMEwzNS4zMDc3IDAuNjE1Mzg1TDQxLjUzODUgMy42OTIzMUw0Ny4wNzY5IDAuNjE1Mzg1WiIgZmlsbD0iI0VCM0Y0OSIvPgo8L3N2Zz4K');
  background-repeat: no-repeat;
  background-size: cover;
  color: var(--white);
  font-size: 20px;
  padding: 0 5px;
}

.sale__card-units {
  font-size: 12px;
  color: var(--grey);
}

.sale__card-bottom-rigth {
  margin-left: auto;
}

.sale__card-cart {
  padding: 15px;
  border-radius: 12px;
  background-color: var(--bg-color);
  width: 40px;
  height: 50px;
  background-image: url('../assets/img/other/icons8-корзина-30.png');
  background-size: 30px;
  background-position: center;
  background-repeat: no-repeat;
}

.sale__card-cart:hover {
  background-color: var(--primary-color);
  transition: 0.3s ease-in-out;
}
</style>