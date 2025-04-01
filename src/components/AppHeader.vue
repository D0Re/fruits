<template>
  <header class="header">
    <div class="header__container container">
      <div class="header__top" :class="{ hidden: isHeaderTopHidden }">
        <div class="header__left">
          <a class="header__left-logo" @click="goHome">
            <img src="@/assets/img/logo/logotip.png" alt="">
          </a>
        </div>
        <div class="header__middle">
          <div class="header__bottom">
            <div class="header__bottom-catalog">
              <button class="header__catalog-btn btn" @click="goToCatalog">Каталог</button>
            </div>
            <div class="header__bottom-search">
              <input type="text" v-model="searchQuery" class="header__search" placeholder="Поиск"
                @input="searchProducts" @keyup.enter="redirectToFiltered">
              <button class="header__search-btn btn" @click="redirectToFiltered"></button>
              <ul v-if="filteredProducts.length && searchQuery" class="search-results">
                <li v-for="product in filteredProducts" :key="product.id" @click="goToProductCategory(product)">
                  <img :src="product.image" alt="product.name" class="product-image">
                  <span class="product-name">{{ product.name }}</span>
                  <span class="product-price">{{ product.price }} ₽</span>
                </li>
              </ul>
            </div>
            <div class="header__btns">
              <button class="header__basket-link btn" @click="goCart"></button>
              <span class="count">10</span>
              <button href="#" class="header__like-link btn" @click="goToWhishlist"></button>
              <button class="header__profile-link btn" @click="handleProfileClick"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="back-to-top" :class="{ show: isBackToTopVisible }" id="backToTop" @click="scrollToTop">⬆</button>
  </header>

  <AuthModal :isOpen="isAuthModalOpen" @close="isAuthModalOpen = false" @login-success="handleLoginSuccess" />
</template>

<script>
import { useRouter } from 'vue-router';
import { mapGetters } from 'vuex';
import AuthModal from '@/components/AuthModal.vue';
import axios from 'axios';

