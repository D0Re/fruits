<template>
    <div class="main">
        <div class="profile">
            <div class="profile__container container">
                <div class="profile__left">
                    <ul class="profile__list">
                        <li class="profile__item" @click="goToOrders">Заказы</li>
                        <li class="profile__item">Напоминания</li>
                        <li class="profile__item">Кэшбэк</li>
                        <li class="profile__item">Контакты</li>
                        <li class="profile__item">Пароль</li>
                        <li class="profile__item" @click="logout">Выход</li>
                    </ul>
                </div>
                <div class="profile__main">
                    <h2 class="profile__title title">Личный Кабинет</h2>
                    <div class="profile__info">
                        <p class="profile__desc"><span>Имя:</span> {{ user?.name || 'Не указано' }}</p>
                        <p class="profile__desc"><span>Контактный E-mail:</span> {{ user?.email || 'Не указан' }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AnalisisRun   v-if="showAnalisisRun" />
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AnalisisRun from '@/components/Analisis-run.vue';

export default {
    name: 'ProfilePage',
    components: { AnalisisRun },
    computed: {
        ...mapState(['user']), // Подключаем данные пользователя из Vuex
        userEmail() {
            console.log(this.user); // Проверьте, что user содержит поле email
            return this.user?.email || 'Не указан';
        },
        showAnalisisRun() {
            // Проверяем, что user существует и role_id равен 2
            return this.user?.role_id === 2;
          
        }
    },
    methods: {
        ...mapActions(['logout']), // Добавляем действие logout из Vuex
        async logout() {
            await this.$store.dispatch('logout'); // Вызываем действие logout
            this.$router.push('/'); // Перенаправляем пользователя на главную страницу
        },
        goToOrders() {
            this.$router.push('/orders'); // Переход на страницу заказов
        }
    }
   
};
</script>


<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}

body {
    background: #f6f6f6;
    padding: 20px;
}

.main {
    margin-top: 200px;
}

.profile__container {
    display: flex;
    height: 100%;
    margin: auto;
    margin-bottom: 50px;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 50px 20px;
}

.profile__left {
    width: 250px;
    background: #f8f8f8;
    padding: 20px;
    border: 1px solid #ddd;

}

.profile__left .profile__list {
    list-style: none;
}

.profile__left .profile__list .profile__item {
    padding: 10px 0;
    color: #007b7f;
    font-size: 16px;
    cursor: pointer;
}

.profile__left .profile__list .profile__item:hover {
    color: #004d4d;
}

.profile__main {
    flex: 1;
    padding: 20px;
    background: #f8f8f8;
    border: 1px solid #ddd;
    margin-left: 20px;
}

.profile__main .title {
    margin-bottom: 15px;
}

.profile__info .profile__desc {
    margin: 8px 0;
    font-size: 16px;
}

.profile__info .profile__desc span {
    font-weight: bold;
}

.profile__image {
    margin-top: 20px;
    text-align: center;
}

.profile__image img {
    width: 120px;
    height: 120px;
    border-radius: 10px;
    background: #e0f7fa;
    padding: 10px;
}

.profile__btn {
    display: block;
    text-align: center;
    background: #5ec8c8;
    color: white;
    padding: 10px;
    border-radius: 8px;
    margin-top: 15px;
    text-decoration: none;
    width: 100px;
    margin-left: auto;
    margin-right: auto;
}

.profile__btn:hover {
    background: #46a8a8;
    transition: 0.3s ease-in-out;
}
</style>