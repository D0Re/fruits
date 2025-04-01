<template>
    <div class="catalog-page">
      <AppHeader />
  
      <main class="main">
        <div class="container">
          <div class="catalog">
            <!-- Левая панель с фильтром -->
            <div class="catalog__left">
              <nav class="catalog__navigation">
                <ul class="catalog__list">
                  <li v-for="category in categories" :key="category.id" class="catalog__item">
                    <span 
                      class="catalog__header" 
                      @click="toggleCategory(category.id)"
                    >
                      {{ category.name }} ▼
                    </span>
                    <ul v-if="category.open" class="catalog__sublist">
                      <li 
                        v-for="(sub, index) in category.subcategories" 
                        :key="index" 
                        class="catalog__subitem"
                        @click="filterProducts(sub)"
                      >
                        {{ sub }}
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
  
            <!-- Правая часть с отфильтрованными товарами -->
            <div class="catalog__right">
                <AssortmentSection  :products="filteredProducts"  title="Каталог"  @show-all-products="showAllProducts"/>
             
             
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  import AppHeader from '@/components/AppHeader.vue';
  import filterData from '@/assets/data/filter.json';
  import productsData from '@/assets/data/products.json';
  import AssortmentSection from '@/components/AssortmentSection.vue';
  
  export default {
    name: 'CatalogPage',
    components: {
      AppHeader,
      AssortmentSection,
    },
    data() {
      return {
        categories: filterData.categories.map(category => ({
          ...category,
          open: false
        })),
        products: productsData,
        filteredProducts: productsData, // Изначально показываем все товары
        selectedCategory: null, // Выбранная категория
      };
    },
    methods: {
  toggleCategory(id) {
    this.categories = this.categories.map(category =>
      category.id === id ? { ...category, open: !category.open } : category
    );
  },
  filterProducts(subcategory) {
    this.$router.push({ path: '/filtered', query: { category: subcategory } });
  },
  showAllProducts() {
    this.filteredProducts = this.products; // Показываем все товары
  }
}


  };
  </script>


<style scoped>
a {
    text-decoration: none;
}

img {
    width: 100%;
    height: 100%;
}

p {
    margin: 0;
    padding: 0;
}

* {
    margin: 0;
    padding: 0;
}

body {
    font-family: Arial, Helvetica, sans-serif;
}

li {
    list-style: none;
}

:root {
    --primary-color: rgb(135, 217, 217);
    --hover-color: rgb(132, 199, 199);
    --text-color: #000000;
    --bg-color: #f4f4f4;
    --red: rgb(213, 15, 15);
    --white: #ffffff;
    --grey: #c2c2c2;
    --orange: rgb(243, 184, 74);
}

.swiper-pagination-bullet-active {
    background: var(--text-color) !important;
}

.btn {
    border: none;
    background: none;
    cursor: pointer;
}

.title {
    font-size: 36px;
    line-height: 42px;
    color: var(--text-color);
    margin-bottom: 30px;
}

.container {
    max-width: 1146px;
    margin: 0 auto;
    height: 100%;
    padding: 0 45px;
}

/* MAIN */
.main {
    padding-top: 80px;
    margin-top: 250px;
}


.catalog {
    display: flex;
}
.catalog__left {
    max-width: 20%;
    width: 100%;
    margin-right: 10px;
}

.catalog__list {
}
.catalog__item {
    padding: 8px;
    cursor: pointer;
    margin-bottom: 5px;
    
}
.catalog__item:hover{
    transition: 0.3s;
    background-color: var(--hover-color);
}
.catalog__header {
    font-size: 18px;
}
.catalog__sublist {
    background-color: var(--bg-color);
    padding: 5px;
    border-radius: 10px;

}
.catalog__subitem {
    padding: 5px;
    cursor: pointer;
}
.catalog__subitem:hover{
    transition: 0.3s;
    background-color: var(--hover-color);
}
.catalog__tag {
}
.catalog__middle {
    max-width: 80%;
    width: 100%;
}

.catalog__middle-item {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}
.assortment{
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

</style>