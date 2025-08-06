<template>
  <div>
    <!-- Chatbot Toggle Button -->
    <button v-if="showToggle" @click="toggleChatbot" class="chatbot-toggle btn" :class="{ 'active': showChatbot }">
      <i class="fas" :class="showChatbot ? 'fa-times' : 'fa-robot'"></i>
    </button>

    <!-- Chatbot Container -->
    <div class="chatbot-container" :class="{ 'show': showChatbot }">
      <!-- Chatbot Header -->
      <div class="chatbot-header">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-0">
              <i class="fas fa-robot me-2"></i>
              AI Assistant
            </h6>
            <small class="opacity-75">Hỗ trợ câu hỏi {{ currentQuestionNumber }}</small>
          </div>
          <button @click="closeChatbot" class="btn btn-sm text-white p-0">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Chatbot Messages -->
      <div class="chatbot-messages" ref="messagesContainer">
        <div v-for="(message, index) in chatMessages" :key="index" class="message" :class="message.role">
          <div class="message-content">
            <div v-if="message.role === 'assistant'" class="d-flex align-items-start">
              <div class="avatar me-2">
                <i class="fas fa-robot text-primary"></i>
              </div>
              <div class="flex-grow-1" v-html="formatMessage(message.content)"></div>
            </div>
            <div v-else>
              {{ message.content }}
            </div>
          </div>
          <small class="text-muted d-block mt-1" style="font-size: 0.75rem;">
            {{ formatTime(message.timestamp) }}
          </small>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="message bot">
          <div class="message-content">
            <div class="typing-indicator">
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chatbot Input -->
      <div class="chatbot-input">
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Hỏi về câu hỏi này..." v-model="chatInput"
            @keypress.enter="sendMessage" :disabled="isTyping">
          <button class="btn btn-primary" type="button" @click="sendMessage" :disabled="isTyping || !chatInput.trim()">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>

        <!-- Quick Questions -->
        <div class="mt-2">
          <div class="d-flex flex-wrap gap-1">
            <button v-for="question in quickQuestions" :key="question" @click="sendQuickQuestion(question)"
              class="btn btn-outline-primary btn-sm" :disabled="isTyping">
              {{ question }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// OpenAI Service
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY; // Thay bằng API key của bạn

class OpenAIService {
  constructor() {
    this.apiKey = OPENAI_API_KEY;
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async sendMessage(messages) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'API Error');
      }

      return data.choices[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời câu hỏi này.';
    } catch (error) {
      console.error('OpenAI Service Error:', error);
      throw error;
    }
  }

  createSystemPrompt(testData, currentQuestion) {
    return `Bạn là một AI assistant chuyên về tiếng Anh, hỗ trợ học sinh trong bài quiz "${testData.title}".

THÔNG TIN BÀI Quiz:
- Tiêu đề: ${testData.title}
- Mô tả: ${testData.description}
- Tổng số câu hỏi: ${testData.questions?.length || 0}
- Thời gian: ${testData.duration || 30} phút

CÂU HỎI HIỆN TẠI:
- Câu hỏi: ${currentQuestion.question}
- Các lựa chọn: ${currentQuestion.options.map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt.text || opt}`).join(', ')}

VAI TRÒ CỦA BẠN:
1. Giải thích ngữ pháp và từ vựng trong câu hỏi
2. Hướng dẫn cách làm bài test hiệu quả
3. Giải đáp thắc mắc về nội dung tiếng Anh
4. Đưa ra gợi ý học tập
5. Không được đưa ra đáp án đúng

QUY TẮC:
- Trả lời bằng tiếng Việt khi người dùng hỏi tiếng Việt còn người dùng hỏi Tiếng Anh bạn hãy trả lời tiếng Anh
- Giải thích rõ ràng, dễ hiểu, có thể dịch ra tiếng Việt khi mà người dùng chưa hiểu rõ
- Khuyến khích học sinh tự suy luận khi nào người dùng hỏi đáp án của câu hỏi là gì thì mới đưa ra đáp án còn không chỉ giải thích để người dùng hiểu và tự trả lời
- Đưa ra ví dụ minh họa khi cần thiết
- Tập trung vào câu hỏi hiện tại`;
  }

  async analyzeCurrentQuestion(testData, currentQuestion, userQuery) {
    const systemPrompt = this.createSystemPrompt(testData, currentQuestion);

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userQuery }
    ];

    return await this.sendMessage(messages);
  }
}

export default {
  name: 'ChatbotTest',
  props: {
    testData: {
      type: Object,
      required: true
    },
    currentQuestion: {
      type: Object,
      required: true
    },
    currentQuestionNumber: {
      type: Number,
      required: true
    },
    showToggle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showChatbot: false,
      chatMessages: [],
      chatInput: '',
      isTyping: false,
      openAIService: new OpenAIService(),
      quickQuestions: [
        // 'Giải thích câu hỏi này',
        // 'Gợi ý làm bài',
        // 'Ngữ pháp liên quan'
      ]
    }
  },
  watch: {
    currentQuestionNumber() {
      // Reset chatbot when question changes
      this.resetChat();
    }
  },
  methods: {
    toggleChatbot() {
      this.showChatbot = !this.showChatbot;
      if (this.showChatbot && this.chatMessages.length === 0) {
        this.sendWelcomeMessage();
      }
    },

    closeChatbot() {
      this.showChatbot = false;
    },

    resetChat() {
      this.chatMessages = [];
      if (this.showChatbot) {
        this.sendWelcomeMessage();
      }
    },

    sendWelcomeMessage() {
      if (!this.currentQuestion) return;

      const welcomeMessage = {
        role: 'assistant',
        content: `Chào bạn! Tôi là AI assistant hỗ trợ bạn với câu hỏi ${this.currentQuestionNumber}. 

