<template>
  <div class="modal-overlay"  v-if="isVisible">
    <div class="modal">
      <h2>Ваш заказ успешно оформлен!</h2>
      <p>ФИО: {{ orderData.full_name || 'Не указано' }}</p>
      <p>Email: {{ orderData.email || 'Не указан' }}</p>
      <p>Телефон: {{ orderData.phone || 'Не указан' }}</p>
      <p>Способ доставки: {{ deliveryMethodText }}</p>
      <p>Способ оплаты: {{ paymentMethodText }}</p>

      <h3>Товары:</h3>
      <ul>
        <li v-for="(item, index) in orderData.items" :key="index">
          {{ item.name }} - {{ item.price }}₽ x {{ item.quantity }} шт.
        </li>
      </ul>

      <p>Итоговая стоимость: {{ orderData.total_price }}₽</p>

      <button @click="$emit('close')">Закрыть</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
    orderData: {
      type: Object,
      default: () => ({
        full_name: '',
        email: '',
        phone: '',
        items: [],
        total_price: 0,
        delivery_method: '',
        payment_method: ''
      })
    },
    deliveryMethodText: String,
    paymentMethodText: String
  }
};
</script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
  }
  
  .modal-content {
    margin-bottom: 20px;
  }
  
  button {
    padding: 10px 20px;
    background-color: #42b983;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #369f6e;
  }
  </style>