export default {
  name: 'AppHeader',
  components: { AuthModal },
  setup() {
    const router = useRouter();

    return {
      goToCatalog: () => router.push('/catalog'),
      goHome: () => router.push('/'),
      goCart: () => router.push('/cart'),
      goToWhishlist: () => router.push('/whislist')
    };
  },
  data() {
    return {
      isHeaderTopHidden: false,
      isBackToTopVisible: false,
      isAuthModalOpen: false,
      searchQuery: '',
      products: [],
      filteredProducts: []
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.fetchProducts();
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        this.products = response.data;
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
      }
    },

    searchProducts() {
      if (this.searchQuery.length < 2) {
        this.filteredProducts = [];
        return;
      }

      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.name.toLowerCase().startsWith(query) ||
        product.category.toLowerCase().includes(query)
      ).slice(0, 5); // Ограничиваем количество результатов
    },

    redirectToFiltered() {
      if (this.searchQuery.trim()) {
        this.$router.push({
          path: '/filtered',
          query: { search: this.searchQuery.trim() }
        });
        this.searchQuery = '';
        this.filteredProducts = [];
      }
    },

    goToProductCategory(product) {
      this.$router.push({
        path: '/filtered',
        query: {
          category: product.category,
          search: product.name
        }
      });
      this.searchQuery = '';
      this.filteredProducts = [];
    },
    selectProduct(product) {
      this.searchQuery = product.name;
      this.filteredProducts = [];
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    handleProfileClick() {
      if (this.isAuthenticated) {
        this.$router.push('/profile');
      } else {
        this.isAuthModalOpen = true;
      }
    },
    handleLoginSuccess(user) {
      this.$store.dispatch('login', user);
      this.isAuthModalOpen = false;
      this.$router.push('/profile');
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1146px;
  margin: 0 auto;
  height: 100%;
  padding: 0 45px;
}
.search-results {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.search-results li {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.search-results li:hover {
  background: #f0f0f0;
}

.product-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  margin-right: 10px;
}

.product-name {
  flex-grow: 1;
}

.product-price {
  font-weight: bold;
}

/* HEADER */
.header {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 500;
  background-color: #fff;
  box-shadow: 0 10px 20px rgba(92, 89, 89, .04);
  font-size: 16px;
  width: 100%;
}

.header__container {
  padding: 20px 0;
}

.header__top {
  position: relative;
  z-index: 200;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header__middle{
  width: 100%;
}

.header__top {
  transition: 0.3s ease-in-out;
}

.header__top.hidden {
  display: none;
}

.header__bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  /* Убедимся, что элемент поверх остальных */
  padding: 10px 0px;
}


.header__left-logo {
  display: inline-block;
  max-width: 170px;
  width: 100%;
  height: 100px;
  cursor: pointer;
}

.header__left-logo img {
  max-width: 170px;
  width: 288px;
  height: 100px;
}




.header__middle-items {
  display: flex;
  align-items: center;
  justify-content: center;

}

.header__middle-item {
  margin-right: 0;
  list-style: none;
  margin: 0;
  padding: 0;

}

.header__middle-item:not(:last-child) {
  margin-right: 14px;
}

.header__middle-link {
  padding: 10px 5px;
  color: var(--text-color);
  font-size: 18px;
}

.header__middle-link:hover {
  color: var(--primary-color);
  transition: 0.3s ease-in-out;
}


.header__profile {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__profile-link {
  padding: 15px;
  border-radius: 12px;
  background-color: var(--bg-color);
}

.header__profile-link {

  border-radius: 12px;
  background-color: var(--bg-color);
  width: 40px;
  height: 50px;
  background-image: url('../assets/img/other/icons8-пользователь-без-половых-признаков-30.png');
  background-size: 30px;
  background-position: center;
  background-repeat: no-repeat;
}

.header__profile-link:hover {
  background-color: var(--primary-color);
  transition: 0.3s ease-in-out;
}

.header__bottom {
  position: relative;
  z-index: 100;
  display: flex;
  align-items: center;
}

.header__bottom-catalog {
  max-width: 20%;
  width: 100%;

  margin-left: 10px;
}

.header__catalog-btn {
background-color: var(--primary-color);
  padding: 13px 30px;
  border-radius: 12px;
  width: 85%;
  font-size: 20px;
  font-weight: 500;
  color: #000000;
  position: relative;
  display: block;
  text-align: end;
}

.header__catalog-btn::before {
  content: " ";
  position: absolute;
  top: 11px;
    left: 35px;
    width: 20px;
    height: 20px;
  background-image: url('../assets/img/other/icons8-средние-иконки-24.png');
  background-repeat: no-repeat;
  background-size: contain;

}

.header__catalog-btn:hover {
  background-color: var(--hover-color);
  transition: 0.3s ease-in-out;

}

.header__bottom-search {
  max-width: 64%;
    width: 100%;
    position: relative;
}

.header__search {
 width: 85%;
  padding: 15px 35px;
  border: 0.5px solid #000000;
  border-radius: 8px;
  position: relative;
}

.header__search-btn {
  position: absolute;
    top: 13px;
    left: 10px;
    width: 20px;
    height: 20px;
  background-image: url('../assets/img/other/icons8-поиск-50.png');
  background-repeat: no-repeat;
  background-size: 20px;
  background-size: contain;
}


.header__basket-link {
  padding: 15px;
  border-radius: 12px;
  background-color: var(--bg-color);
  margin-right: 10px;
  position: relative;
}

.count {
  position: absolute;
  right: 53px;
  top: 8px;
  padding: 3px;
  min-width: 18px;
  width: auto;
  height: auto;
  color: #fff;
  border-radius: 50%;
  background-color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  display: none;
}

.header__like-link {
  padding: 15px;
  border-radius: 12px;
  background-color: var(--bg-color);
  margin-right: 10px;
}

.header__like-link {

  border-radius: 12px;
  background-color: var(--bg-color);
  width: 40px;
  height: 50px;
  background-image: url('../assets/img/other/icons8-сердце-50.png');
  background-size: 30px;
  background-position: center;
  background-repeat: no-repeat;
}

.header__basket-link {

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

.header__basket-link:hover,
.header__like-link:hover {
  background-color: var(--primary-color);
  transition: 0.3s ease-in-out;
  cursor: pointer;
}
</style>