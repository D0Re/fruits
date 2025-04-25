<template>
    <div class="contacts-page main">
        <div class="contacts-container">
            <h1 class="page-title">Свяжитесь с нами</h1>
            <p class="page-subtitle">Мы всегда рады вашим вопросам и предложениям</p>

            <div class="contacts-content">
                <div class="map-container">
                    <div ref="map" class="yandex-map"></div>
                </div>

                <div class="contact-info">
                    <div class="contact-item">
                        <div class="contact-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--primary-color)">
                                <path
                                    d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>
                        </div>
                        <div class="contact-text">
                            <h3>Email</h3>
                            <a href="mailto:info@example.com">info@example.com</a>
                        </div>
                    </div>

                    <div class="contact-item">
                        <div class="contact-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--primary-color)">
                                <path
                                    d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                            </svg>
                        </div>
                        <div class="contact-text">
                            <h3>Телефон</h3>
                            <a href="tel:+78001234567">+7 (800) 123-45-67</a>
                        </div>
                    </div>

                    <div class="contact-item">
                        <div class="contact-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--primary-color)">
                                <path
                                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                        </div>
                        <div class="contact-text">
                            <h3>Адрес</h3>
                            <p>Россия, г. Воронеж, ул. Примерная, 123</p>
                        </div>
                    </div>

                    <div class="social-links">
                        <a href="#" class="social-link" aria-label="Telegram">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--primary-color)">
                                <path
                                    d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
                            </svg>
                        </a>
                        <a href="#" class="social-link" aria-label="VK">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--primary-color)">
                                <path
                                    d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.13C2 20.67 3.33 22 8.93 22h6.13c5.61 0 6.94-1.33 6.94-6.94V8.93C22 3.33 20.67 2 15.07 2zm3.13 14.27c-1.33 1.69-3.19 1.51-3.91 0-1.18-1.85-1.06-2.02.39-3.4 1.14-1.09 1.56-1.8 1.42-2.71-.15-1.09-1.12-1.51-2.15-1.42-.6.05-1.23.21-1.88.45-.32.12-.62.25-.88.25-.37 0-.48-.23-.48-.6V7.8c0-.48-.06-.8-.6-.8-.3 0-.63.09-.96.23-.54.24-1.03.57-1.54.93-.45.33-.81.6-1.06.6-.12 0-.24-.09-.24-.45V7.2c0-.81.12-1.51-1.09-1.51-.48 0-1.03.21-1.54.45-.39.21-.75.45-1.09.69-.27.21-.39.33-.39.57 0 .3.27.39.69.39.33 0 .69-.09 1.08-.21 1.59-.48 1.69-.66 2.79-.3 3.21 1.39 1.69 3.19 1.51 3.91 0 1.18-1.85 1.06-2.02-.39-3.4-1.14-1.09-1.56-1.8-1.42-2.71.15-1.09 1.12-1.51 2.15-1.42.6.05 1.23.21 1.88.45.32.12.62.25.88.25.37 0 .48-.23.48-.6v-1.2c0-.48.06-.8.6-.8.3 0 .63.09.96.23.54.24 1.03.57 1.54.93.45.33.81.6 1.06.6.12 0 .24-.09.24-.45v-1.5c0-.81-.12-1.51 1.09-1.51.48 0 1.03.21 1.54.45.39.21.75.45 1.09.69.27.21.39.33.39.57 0 .3-.27.39-.69.39-.33 0-.69-.09-1.08-.21-1.59-.48-1.69-.66-2.79-.3-3.21-1.39-1.69-3.19-1.51-3.91 0-1.18 1.85-1.06 2.02.39 3.4 1.14 1.09 1.56 1.8 1.42 2.71-.15 1.09-1.12 1.51-2.15 1.42-.6-.05-1.23-.21-1.88-.45-.32-.12-.62-.25-.88-.25-.37 0-.48.23-.48.6v1.2c0 .48-.06.8-.6.8-.3 0-.63-.09-.96-.23-.54-.24-1.03-.57-1.54-.93-.45-.33-.81-.6-1.06-.6-.12 0-.24.09-.24.45v1.5c0 .81.12 1.51-1.09 1.51-.48 0-1.03-.21-1.54-.45-.39-.21-.75-.45-1.09-.69-.27-.21-.39-.33-.39-.57 0-.3.27-.39.69-.39.33 0 .69.09 1.08.21 1.59.48 1.69.66 2.79.3 3.21z" />
                            </svg>
                        </a>
                        <a href="#" class="social-link" aria-label="WhatsApp">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--primary-color)">
                                <path
                                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';

