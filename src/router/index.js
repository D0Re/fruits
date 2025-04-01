import { createRouter, createWebHistory } from 'vue-router';
import CatalogPage from '@/views/CatalogPage.vue'; 
import HomePage from '@/views/HomePage.vue'; 
import FilteredCatalogPage from '@/views/FilteredCatalogPage.vue';
import ProfilePage from '@/views/ProfilePage.vue';
import CartPage from '@/views/CartPage.vue';
import WhishList from '@/views/WhishList.vue';
import OrderPage from '@/views/OrderPage.vue';
import OrdersPage from '@/views/OrdersPage.vue';
import store from '@/store';
const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage,
        meta: { title: ' ' } // Главная страница
    },
    {
        path: '/catalog',
        name: 'CatalogPage',
        component: CatalogPage,
        meta: { title: 'Каталог' } // Каталог
    },
    {
        path: '/filtered',
        name: 'FilteredCatalogPage',
        component: FilteredCatalogPage, // Каталог
        props: route => ({
            category: route.query.category,
            product: route.query.product // Добавляем product
        }),       
         meta: { title: 'Фильтрованный каталог' } 
    },
    {
        path: '/product/:name',
        name: 'ProductPage',
        component: HomePage,
        props: route => ({ name: route.params.name })
      },
      {
        path: '/profile',
        name: 'ProfilePage',
        component: ProfilePage,
        meta: { title: 'Профиль' }
      },
      {
        path: '/cart',
        name: 'CartPage',
        component: CartPage,
        meta: { title: 'Корзина' }
      },
      {
        path: '/whislist',
        name: 'WhishList',
        component: WhishList,
        meta: { title: 'Лайк' }
      },
      {
        path: '/order',
        name: 'OrderPage',
        component: OrderPage,
        meta: { title: 'Заказ' }
      },
      {
        path: '/orders',
        name: 'OrdersPage',
        component: OrdersPage,
        meta: { title: 'Заказы' }
      },
  
      

      
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
      next('/'); // Перенаправляем на главную страницу, если пользователь не авторизован
    } else {
      next();
    }
  });
export default router;
