<template>
  <defaultlayout>
    <RegisterComponent />
  </defaultlayout>
</template>
<script>
import RegisterComponent from '@/components/auth/RegisterComponent.vue';
import defaultlayout from '@/layout/default.vue';
export default {
  name: 'Register',
  components: { RegisterComponent, defaultlayout }
}
</script>