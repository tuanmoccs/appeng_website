<template>
  <div :class="['message', message.role]">
    <div><strong>{{ message.role === 'user' ? 'Bạn' : 'AI' }}:</strong></div>
    <div>{{ message.content }}</div>
    <small class="text-muted d-block mt-1">{{ formatTime(message.timestamp) }}</small>
  </div>
</template>
<script>
export default {
  name: 'ChatMessage',
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatTime(date) {
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
}
</script>
<style scoped>
.message {
  margin-bottom: 15px;
  padding: 12px 16px;
  border-radius: 15px;
  max-width: 80%;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  background: #667eea;
  color: white;
  margin-left: auto;
  text-align: right;
}

.message.assistant {
  background: white;
  color: #333;
  border: 1px solid #dee2e6;
}
</style>
