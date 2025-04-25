<template>
  <footer class="footer">
    <div class="footer__container container">
      <div class="footer__column">
        <h3 class="footer__title">Для клиентов</h3>
        <ul class="footer__list">
          <li v-for="(item, index) in clientLinks" :key="index">
            <a href="#" class="footer__link">{{ item }}</a>
          </li>
        </ul>
      </div>
      <div class="footer__column">
        <h3 class="footer__title">О компании</h3>
        <ul class="footer__list">
          <li v-for="(item, index) in companyLinks" :key="index">
            <router-link v-if="item === 'Контакты'" to="/contacts" class="footer__link">
              {{ item }}
            </router-link>
           
          </li>
          <li v-for="(item, index) in companyLinks" :key="index">
            <router-link v-if="item === 'О нас'" to="/about" class="footer__link">
              {{ item }}
            </router-link>
            
          </li>
        </ul>
      </div>
      <div class="footer__column">
        <h3 class="footer__title">Контакты</h3>
        <p class="footer__text"><a href="tel:8 800 057 52 07" class="footer__link">8 800 057 52 07</a></p>
        <p class="footer__text">Ежедневно с 8 до 20</p>
        <p class="footer__text">
          <a href="mailto:sinfermera@mail.ru" class="footer__link">sinfermera@mail.ru</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
  data() {
    return {
      clientLinks: [
        'Доставка и оплата',
        'Бесплатная доставка',
      ],
      companyLinks: [
        'О нас',
        'Контакты',
      ],
    };
  },
};
</script>