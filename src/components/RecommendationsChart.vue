<template>
    <div class="p-6 bg-white rounded-xl shadow-lg">
        <h2 class="text-xl font-semibold mb-4">Рекомендации по покупкам</h2>

        <button @click="fetchRecommendations" class="px-4 py-2 bg-blue-500 text-white rounded mb-4">
            Обновить рекомендации
        </button>

        <div v-if="loading" class="text-gray-500 mt-2">Загрузка...</div>
        <div v-else-if="error" class="text-red-500 mt-2">{{ error }}</div>
        <div v-else>
            <h3 class="text-lg font-semibold mt-4">Топ рекомендаций</h3>
            <div class="h-96">
                <BarChart v-if="recommendations.length" :chart-data="recommendations" />
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import BarChart from "@/components/BarChart.vue";

export default {
    components: { BarChart },
    data() {
        return {
            recommendations: [],
            loading: false,
            error: null
        };
    },
    methods: {
        async fetchRecommendations() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get('http://localhost:5000/api/recommendations');
                this.recommendations = response.data.recommendations || [];
            } catch (error) {
                console.error('Ошибка при получении рекомендаций:', error);
                this.error = 'Не удалось загрузить рекомендации';
            } finally {
                this.loading = false;
            }
        }
    },
    mounted() {
        this.fetchRecommendations();
    }
};
</script>

<style scoped>
.h-96 {
   
}
</style>