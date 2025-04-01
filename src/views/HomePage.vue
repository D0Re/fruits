<template>
  <main class="main">
    <div class="main__container container">
      <Slider />
      <SaleSection @open-product="openModal" />
      <AssortmentSection title="Ассортимент" />
      <NewSection @open-product="openModal" />
      <QuestionsSection />
    </div>

    <!-- Модальное окно -->
    <ProductModal v-if="selectedProduct !== null" :isVisible="!!selectedProduct" :product="selectedProduct"
      @close="selectedProduct = null" />
  </main>
</template>

<script>
import Slider from '@/components/AppSlider.vue';
import SaleSection from '@/components/SaleSection.vue';
import AssortmentSection from '@/components/AssortmentSection.vue';
import NewSection from '@/components/NewSection.vue';
import QuestionsSection from '@/components/QuestionsSection.vue';
import ProductModal from '@/components/ProductModal.vue';
import products from '@/assets/data/products.json';

export default {
  name: 'HomePage',
  components: {
    Slider,
    SaleSection,
    AssortmentSection,
    NewSection,
    QuestionsSection,
    ProductModal
  },
  data() {
    return {
      selectedProduct: null
    };
  },
  watch: {
    '$route.params.name': {
      immediate: true,
      handler(productName) {
        if (productName) {
          this.selectedProduct = products.find(p => p.name === productName);
        } else {
          this.selectedProduct = null;
        }
      }
    }
  },
  methods: {
    openModal(product) {
      this.selectedProduct = product;
      this.$router.push({ name: 'ProductPage', params: { name: product.name } });
    },
    closeModal() {
      this.selectedProduct = null;
      this.$router.push({ path: '/' });
    }
  }
};
</script>
<style scoped>
.main {
  padding-top: 80px;
  margin-top: 130px;
}
</style>