<template>
  <div v-if="isVisible" class="modal active" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-left sale__card">
        <img :src="product.image" :alt="product.name">
        <span v-if="product.procent" class="sale__procent">-{{ product.procent }}</span>
        <button class="sale__btn-like btn" @click="toggleLike(product)"
          :class="{ active: isProductInWishlist(product.id) }"></button>
      </div>
      <div class="modal-right">
        <span class="modal-close" @click="closeModal">✖</span>

        <div class="modal-title">
          <span v-if="product.new" class="new-name">Новинка</span>
          <span v-if="product.sale" class="sale-name">Скидка</span>
          {{ product.name }}
        </div>
        <div class="modal-sale sale__card-date" v-if="product.sale">Скидка до {{ product.sale }}</div>
        <p class="modal-desc">
          <strong>Состав:</strong> {{ product.description || "Нет описания" }}
        </p>
        <div class="sale__card-bottom-left">
          <span v-if="product.oldprice" class="sale__card-oldprice">{{ product.oldprice }}₽</span>
          <div class="sale__card-redprice">
            <span class="sale__card-red">{{ product.price }}₽</span>
            <span class="sale__card-units">/от 10шт</span>
          </div>
        </div>
        <div class="modal-buttons">
          <button class="btn sale__card-cart" @click="addProductToCart(product)"></button>
        </div>
      </div>
    </div>

    <!-- Уведомление -->
    <transition name="fade">
      <div v-if="notification" class="notification">
        {{ notification }}
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
      default: false
    },
    product: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      notification: null
    };
  },
  computed: {
    ...mapGetters(['isInWhishList']), // Геттер из Vuex
    isProductInWishlist() {
      return (id) => this.isInWhishList(id); // Должно совпадать с Vuex
    }
  },
  methods: {
    ...mapActions(['addToCart', 'addToWishlist', 'removeFromWishlist']),
    checkWishlist(id) {
      return this.isInWishlist?.(id);
    },
    closeModal() {
      this.$emit("close");
    },

    ...mapActions(['addToWhishList', 'removeFromWhishList', 'fetchWishlist',]),
    async toggleLike(product) {
      try {
        if (this.isInWhishList(product.id)) {
          await this.removeFromWhishList(product.id);
          this.showNotification('Товар удален из избранного');
          await this.fetchWishlist(); // Обновляем список избранных
        } else {
          await this.addToWhishList(product);
          this.showNotification('Товар добавлен в избранное');
        }
      } catch (error) {
        this.showNotification('Произошла ошибка');
        console.error(error);
      }
    },


    addProductToCart(product) {
      if (!product?.id) return;

      this.addToCart(product);
      this.showNotification('Товар добавлен в корзину');
    },

    showNotification(message) {
      this.notification = message;
      setTimeout(() => {
        this.notification = null;
      }, 2000);
    }
  }
};
</script>

  
 
      <style scoped>
      * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
      }

      body {
          background: #f6f6f6;
      }

      .sale {
  padding: 100px 0;
}

.sale__container {}

.sale__block-top {
  display: flex;
  align-items: center;
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


.sale__btn:hover {
  background-color: var(--hover-color);
  transition: 0.3s ease-in-out;
}

.sale__block-right {
  margin-left: auto;
  display: flex;
  flex-direction: row-reverse;
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
.new-name {
    font-size:14px;
    width:fit-content;
    margin: 20px;
    margin-top:0;
    margin-left:0;
    color: var(--white);
    background-color: var(--primary-color);
    padding: 2px 5px;
    border-radius: 10px;
}
.sale-name{
    font-size:14px;
    width:fit-content;
    margin: 20px;
    margin-top:0;
    margin-left:0;
    color: var(--white);
    background-color: var(--red);
    padding: 2px 5px;
    border-radius: 10px;
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
  margin-top: auto;
}

.sale__card-cart {
  padding: 15px;
  margin-top:auto;
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

      .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: 0.3s;
          z-index:100000000;
      }

      .modal.active {
          opacity: 1;
          visibility: visible;
      }

      .modal-content {
          background: white;
          width: 700px;
          max-width: 90%;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          position: relative;
      }

      .modal-left {
          width: 50%;
          position: relative;
      }

      .modal-left img {
          width: 100%;
          height: 100%;
          object-fit: cover;
      }

      .modal-right {
          width: 50%;
          padding: 20px;
          display: flex;
          padding: 20px;
          flex-direction: column;
          /* justify-content: space-evenly; */
          gap: 20px;
      }

      .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 20px;
          cursor: pointer;
      }

      .modal-header {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #444;
      }

      .modal-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
          display:flex;
          flex-direction:column;
      }

      .modal-desc {
          font-size: 14px;
          margin-bottom: 10px;
      }

      .modal-price {
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #2c3e50;
      }

      .modal-buttons {
          display: flex;
          gap: 10px;
      }



      .btn-cart {
          background: #5ec8c8;
          color: white;
      }

      .sale__procent {
          bottom: 0;
      }
      
  </style>