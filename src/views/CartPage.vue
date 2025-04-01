<template>
  <main class="main ">
    <div class="cart main container">
      <div class="cart-items">
        <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
          <img :src="item.image" :alt="item.name" class="item-img" />
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p>{{ item.price }} ₽ {{ item.unit}}</p>
            <div class="item-quantity">
              <button @click="decreaseQuantity(index)">-</button>
              <span class="quantity">{{ item.quantity }}</span>
              <button @click="increaseQuantity(index)">+</button>
            </div>
          </div>
          <div class="item-price">
            <p>{{ item.price * item.quantity }} ₽</p>
          </div>
          <button @click="removeItem(index)" class="btn item-btn-del">Удалить</button>
        </div>
      </div>
      <div class="cart-summary">
        <p v-if="totalPrice < minOrderAmount" class="min-order">
          Минимальная сумма заказа {{ minOrderAmount }} ₽
        </p>
        <div class="cart-total">
          <p>Количество товаров: <span class="total-count">{{ totalCount }}</span></p>
          <p>Стоимость продуктов: <span class="total-price">{{ totalPrice }} ₽</span></p>
        </div>
        <button :disabled="totalPrice < minOrderAmount" class="checkout" @click="goToOrder">
          Оформить заказ
        </button>
      </div>
    </div>
  </main>
</template>

  
  <script setup>
 import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const cartItems = computed(() => store.getters.cartItems);
const totalCount = computed(() => store.getters.totalCount);
const totalPrice = computed(() => store.getters.totalPrice);
const minOrderAmount = 900;

const increaseQuantity = (index) => store.dispatch('increaseQuantity', index);
const decreaseQuantity = (index) => store.dispatch('decreaseQuantity', index);
const removeItem = (index) => store.dispatch('removeFromCart', index);

    

const goToOrder = () => {
  if (totalPrice.value >= minOrderAmount) {
    router.push('/order');
  }
};

   
     
      
    

  </script>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .main{
    margin-top: 90px;
    margin-bottom: 40vh !important;
  }

  .cart {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    background-color: #fff;
  }

  .cart-items {
    width: 65%;
  }

  .cart-item {
    display: flex;
    margin-bottom: 20px;
    background-color: #fff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    align-items: center;
  }

  .item-img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
  }

  .item-info {
    margin-left: 20px;
    flex: 1;
  }

  .item-info h3 {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .item-quantity {
    display: flex;
    align-items: center;
    margin-top: 10px;
  }

  .item-quantity button {
    background-color: var(--hover-color);
    border: none;
    padding: 5px;
    margin: 0 5px;
    border-radius: 4px;
    cursor: pointer;
  }

  .cart-summary {
    width: 30%;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .min-order {
    font-size: 14px;
    color: red;
    margin-bottom: 20px;
  }

  .checkout {
    width: 100%;
    padding: 10px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 18px;
    cursor: pointer;
  }

  .checkout:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .item-btn-del{
    background-color:var(--hover-color);
    padding:  5px;
    margin-left: 7px;
    border-radius: 8px;
    color: var(--white);
  }
</style>
  