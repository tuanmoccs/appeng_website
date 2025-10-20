<template>
  <div class="messages-container" ref="messagesContainer">
    <div v-if="messages.length === 0" class="text-center text-muted py-5">
      <i class="fas fa-comments fa-3x mb-3"></i>
      <p>Nhấn vào mic để bắt đầu cuộc trò chuyện</p>
    </div>
    <MessageItem v-for="(msg, index) in messages" :key="index" :message="msg" />
  </div>
</template>

<script>
import MessageItem from './ChatMessage.vue';

export default {
  name: 'MessagesList',
  components: {
    MessageItem
  },
  props: {
    messages: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          const container = this.$refs.messagesContainer;
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        });
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.messages-container {
  height: 400px;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
}
</style>