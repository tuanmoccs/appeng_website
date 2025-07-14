<template>
  <defaultlayout>
    <banner />
    <service />
    <lesson />
    <testimonials />
    <event />
  </defaultlayout>
</template>
<script>
import defaultlayout from '@/layout/default.vue';
import banner from '@/components/home/banner.vue';
import service from '@/components/home/service.vue';
import lesson from '@/components/home/lesson.vue';
import testimonials from '@/components/home/testimonials.vue';
import event from '@/components/home/event.vue';
export default {
  name: 'Trang chu',
  components: { defaultlayout, banner, service, lesson, testimonials, event }
}
</script>