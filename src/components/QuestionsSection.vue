<template>
  <section class="questions">
    <div class="questions__container">
      <h4 class="questions__title title">Ответы на вопросы</h4>
      <div class="questions__cards">
        <div v-for="(question, index) in questions" :key="index" class="questions__card" @click="openModal(question)">
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
          <div v-for="(info, index) in infoBlocks" :key="index" class="questions__info-block">
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
      isModalVisible: false,
      selectedQuestion: {
        title: '',
        description: ''
      },
      questions: [
        {
          title: 'Как сделать заказ в вашем магазине?',
          description: 'Вы можете оформить заказ через наш сайт, мобильное приложение или по телефону 8 800 057 52 07. Добавьте товары в корзину, выберите удобный способ доставки и оплаты, подтвердите заказ. Наш оператор свяжется с вами для уточнения деталей.'
        },
        {
          title: 'Какие способы оплаты вы принимаете?',
          description: 'Мы принимаем наличные при получении, банковские карты (Visa, Mastercard, Мир), онлайн-платежи через СБП, а также безналичный расчет для юридических лиц. Для постоянных клиентов доступна оплата бонусами из программы лояльности.'
        },
        {
          title: 'Как быстро осуществляется доставка?',
          description: 'Доставка по Воронежу осуществляется в день заказа при оформлении до 14:00. В пригород и область - на следующий день. Точное время доставки согласовывается с оператором. Самовывоз доступен в течение 2 часов после подтверждения заказа.'
        },
        {
          title: 'Откуда вы привозите продукты?',
          description: 'Мы работаем напрямую с фермерскими хозяйствами Воронежской и соседних областей. Все поставщики проходят строгий отбор. Мясо и молоко - от местных ферм, овощи и фрукты - сезонные с собственных полей, экзотические фрукты - от проверенных импортеров.'
        },
        {
          title: 'Как хранить фермерские продукты?',
          description: 'Свежее мясо и рыбу следует хранить при +2...+4°C не более 3 дней. Молочные продукты - при +4...+6°C в оригинальной упаковке. Овощи и фрукты - в холодильнике в отсеке для овощей. На каждой упаковке указаны рекомендуемые условия хранения.'
        },
        {
          title: 'Есть ли у вас сертификаты на продукцию?',
          description: 'Да, вся продукция имеет необходимые сертификаты качества и ветеринарные свидетельства. По запросу мы можем предоставить документы на конкретный товар. Регулярно проводим лабораторные исследования продукции.'
        }
      ],
      infoBlocks: [
        {
          title: 'Бесплатная доставка',
          description: 'При заказе от 2000 рублей доставка по Воронежу бесплатная. Для заказов на меньшую сумму стоимость доставки составляет 200 рублей. В пригород и область - бесплатная доставка при заказе от 3000 рублей.'
        },
        {
          title: 'Фермерское качество',
          description: 'Мы лично знаем всех наших поставщиков и регулярно посещаем фермы. Контролируем условия содержания животных, технологию производства и сроки годности. Гарантируем 100% натуральность без консервантов и искусственных добавок.'
        },
        {
          title: 'Программа лояльности',
          description: 'За каждые 100 рублей в чеке вы получаете 1 бонусный рубль. Бонусами можно оплатить до 30% следующего заказа. Также для постоянных клиентов действуют специальные предложения и ранний доступ к новинкам.'
        }
      ],
    };
  },
  methods: {
    openModal(question) {
      this.selectedQuestion = question;
      this.isModalVisible = true;
      document.body.style.overflow = 'hidden'; // Блокируем скролл страницы при открытии модального окна
    },
    closeModal() {
      this.isModalVisible = false;
      document.body.style.overflow = ''; // Восстанавливаем скролл страницы
    },
  },
};
</script>

<style scoped>
.questions {
  padding: 60px 0;
  
}

.questions__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.questions__title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 32px;
  color: #2c3e50;
}

.questions__cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.questions__card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid #87d9d9;
}

.questions__card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.questions__card-name {
  font-weight: 500;
  color: #2c3e50;
  margin: 0;
}

.questions__info {
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.questions__info-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.questions__info-block {
  padding: 20px;
  background: #f5fbfb;
  border-radius: 8px;
}

.questions__info-title {
  color: #87d9d9;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 20px;
}

.questions__info-desc {
  color: #555;
  line-height: 1.6;
  margin: 0;
}

/* Стили модального окна */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.modal_visible {
  opacity: 1;
  visibility: visible;
}

.modal__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.modal__content {
  position: relative;
  background: white;
  border-radius: 10px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal__close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #777;
  transition: color 0.2s;
}

.modal__close:hover {
  color: #333;
}

.modal__title {
  margin-top: 0;
  color: #2c3e50;
  font-size: 24px;
}

.modal__description {
  color: #555;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .questions__cards {
    grid-template-columns: 1fr;
  }

  .questions__info-content {
    grid-template-columns: 1fr;
  }

  .modal__content {
    padding: 20px;
  }
}
</style>