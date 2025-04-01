<template>
  <main class="main">
    <div class="order-page container ">
      <h1>Оформление заказа</h1>

      <!-- Форма оформления заказа -->
      <form @submit.prevent="submitOrder">
      
          <!-- Контактные данные -->
          <div class="order-contacts">
            <!-- Контактные данные -->
            <div class="form-group">
              <label for="fullName">ФИО:</label>
              <input type="text" id="fullName" v-model="orderForm.fullName" required readonly
                :placeholder="user?.name || 'Не указано'" />
            </div>

            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" v-model="orderForm.email" required readonly
                :placeholder="user?.email || 'Не указан'" />
            </div>

            <div class="form-group">
              <label for="phone">Номер телефона:</label>
              <input type="tel" id="phone" v-model="orderForm.phone" required
                placeholder="Введите ваш номер телефона" />
            </div>
          </div>
          <!-- Информация о товарах -->
          <div class="order-products">
            <h2>Товары в заказе:</h2>
            <ul>
              <li v-for="(item, index) in cartItems" :key="item.id">
                <img :src="item.image" :alt="item.name" class="item-img" /> {{ item.name }} - {{ item.price }}₽ x {{
                item.quantity }} шт.
                <button type="button" @click="removeFromCart(index)">Удалить</button>
              </li>
            </ul>
          </div>

          <!-- Итоговая стоимость -->
          <div class="total-price">
            <h2>Итоговая стоимость:</h2>
            <p>{{ totalPriceWithDelivery }}₽</p>
          </div>

          <!-- Выбор способа доставки -->
          <div class="delivery-method">
            <h2>Способ доставки:</h2>
            <label>
              <input type="radio" v-model="deliveryMethod" value="pickup" />
              Самовывоз (0₽)
            </label>
            <label>
              <input type="radio" v-model="deliveryMethod" value="delivery" />
              Доставка (+500₽)
            </label>
          </div>

          <!-- Выбор способа оплаты -->
          <div class="payment-method">
            <h2>Способ оплаты:</h2>
            <label>
              <input type="radio" v-model="paymentMethod" value="cash" />
              Наличными курьеру
            </label>
            <label>
              <input type="radio" v-model="paymentMethod" value="terminal" />
              По терминалу курьеру
            </label>
          </div>

          <!-- Кнопка оформления заказа -->
          <button type="submit" :disabled="totalPrice < 900" :class="{ disabled: totalPrice < 900 }"
            @click.prevent="submitOrder">Оформить заказ</button>
      </form>
    </div>
  </main>
  <OrderModal v-if="showModal" :isVisible="showModal" :orderData="orderData" :deliveryMethodText="deliveryMethodText"
    :paymentMethodText="paymentMethodText" @close="closeModal" />
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import OrderModal from '@/components/OrderModal.vue';
import axios from 'axios';

export default {
  components: {
    OrderModal,
  },
  data() {
    return {
      orderForm: {
        fullName: '',
        email: '',
        phone: '',
      },
      deliveryMethod: 'pickup',
      paymentMethod: 'cash',
      showModal: false,
      orderData: null,
    };
  },
  computed: {
    ...mapState({
      cartItems: (state) => state.cart,
      user: (state) => state.user, // Получаем пользователя из Vuex
    }),
    ...mapGetters(['totalPrice']),
    totalPriceWithDelivery() {
      const deliveryCost = this.deliveryMethod === 'delivery' ? 500 : 0;
      return this.totalPrice + deliveryCost;
    },
    deliveryMethodText() {
      return this.deliveryMethod === 'delivery' ? 'Доставка (+500₽)' : 'Самовывоз (0₽)';
    },
    paymentMethodText() {
      return this.paymentMethod === 'cash' ? 'Наличными курьеру' : 'По терминалу курьеру';
    },
  },
  mounted() {
    // Устанавливаем значения из данных пользователя при загрузке компонента
    if (this.user) {
      this.orderForm.fullName = this.user.name;
      this.orderForm.email = this.user.email;
    }
  },
  methods: {
    ...mapActions(['removeFromCart', 'clearCart', 'placeOrder']),

    async submitOrder() {
      if (!this.user || !this.user.id) {
        alert('Ошибка: пользователь не авторизован');
        return;
      }

      const newOrder = {
        user_id: this.user.id,
        phone: this.orderForm.phone,
        deliveryMethod: this.deliveryMethod,
        paymentMethod: this.paymentMethod,
        items: this.cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      try {
        const response = await axios.post('http://localhost:5000/create-order', newOrder);

        this.orderData = {
          full_name: this.orderForm.fullName,
          email: this.orderForm.email,
          phone: this.orderForm.phone,
          id: response.data.order_id,
          items: this.cartItems,
          total_price: this.totalPriceWithDelivery,
          delivery_method: this.deliveryMethod,
          payment_method: this.paymentMethod
        };

        this.showModal = true;
        await this.$store.dispatch('clearCart');
        await this.$store.dispatch('placeOrder', {
          id: response.data.order_id,
          ...this.orderData
        });

        this.orderForm.phone = ''; // Очищаем только телефон, так как имя и email не редактируются
      } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при оформлении заказа');
      }
    },

    closeModal() {
      this.showModal = false;
    },
  },
};
</script>

<style scoped>
input[readonly] {
  background-color: #f5f5f5;
  cursor: not-allowed;
  border: 1px solid #ddd;
}
.order-page {

  margin: 0 auto;
  padding: 20px;

}

.disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.order-contacts {
  margin: 20px 0;
  display: flex;
  gap: 20px;
  flex-direction: column;
  max-width: 400px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="email"],
input[type="tel"] {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.order-products ul {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.order-products li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 5px;

}

.order-products li img {
  max-width: 80px;
  height: 80px;

}

.total-price {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 20px 0;
}

.total-price p {
  padding-top: 5px;
}

.delivery-method,
.payment-method {
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: var(--primary-color);
}
</style>