**Câu hỏi hiện tại:** ${this.currentQuestion.question}

Bạn có thể hỏi tôi về:
- Giải thích ngữ pháp
- Phân tích từ vựng  
- Gợi ý cách làm bài
- Hoặc bất kỳ thắc mắc nào khác

Hãy đặt câu hỏi nhé! 😊`,
        timestamp: Date.now()
      };

      this.chatMessages.push(welcomeMessage);
      this.scrollToBottom();
    },

    async sendMessage() {
      if (!this.chatInput.trim() || this.isTyping) return;

      const userMessage = {
        role: 'user',
        content: this.chatInput.trim(),
        timestamp: Date.now()
      };

      this.chatMessages.push(userMessage);
      const userQuery = this.chatInput.trim();
      this.chatInput = '';
      this.isTyping = true;

      this.scrollToBottom();

      try {
        const response = await this.openAIService.analyzeCurrentQuestion(
          this.testData,
          this.currentQuestion,
          userQuery
        );

        const botMessage = {
          role: 'assistant',
          content: response,
          timestamp: Date.now()
        };

        this.chatMessages.push(botMessage);
      } catch (error) {
        console.error('Chat error:', error);
        const errorMessage = {
          role: 'assistant',
          content: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',
          timestamp: Date.now()
        };
        this.chatMessages.push(errorMessage);
      } finally {
        this.isTyping = false;
        this.scrollToBottom();
      }
    },

    sendQuickQuestion(question) {
      this.chatInput = question;
      this.sendMessage();
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },

    formatMessage(content) {
      return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
    },

    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
}
</script>

<style scoped>
.chatbot-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1050;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 24px;
  transition: all 0.3s ease;
}

.chatbot-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.chatbot-toggle.active {
  background: linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%);
}

.chatbot-container {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 400px;
  max-height: 500px;
  z-index: 1040;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  background: white;
  overflow: hidden;
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.3s ease-in-out;
}

.chatbot-container.show {
  transform: translateY(0);
  opacity: 1;
}

.chatbot-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
}

.chatbot-messages {
  max-height: 350px;
  overflow-y: auto;
  padding: 15px;
  background: #f8f9fa;
}

.chatbot-messages::-webkit-scrollbar {
  width: 6px;
}

.chatbot-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.chatbot-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.chatbot-messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.message {
  margin-bottom: 15px;
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-content {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
  line-height: 1.4;
  font-size: 14px;
}

.message.user {
  text-align: right;
}

.message.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.message.assistant .message-content {
  background: white;
  color: #333;
  border: 1px solid #e9ecef;
  margin-right: auto;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chatbot-input {
  padding: 15px;
  border-top: 1px solid #e9ecef;
  background: white;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #999;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {

  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.btn-outline-primary.btn-sm {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
}

/* Responsive */
@media (max-width: 768px) {
  .chatbot-container {
    width: 320px;
    height: 500px;
    right: 10px;
    bottom: 80px;
  }

  .chatbot-toggle {
    right: 10px;
    bottom: 10px;
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .chatbot-messages {
    height: 350px;
    padding: 10px;
  }

  .message-content {
    font-size: 13px;
    padding: 10px 12px;
  }
}

/* Custom styles for better UX */
.message.assistant .message-content strong {
  color: #667eea;
  font-weight: 600;
}

.message.assistant .message-content em {
  color: #666;
  font-style: normal;
  background: #f0f2ff;
  padding: 2px 4px;
  border-radius: 4px;
}

.input-group .form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-1px);
}

.btn-outline-primary:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
}

.chatbot-container {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.chatbot-header h6 {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.message+.message {
  margin-top: 12px;
}

.message small {
  margin-left: 16px;
  margin-right: 16px;
}

.message.user small {
  text-align: right;
  margin-left: auto;
  margin-right: 16px;
}

.chatbot-toggle i {
  transition: transform 0.3s ease;
}

.chatbot-toggle:hover i {
  transform: rotate(10deg);
}

.chatbot-input .btn {
  border-radius: 8px;
  padding: 8px 12px;
}

.chatbot-input .form-control {
  border-radius: 20px;
  border: 1px solid #e9ecef;
  padding: 10px 16px;
}

.chatbot-input .form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
</style>