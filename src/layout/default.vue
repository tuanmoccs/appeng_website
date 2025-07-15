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
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    // 🧠 Load owl-carousel trước, rồi mới load custom.js
    loadScript('https://code.jquery.com/jquery-3.6.0.min.js')
      .then(() => loadScript('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js'))
      .then(() => loadScript('/js/custom.js'))
      .catch((err) => {
        console.error('Script loading failed:', err);
      });
  }
}
</script>