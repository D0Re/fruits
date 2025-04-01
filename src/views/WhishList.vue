<template>
  <div class="wishlist main">
    <div class="product-grid container">
      <div v-if="loading" class="loading">Загрузка...</div>

      <div v-else-if="wishlistProducts.length === 0" class="empty-wishlist">

        <h3>Ваш список желаний пуст</h3>
        <p>Добавляйте понравившиеся товары, нажимая на ♡</p>
        <router-link to="/catalog" class="btn-primary">Перейти в каталог</router-link>
      </div>

      <div v-else class="wishlist-grid">
        <h2 class="wishlist-title">Мой список желаний</h2>
        <div class="product-grid">
          <div v-for="product in wishlistProducts" :key="product.id" class="sale__card">


            <img :src="product.image" :alt="product.name" class="sale__card-img" @click="openModal(product)">
            <span v-if="product.new" class="new-name">Новинка</span>
            <button class="sale__btn-like btn" @click="toggleRemove(product)"></button>

            <span v-if="product.procent" class="sale__procent">{{ product.procent }}</span>
            <div class="sale__card-middle">
              <p v-if="product.sale" class="sale__card-date">Скидка до {{ formatDate(product.sale) }}</p>
              <h2 class="sale__card-name" @click="openModal(product)">{{ product.name }}</h2>
              <div class="sale__card-bottom">
                <div class="sale__card-bottom-left">
                  <span v-if="product.oldprice" class="sale__card-oldprice">{{
                    product.oldprice }}₽</span>
                  <div class="sale__card-redprice">
                    <span class="sale__card-red">{{ product.price }}₽</span>
                    <span class="sale__card-units">/от 10шт</span>
                  </div>
                </div>
                <div class="sale__card-bottom-right">
                  <button class="sale__card-cart btn" @click="addProductToCart(product)"></button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <ProductModal v-if="selectedProduct" :product="selectedProduct" @close="closeModal" />
    <div v-if="notification" class="notification">
      {{ notification }}
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import ProductModal from '@/components/ProductModal.vue';

export default {
  components: {
    ProductModal
  },
  data() {
    return {
      loading: true,
      selectedProduct: null,
      notification: null,
    };
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['wishlistProducts']),
    formattedWishlistProducts() {
      return this.wishlistProducts.map(product => ({
        ...product,
        sale: product.sale ? this.formatDate(product.sale) : null
      }));
    }
  },
  methods: {
    ...mapActions(['removeFromWhishList', 'fetchWishlist', 'addToCart']),


    async toggleRemove(product) {
      try {
        await this.removeFromWhishList(product.id);
        console.log('Товар удалён из списка желаемого');
      } catch (error) {
        console.error('Ошибка при удалении товара', error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    },

    async moveToCart(product) {
      try {
        await this.removeFromWhishList(product.id);
        await this.addToCart(product);
        this.openModal(product);
        this.$notify({
          title: 'Успешно',
          text: 'Товар перемещён в корзину',
          type: 'success'
        });
      } catch (error) {
        this.$notify({
          title: 'Ошибка',
          text: 'Не удалось переместить товар',
          type: 'error'
        });
      }
    },
    openModal(product) {
      this.selectedProduct = product;
      this.$router.push({ query: { ...this.$route.query, product: product.name } });
    },
    closeModal() {
      this.selectedProduct = null;
      const query = { ...this.$route.query };
      delete query.product;
      this.$router.push({ query });
    },
    ...mapActions(['addToCart']),
    addProductToCart(product) {
      this.addToCart(product);
      this.showNotification('Товар добавлен в корзину');
    },
    showNotification(message) {
      this.notification = message;
      setTimeout(() => {
        this.notification = null;
      }, 2000); // Уведомление исчезает через 2 секунды
    }

    // Остальные методы
  },
  async created() {
    if (this.user) {
      try {
        await this.fetchWishlist();
      } catch (error) {
        console.error('Ошибка загрузки wishlist:', error);
      }
    }
    this.loading = false;
  }
};
</script>

<style scoped>
.wishlist {
  padding: 40px 0;
  min-height: 60vh;
}

.loading {
  text-align: center;
  font-size: 18px;
  padding: 40px 0;
}

.empty-wishlist {
  text-align: center;
  padding: 60px 0;
  margin: 0 auto;
}

.empty-wishlist .empty-image {
  max-width: 200px;
  margin-bottom: 20px;
}

.empty-wishlist h3 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.empty-wishlist p {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.wishlist-title {
  font-size: 28px;
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.wishlist-grid {
  display: flex;
  gap: 30px;
  flex-direction: column;
  align-items: flex-start;
}

.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image-container {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.05);
}

.wishlist-remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  background: #fff;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
  color: #ff3b30;
}

.product-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  z-index: 2;
}

.product-badge.new {
  background: #007aff;
}

.product-badge.sale {
  background: #ff3b30;
}

.product-info {
  padding: 16px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  cursor: pointer;
  transition: color 0.2s;
}

.product-name:hover {
  color: #007aff;
}

.product-pricing {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-container {
  display: flex;
  flex-direction: column;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.old-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.add-to-cart-btn {
  background: #007aff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
}

.add-to-cart-btn:hover {
  background: #0062cc;
}

@media (max-width: 768px) {
  .wishlist-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }

  .wishlist-title {
    font-size: 24px;
  }
}
</style>