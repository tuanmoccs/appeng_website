<template>
  <div>
    <Header />
    <slot />
    <Footer />
  </div>
</template>
<script>
import Header from '@/components/partial/Header.vue'
import Footer from '@/components/partial/Footer.vue'
export default {
  name: 'LayoutDefault',
  components: { Header, Footer },
  mounted() {
    this.loadScripts();
  },
  methods: {
    async loadScripts() {
      try {
        // Load jQuery first
        await import('jquery');

        // Then load other scripts
        await import('@/assets/js/counter');
        await import('@/assets/js/custom');
        await import('@/assets/js/owl-carousel');
        await import('@/assets/jquery/jquery');
        await import('@/assets/jquery/jquery.slim');
      } catch (error) {
        console.error('Error loading scripts:', error);
      }
    }
  }
}
</script>