export default {
    name: 'ContactsPage',
    setup() {
        const map = ref(null);

        onMounted(() => {
            // Проверяем, что Яндекс Карты загружены
            if (window.ymaps) {
                initYandexMap();
            } else {
                // Если нет, загружаем API Яндекс Карт
                const script = document.createElement('script');
                script.src = 'https://api-maps.yandex.ru/2.1/?apikey=ваш_api_ключ&lang=ru_RU';
                script.onload = initYandexMap;
                document.head.appendChild(script);
            }
        });

        const initYandexMap = () => {
            window.ymaps.ready(() => {
                const myMap = new window.ymaps.Map(map.value, {
                    center: [51.660781, 39.200296], // Координаты Воронежа
                    zoom: 15,
                    controls: ['zoomControl']
                });

                const myPlacemark = new window.ymaps.Placemark([51.660781, 39.200296], {
                    hintContent: 'Наш офис',
                    balloonContent: 'Россия, г. Воронеж, ул. Примерная, 123'
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                    iconImageSize: [30, 30],
                    iconImageOffset: [-15, -15]
                });

                myMap.geoObjects.add(myPlacemark);
            });
        };

        return {
            map
        };
    }
};
</script>

<style scoped>
:root {
    --primary-color: rgb(135, 217, 217);
    --hover-color: rgb(132, 199, 199);
    --text-color: #333;
    --light-bg: #f9f9f9;
    --white: #fff;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contacts-page {
    background-color: var(--light-bg);
    min-height: 100vh;
    padding: 0rem 0;
    margin-top: 200px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.contacts-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
}

.page-title {
    text-align: center;
    color: var(--text-color);
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.page-subtitle {
    text-align: center;
    color: var(--text-color);
    font-size: 1.1rem;
    margin-bottom: 2rem;
    opacity: 0.8;
}

.contacts-content {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    margin-top: 2rem;
}

.map-container {
    flex: 1 1 60%;
    min-width: 300px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: var(--shadow);
}

.yandex-map {
    width: 100%;
    height: 400px;
    background-color: #eee;
}

.contact-info {
    flex: 1 1 35%;
    min-width: 300px;
    background: var(--white);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: var(--shadow);
}

.contact-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1.5rem;
}

.contact-icon {
    margin-right: 1rem;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(135, 217, 217, 0.1);
    border-radius: 50%;
    flex-shrink: 0;
}

.contact-icon svg {
    width: 20px;
    height: 20px;
}

.contact-text h3 {
    margin: 0 0 0.3rem 0;
    color: var(--text-color);
    font-size: 1.2rem;
}

.contact-text a,
.contact-text p {
    margin: 0;
    color: var(--text-color);
    text-decoration: none;
    opacity: 0.8;
    transition: all 0.3s ease;
}

.contact-text a:hover {
    color: var(--primary-color);
    opacity: 1;
}

.social-links {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: rgba(135, 217, 217, 0.1);
    border-radius: 50%;
    transition: all 0.3s ease;
}

.social-link:hover {
    background-color: var(--primary-color);
}

.social-link:hover svg {
    fill: var(--white);
}

.social-link svg {
    width: 20px;
    height: 20px;
    transition: all 0.3s ease;
}

@media (max-width: 768px) {
    .contacts-content {
        flex-direction: column;
    }

    .map-container,
    .contact-info {
        flex: 1 1 100%;
    }

    .page-title {
        font-size: 2rem;
    }
}
</style>