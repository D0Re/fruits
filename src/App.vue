<template>
    <div id="app">
        <AppHeader />
        <AppBread />
        <router-view /> <!-- Здесь рендерятся страницы -->
        <AppFooter />
    </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import AppBread from '@/components/AppBread.vue';
import axios from 'axios';
export default {
    
    name: 'App',
    components: {
        AppHeader,
        AppFooter,
        AppBread,
    },
    data() {
        return {
            message: "Загрузка...",
        };
    },
    async created() {
        try {
            const res = await axios.get("http://localhost:5000/");
            this.message = res.data;
        } catch (error) {
            this.message = "Ошибка подключения";
            console.error(error);
        }
    },
};
</script>

