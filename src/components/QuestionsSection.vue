<template>
  <section class="questions">
    <div class="questions__container">
      <h4 class="questions__title title">Ответы на вопросы</h4>
      <div class="questions__cards">
        <div
          v-for="(question, index) in questions"
          :key="index"
          class="questions__card"
          @click="openModal(question)"
        >
          <p class="questions__card-name">{{ question.title }}</p>
        </div>
      </div>

      <!-- Модальное окно -->
      <div class="modal" :class="{ modal_visible: isModalVisible }">
        <div class="modal__overlay" @click="closeModal"></div>
        <div class="modal__content">
          <button class="modal__close" type="button" @click="closeModal">&times;</button>
          <h2 class="modal__title">{{ selectedQuestion.title }}</h2>
          <p class="modal__description">{{ selectedQuestion.description }}</p>
        </div>
      </div>

      <div class="questions__info">
        <div class="questions__info-content">
          <div
            v-for="(info, index) in infoBlocks"
            :key="index"
            class="questions__info-block"
          >
            <h5 class="questions__info-title">{{ info.title }}</h5>
            <p class="questions__info-desc">{{ info.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'QuestionsSection',
  data() {
    return {
      isModalVisible: false, // Состояние модального окна
      selectedQuestion: {
        title: 'Как сделать заказ онлайн?',
        description: 'Чтобы сделать заказ онлайн, выберите нужный товар, добавьте его в корзину и перейдите к оформлению заказа. Укажите адрес доставки и оплатите заказ.',
      }, // Выбранный вопрос для модального окна
      questions: [
        {
          title: 'Как сделать заказ онлайн?',
          description:
            'Чтобы сделать заказ онлайн, выберите нужный товар, добавьте его в корзину и перейдите к оформлению заказа. Укажите адрес доставки и оплатите заказ.',
        },
        {
          title: 'Как сделать заказ онлайн?',
          description:
            'Чтобы сделать заказ онлайн, выберите нужный товар, добавьте его в корзину и перейдите к оформлению заказа. Укажите адрес доставки и оплатите заказ.',
        },
        {
          title: 'Как сделать заказ онлайн?',
          description:
            'Чтобы сделать заказ онлайн, выберите нужный товар, добавьте его в корзину и перейдите к оформлению заказа. Укажите адрес доставки и оплатите заказ.',
        },
        {
          title: 'Как сделать заказ онлайн?',
          description:
            'Чтобы сделать заказ онлайн, выберите нужный товар, добавьте его в корзину и перейдите к оформлению заказа. Укажите адрес доставки и оплатите заказ.',
        },
      ],
      infoBlocks: [
        {
          title: 'Доставка продуктов на дом',
          description:
            'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat minus quas rem velit aliquid. Ad debitis ipsam minima pariatur. Nisi sunt aut veniam enim illum culpa neque cumque suscipit cupiditate.',
        },
        {
          title: 'Доставка продуктов на дом',
          description:
            'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat minus quas rem velit aliquid. Ad debitis ipsam minima pariatur. Nisi sunt aut veniam enim illum culpa neque cumque suscipit cupiditate.',
        },
        {
          title: 'Доставка продуктов на дом',
          description:
            'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat minus quas rem velit aliquid. Ad debitis ipsam minima pariatur. Nisi sunt aut veniam enim illum culpa neque cumque suscipit cupiditate.',
        },
      ],
    };
  },
  methods: {
    openModal(question) {
      this.selectedQuestion = question; // Устанавливаем выбранный вопрос
      this.isModalVisible = true; // Открываем модальное окно
    },
    closeModal() {
      this.isModalVisible = false; // Закрываем модальное окно
    },
  },
};
</script>

<style scoped>
.questions {
  padding-bottom: 100px;
}

.questions__cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.questions__card {
  margin-bottom: 20px;
  border: 1px solid var(--primary-color);
  border-radius: 20px;
  max-width: 210px;
  width: 100%;
  min-height: 350px;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: end;
  cursor: pointer;
  padding: 25px;
}

.questions__card:not(:last-child) {
  margin-right: 20px;
}

.questions__card:nth-child(1n) {
  background-color: var(--grey);
}

.questions__card:nth-child(2n) {
  background-color: var(--hover-color);
}

.questions__card:nth-child(3n) {
  background-color: var(--orange);
}

.questions__card:nth-child(4n) {
  background-color: var(--primary-color);
}

.questions__card-name {
  margin-top: auto;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
}

.questions__info {
  margin: 40px 0;
}

.questions__info-content {
  background-color: var(--grey);
  padding: 50px;
  border-radius: 20px;
}

.questions__info-block {
  width: 100%;
}

.questions__info-block:not(:last-child) {
  margin-bottom: 20px;
}

.questions__info-title {
  margin-bottom: 15px;
  font-size: 34px;
}

.questions__info-desc {
  font-size: 20px;
}

/* Основные стили для модального окна */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  visibility: hidden;
  opacity: 0;
  transition: visibility 0.3s, opacity 0.3s;
  z-index: 1000;
}

.modal_visible {
  visibility: visible;
  opacity: 1;
}

.modal__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.modal__content {
  position: relative;
  background-color: #fff;
  padding: 20px;
  max-width: 500px;
  min-height: 250px;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 90%;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.modal__description {
  margin-top: auto;
}

.modal__close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 34px;
  color: #000;
  cursor: pointer;
}
</style>