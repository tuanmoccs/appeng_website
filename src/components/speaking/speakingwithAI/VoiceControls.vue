<template>
  <div class="controls">
    <div class="row align-items-center">
      <div class="col-12 text-center mb-3">
        <span :class="['status-badge', statusClass]">
          <span v-if="isSpeaking" class="speaking-indicator"></span>
          {{ status }}
        </span>
      </div>
      <div class="col-12 text-center mb-3">
        <button @click="$emit('toggle-recording')"
          :class="['mic-button', 'btn', isRecording ? 'btn-danger recording' : 'btn-primary']" :disabled="isSpeaking">
          <i :class="isRecording ? 'fas fa-stop' : 'fas fa-microphone'"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VoiceControl',
  props: {
    isRecording: Boolean,
    isSpeaking: Boolean,
    status: String
  },
  emits: ['toggle-recording'],
  computed: {
    statusClass() {
      if (this.isRecording) return 'bg-danger text-white';
      if (this.isSpeaking) return 'bg-success text-white';
      return 'bg-secondary text-white';
    }
  }
}
</script>
<style scoped>
.controls {
  padding: 20px;
  background: white;
  border-top: 1px solid #dee2e6;
}

.mic-button {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  font-size: 32px;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.mic-button:hover {
  transform: scale(1.1);
}

.mic-button.recording {
  animation: pulse 1.5s infinite;
  background: #dc3545 !important;
}

@keyframes pulse {

  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
  }

  50% {
    box-shadow: 0 0 0 20px rgba(220, 53, 69, 0);
  }
}

.status-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.speaking-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #28a745;
  border-radius: 50%;
  margin-right: 8px;
  animation: blink 1s infinite;
}

@keyframes blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
  }
}
</style>