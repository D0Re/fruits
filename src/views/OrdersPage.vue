<template>
  <main class="main">
    <div class="orders-page container">
      <h1>Мои заказы</h1>

      <div v-if="userOrders.length === 0">
        <p>Вы еще ничего не заказывали.</p>
      </div>

      <ul v-else>
        <li v-for="order in userOrders" :key="order.id">
          <button @click="openOrder(order)">Заказ #{{ order.id }}</button>
        </li>
      </ul>

      <OrderModal v-if="selectedOrder" :isVisible="!!selectedOrder" :orderData="processedOrderData"
        :deliveryMethodText="getDeliveryMethodText(selectedOrder.delivery_method)"
        :paymentMethodText="getPaymentMethodText(selectedOrder.payment_method)" @close="selectedOrder = null" />
    </div>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import OrderModal from "@/components/OrderModal.vue";

export default {
  components: { OrderModal },
  computed: {
    ...mapGetters(["orders", "user"]),
    userOrders() {
      return this.orders.filter(order => order.user_id === this.user?.id);
    },
    processedOrderData() {
      if (!this.selectedOrder) return null;

      return {
        ...this.selectedOrder,
        full_name: this.user?.name || 'Не указано',
        email: this.user?.email || 'Не указан'
      };
    }
  },
  data() {
    return {
      selectedOrder: null,
    };
  },
  methods: {
    ...mapActions(["fetchOrders"]),
    openOrder(order) {
      this.selectedOrder = order;
    },
    getDeliveryMethodText(method) {
      return method === 'delivery' ? 'Доставка (+500₽)' : 'Самовывоз (0₽)';
    },
    getPaymentMethodText(method) {
      return method === 'cash' ? 'Наличными курьеру' : 'По терминалу курьеру';
    }
  },
  created() {
    if (this.user) {
      this.fetchOrders();
    }
  },
};
</script>

<style scoped>
ul {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 30px 0;
}

li button {
  background: var(--primary-color);
  border: none;
  padding: 20px 15px;
  border-radius: 12px;
  cursor: pointer;
  color: var(--text-color);
}

li button:hover {
  transform: scale(1.1);
  transition: 0.4s ease-in-out;
}
    .main {
      
      margin-bottom: 50vh !important;
    }
</style>
