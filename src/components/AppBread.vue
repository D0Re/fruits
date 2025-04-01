<template>
  <div class="container">
  <nav class="breadcrumbs">
    <ul>
      <li v-for="(breadcrumb, index) in breadcrumbs" :key="index">
        <router-link
          v-if="breadcrumb.path && index !== breadcrumbs.length - 1"
          :to="breadcrumb.path"
        >
          {{ breadcrumb.label }}
        </router-link>
        <span v-else>{{ breadcrumb.label }}</span>
      </li>
    </ul>
  </nav>
</div>
</template>

<script>
export default {
  computed: {
    breadcrumbs() {
      const breadcrumbs = [{ path: '/', label: '' }];

      // Если пользователь в каталоге
      if (this.$route.path.startsWith('/catalog')) {
        breadcrumbs.push({ path: '/', label: 'Главная' });
        breadcrumbs.push({ path: '/catalog', label: 'Каталог' });
      }

      // Если пользователь в фильтрованном каталоге
      if (this.$route.path.startsWith('/filtered') && this.$route.query.category) {
        const category = this.$route.query.category;
        
  breadcrumbs.push({ path: '/catalog', label: 'Каталог' });
  breadcrumbs.push({ path: this.$route.fullPath, label: category });
}

      // Если пользователь в карточке товара
      if (this.$route.path.startsWith('/product/')) {
        breadcrumbs.push({ path: '/catalog', label: 'Каталог' });
        breadcrumbs.push({ path: this.$route.path, label: 'Товар' });
      }
      if (this.$route.path.startsWith('/cart')) {
        breadcrumbs.push({ path: '/', label: 'Главная' });
        breadcrumbs.push({ path: '/catalog', label: 'Каталог' });
        breadcrumbs.push({ path: '/cart', label: 'Корзина' });
       
      }
      if (this.$route.path.startsWith('/order')) {
        breadcrumbs.push({ path: '/cart', label: 'Корзина' });
        breadcrumbs.push({ path: '/order', label: 'Оформление заказа' })
      }
      if (this.$route.path.startsWith('/profile')) {
        breadcrumbs.push({ path: '/', label: 'Главная' });
        breadcrumbs.push({ path: '/profile', label: 'Профиль' });
      }
      if (this.$route.path.startsWith('/whislist')) {
        breadcrumbs.push({ path: '/catalog', label: 'Каталог' });
        breadcrumbs.push({ path: '/whislist', label: 'Понравилось' });
      }
     
    
      return breadcrumbs;
    },
  },
};
</script>

  
  <style scoped>
  .breadcrumbs {
    padding: 10px;
    font-size: 14px;
    display: inline-block;
    height: 20px;
    color: black;
    position: relative;
    top: 250px;
    width:100%;
    
  }
  .breadcrumbs ul {
    display: flex;
    justify-content:start;
    list-style: none;
    gap: 5px;
  }
  .breadcrumbs li {
  display: flex;
  align-items: center;
  width:fit-content;
}
.breadcrumbs li span {
  display: flex;
  align-items: center;
  max-width:100px;
  width:100%;
  color: #000;
}
.breadcrumbs li:not(:first-child) a::before {
  content: "•";
  margin: 0 2px;
  color: #ccc;
}
.breadcrumbs li span::before {
  content: "•";
  margin: 0 2px;
  font-size:20px;
  color: var(--hover-color);
}
.breadcrumbs a {
  color: #ccc;
  text-decoration: none;
  

}
.breadcrumbs a:hover {
  text-decoration: underline;
}
  </style>
  