<template>
  <defaultlayout>
    <VoiceContainer />
  </defaultlayout>
</template>
<script>
import defaultlayout from '@/layout/default.vue';
import VoiceContainer from '@/components/speaking/speakingwithAI/VoiceContainer.vue';
export default {
  name: 'Speaking with AI',
  components: { defaultlayout, VoiceContainer }
}
</script>