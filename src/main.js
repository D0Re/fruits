import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router'; // Импорт роутера
import './assets/styles/style.css'
import './assets/styles/media.css'
import store from './store';
const app = createApp(App);
app.use(router); // Подключение роутера
app.use(store); 
app.mount('#app');


