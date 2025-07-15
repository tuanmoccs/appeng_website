<template>
  <defaultlayout>
    <LoginComponent />
  </defaultlayout>
</template>
<script>
import defaultlayout from '@/layout/default.vue';
import LoginComponent from '@/components/auth/LoginComponent.vue';
export default {
  name: 'Login',
  components: { defaultlayout, LoginComponent }
}
</script>