import $ from 'jquery'
window.$ = window.jQuery = $
import '@/assets/css/animate.css'
import '@/assets/css/flex-slider.css'
import '@/assets/css/fontawesome.css'
import '@/assets/css/owl.css'
import '@/assets/css/templatemo-scholar.css'
import '@/assets/bootstrap/css/bootstrap.min.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
createApp(App)
  .use(router)
  .mount('#app')