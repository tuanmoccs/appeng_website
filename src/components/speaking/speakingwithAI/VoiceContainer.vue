<template>
  <div class="chat-container">
    <VoiceChatHeader />
    <VoiceControls :is-recording="isRecording" :is-speaking="isSpeaking" :status="status"
      @toggle-recording="toggleRecording" @toggle-settings="showSettings = !showSettings" />
  </div>
</template>
<script>
import VoiceChatHeader from './VoiceChatHeader.vue';
import MessageList from './MessageList.vue';
import VoiceControls from './VoiceControls.vue';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
export default {
  name: "ChatContainer",
  components: { VoiceChatHeader, VoiceControls, MessageList },
  data() {
    return {
      settings: {
        apiKey: OPENAI_API_KEY,
        model: 'gpt-3.5-turbo',
        language: 'en-US',
        autoSpeak: true,
      },
      isRecording: false,
      isSpeaking: false,
      showSettings: false,
      status: 'Sẵn sàng',
      messages: [],
      recognition: null,
      synthesis: window.speechSynthesis
    }
  },
  mounted() {
    this.initSpeechRecognition();
  },
  methods: {
    initSpeechRecognition() {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = this.settings.language;

        this.recognition.onresult = async (event) => {
          const transcript = event.results[0][0].transcript;
          this.status = 'Đã nhận: ' + transcript.substring(0, 30) + '...';
          this.addMessage('user', transcript);
          await this.sendToOpenAI(transcript);
        };

        this.recognition.onerror = (event) => {
          this.status = 'Lỗi: ' + event.error;
          this.isRecording = false;
        };

        this.recognition.onend = () => {
          this.isRecording = false;
          if (this.status.includes('Đang nghe')) {
            this.status = 'Sẵn sàng';
          }
        };
      } else {
        alert('Trình duyệt của bạn không hỗ trợ Speech Recognition!');
      }
    },
    toggleRecording() {
      if (this.isRecording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
    },
    startRecording() {
      if (this.recognition) {
        this.isRecording = true;
        this.status = 'Đang nghe...';
        this.recognition.start();
      }
    },
    stopRecording() {
      if (this.recognition && this.isRecording) {
        this.recognition.stop();
        this.isRecording = false;
      }
    },
    async sendToOpenAI(text) {
      this.status = 'Đang xử lý...';

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.settings.apiKey}`
          },
          body: JSON.stringify({
            model: this.settings.model,
            messages: [
              {
                role: 'system',
                content: 'You are a helpful English conversation partner. Keep responses concise and natural, like in a real conversation.'
              },
              ...this.messages.map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: text }
            ],
            max_tokens: 150,
            temperature: 0.7
          })
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        this.addMessage('assistant', aiResponse);
        this.status = 'Hoàn thành';

        if (this.settings.autoSpeak) {
          this.speakText(aiResponse);
        }

      } catch (error) {
        console.error('Error:', error);
        this.status = 'Lỗi: ' + error.message;
        alert('Có lỗi xảy ra: ' + error.message);
      }
    },
    speakText(text) {
      if ('speechSynthesis' in window) {
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.settings.language;
        utterance.rate = 0.9;
        utterance.pitch = 1;

        utterance.onstart = () => {
          this.isSpeaking = true;
          this.status = 'Đang nói...';
        };

        utterance.onend = () => {
          this.isSpeaking = false;
          this.status = 'Sẵn sàng';
        };

        utterance.onerror = () => {
          this.isSpeaking = false;
          this.status = 'Sẵn sàng';
        };

        this.synthesis.speak(utterance);
      }
    },
    addMessage(role, content) {
      this.messages.push({
        role,
        content,
        timestamp: new Date()
      });
    }
  }
}
</script>
<style scoped>
.chat-container {
  max-width: 900px;
  margin: 0 auto;
  margin-top: 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}
</style>
