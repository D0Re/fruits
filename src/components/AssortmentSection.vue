<template>
  <section class="assortment">
    <div class="assortment__container">
      <h3 class="assortment__title title">{{ title }}</h3>

      <div class="assortment__cards">
        <div 
          v-for="(card, index) in cards" 
          :key="index" 
          class="assortment__card"
          @click="handleClick(card.name)"
        >
          <p class="assortment__card-name">{{ card.name }}</p>
      </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AssortmentSection',
  props: {
    title: {
      type: String,
      default: 'Ассортимент',
    },
  },
  data() {
    return {
      cards: [
        { name: 'Все Товары' },
        { name: 'Скидки' },
        { name: 'Новинки' },
        { name: 'Мясо, птица' },
        { name: 'Молоко, яйца и молочная продукция' },
        { name: 'Овощи, фрукты' },
      ],
    };
  },
  methods: {
    handleClick(category) {
      this.$router.push({ path: '/filtered', query: { category } });
    },
  },
};
</script>


<style scoped>
/* Ваши стили для секции ассортимента */
.assortment__cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;

}

.assortment__card {
  margin: 0px;
  max-width: 221px;
  width: 100%;
  min-height: 221px;
  height: auto;
  background-color: var(--primary-color);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 15px;
  cursor: pointer;
}

.assortment__card:not(:last-child) {
  margin-right: 15px;
}

.assortment__card:hover {
  transform: scale(1.1);
  background-color: var(--hover-color);
  transition: 0.5s ease-in-out;
}

.assortment__card-name {
  color: var(--text-color);
  font-size: 24px;
  line-height: 32px;
}

.new-name {
  position: absolute;
  left: 0;
  margin: 20px;
  color: var(--white);
  background-color: var(--primary-color);
  padding: 2px 5px;
  border-radius: 10px;
}

.new-price {
  background: none;
  color: var(--text-color);
}
</style>