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
                                    <span class="catalog__header" @click="toggleCategory(category.id)">
                                        {{ category.name }} ▼
                                    </span>
                                    <ul v-if="category.open" class="catalog__sublist">
                                        <li v-for="(sub, index) in category.subcategories" :key="index"
                                            class="catalog__subitem" @click="filterProducts(sub)">
                                            {{ sub }}
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <!-- Правая часть с отфильтрованными товарами -->
                    <div class="catalog__right">
                        <h1 class="title">Товары категории: {{ category || 'Все товары' }}</h1>
                        <div class="product-grid">
                            <div v-for="product in filteredProducts" :key="product.id" class="sale__card">
                                <img :src="product.image" :alt="product.name" class="sale__card-img"
                                    @click="openModal(product)">
                                <span v-if="product.new" class="new-name">Новинка</span>
                                <button class="sale__btn-like btn" @click="toggleLike(product)"
                                    :class="{ active: isProductInWishlist(product.id) }"></button>

                                <span v-if="product.procent" class="sale__procent">{{ product.procent }}</span>
                                <div class="sale__card-middle">
                                    <p v-if="product.sale" class="sale__card-date">Скидка до {{ product.sale }}</p>
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
                                            <button class="sale__card-cart btn"
                                                @click="addProductToCart(product)"></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p v-if="filteredProducts.length === 0" class="no-products">Товары не найдены</p>
                    </div>
                </div>
            </div>
        </main>
        <ProductModal v-if="selectedProduct !== null" :isVisible="!!selectedProduct" :product="selectedProduct"
            @close="selectedProduct = null" />

        <div v-if="notification" class="notification">
            {{ notification }}
        </div>
    </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue';
import ProductModal from '@/components/ProductModal.vue';
import filterData from '@/assets/data/filter.json';
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';
export default {
    name: 'FilteredCatalogPage',
    components: {
        AppHeader,
        ProductModal,
    },
    computed: {
        ...mapGetters(['isInWhishList']), // Геттер из Vuex
        isProductInWishlist() {
            return (id) => this.isInWhishList(id); // Оборачиваем в функцию
        }
    },

    data() {
        return {
            categories: filterData.categories.map(category => ({
                ...category,
                open: false
            })),
            products: [], // Теперь данные будут загружаться с сервера
            filteredProducts: [],
            selectedProduct: null,
            cart: JSON.parse(localStorage.getItem('cart')) || [],
            notification: null,
        };
    },
    props: {
        category: String,
        product: String
    },
    watch: {
        category(newCategory) {
            this.applyFilter(newCategory);
        },
        product(newProduct) {
            if (newProduct) {
                this.selectedProduct = this.products.find(p => p.name === newProduct) || null;
            }
        }
    },

    mounted() {
        this.applyFilter(this.category);
        if (this.product) {
            this.selectedProduct = this.products.find(p => p.name === this.product) || null;
        }
        this.fetchProducts();
    },
    methods: {
        
        ...mapActions(['addToWhishList', 'removeFromWhishList']),
        async toggleLike(product) {
            try {
                if (this.isInWhishList(product.id)) {
                    await this.removeFromWhishList(product.id);
                    this.showNotification('Товар удален из избранного');
                } else {
                    await this.addToWhishList(product);
                    this.showNotification('Товар добавлен в избранное');
                }
            } catch (error) {
                this.showNotification('Произошла ошибка');
                console.error(error);
            }
        },

        toggleCategory(id) {
            this.categories = this.categories.map(category =>
                category.id === id ? { ...category, open: !category.open } : category
            );
        },
        filterProducts(subcategory) {
            this.$router.push({ query: { category: subcategory } });
        },
        async fetchProducts() {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                this.products = response.data;
                this.applyFilter(this.category);
            } catch (error) {
                console.error('Ошибка загрузки товаров:', error);
            }
        },
     
        applyFilter(category = this.$route.query.category) {
            if (!category || category === 'Все Товары') {
                this.filteredProducts = this.products;
            } else if (category === 'Скидки') {
                this.filteredProducts = this.products.filter(product => product.sale);
            } else if (category === 'Новинки') {
                this.filteredProducts = this.products.filter(product => product.is_new);
            } else {
                this.filteredProducts = this.products.filter(product => product.parentcategory === category || product.category === category);
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
      

        // Добавление товара в корзину
        
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

    }
};
</script>

<style>
/* Уведомление */
.notification {
    position: fixed;
    bottom: 80px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 100000000;
    animation: fadeInOut 2s ease-in-out;
}

@keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(10px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(10px); }
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
.sale__card-cart {
    padding: 15px;
    border-radius: 12px;
    background-color: var(--bg-color);
    width: 40px;
    height: 50px;
    background-image: url('@/assets/img/other/icons8-корзина-30.png') !important;
    background-color: var(--bg-color) !important;
    background-repeat: no-repeat !important;
    background-size: 30px;
    background-position: center;
    background-repeat: no-repeat;
}
.sale__btn-like {
    position: absolute;
    top: 0;
    right: 0;
    margin: 20px;
    background-color: var(--bg-color);
    color: var(--text-color);
    padding: 20px;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    background-image: url('@/assets/img/other/icons8-сердце-50.png') !important;
    background-size: 30px;
    background-position: center;
    background-repeat: no-repeat;
}

</style>