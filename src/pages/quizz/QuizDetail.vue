<template>
  <defaultlayout>
    <div class="container py-5" style="margin-top: 50px;">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <!-- Test Content -->
      <div v-if="!loading && !error && quiz">
        <!-- Test Header -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="card shadow-sm">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h1 class="h3 mb-2">{{ quiz.title }}</h1>
                    <p class="text-muted mb-3">{{ quiz.description }}</p>
                    <div class="d-flex gap-3">
                      <span class="badge bg-primary">{{ quiz.difficulty || 'Intermediate' }}</span>
                      <span class="badge bg-success">
                        <i class="fas fa-clock me-1"></i>
                        {{ quiz.time_limit || 30 }} minutes
                      </span>
                      <span class="badge bg-info">
                        <i class="fas fa-question-circle me-1"></i>
                        {{ questions.length }} questions
                      </span>
                    </div>
                  </div>
                  <button @click="goBack" class="btn btn-outline-secondary">
                    <i class="fas fa-arrow-left me-2"></i>
                    Back to Tests
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="row mb-4" v-if="quizStarted">
          <div class="col-12">
            <div class="card">
              <div class="card-body py-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="fw-bold">Progress</span>
                  <span class="text-muted">
                    Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
                  </span>
                </div>
                <div class="progress">
                  <div class="progress-bar" role="progressbar" :style="{ width: progressPercentage + '%' }"
                    :aria-valuenow="progressPercentage" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <div class="d-flex justify-content-between mt-2">
                  <small class="text-muted">Time remaining: {{ formatTime(timeRemaining) }}</small>
                  <small class="text-muted">{{ progressPercentage.toFixed(0) }}% completed</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Start Test Screen -->
        <div v-if="!quizStarted && !quizCompleted" class="row">
          <div class="col-lg-8 mx-auto">
            <div class="card shadow">
              <div class="card-body text-center py-5">
                <i class="fas fa-play-circle fa-4x text-primary mb-4"></i>
                <h3 class="mb-3">Ready to start the test?</h3>
                <p class="text-muted mb-4">
                  You have {{ quiz.time_limit || 30 }} minutes to complete {{ questions.length }} questions.
                  Make sure you have a stable internet connection.
                </p>
                <div class="d-grid gap-2 d-md-block">
                  <button @click="startQuiz" class="btn btn-primary btn-lg px-5">
                    <i class="fas fa-play me-2"></i>
                    Start Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Question Display -->
        <div v-if="quizStarted && !quizCompleted && currentQuestion" class="row">
          <div class="col-lg-8 mx-auto">
            <div class="card shadow">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0">
                  <i class="fas fa-question-circle me-2"></i>
                  Question {{ currentQuestionIndex + 1 }}
                </h5>
              </div>
              <div class="card-body">
                <div class="question-content mb-4">
                  <h6 class="fw-bold mb-3">{{ currentQuestion.question }}</h6>

                  <!-- Question Image if exists -->
                  <div v-if="currentQuestion.image" class="mb-3">
                    <img :src="currentQuestion.image" class="img-fluid rounded"
                      :alt="'Question ' + (currentQuestionIndex + 1)">
                  </div>
                </div>

                <!-- Answer Options -->
                <div class="answers">
                  <div v-for="(option, index) in currentQuestionOptions" :key="index" class="form-check mb-3">
                    <input class="form-check-input" type="radio" :name="'question_' + currentQuestion.id"
                      :id="'option_' + currentQuestion.id + '_' + index" :value="option"
                      v-model="userAnswers[currentQuestion.id]">
                    <label class="form-check-label w-100" :for="'option_' + currentQuestion.id + '_' + index">
                      <div class="d-flex align-items-center">
                        <span class="badge bg-light text-dark me-3">
                          {{ String.fromCharCode(65 + index) }}
                        </span>
                        <span>{{ option }}</span>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Navigation Buttons -->
                <div class="d-flex justify-content-between mt-4">
                  <button @click="previousQuestion" class="btn btn-outline-secondary"
                    :disabled="currentQuestionIndex === 0">
                    <i class="fas fa-chevron-left me-2"></i>
                    Previous
                  </button>

                  <div class="d-flex gap-2">
                    <button v-if="currentQuestionIndex < questions.length - 1" @click="nextQuestion"
                      class="btn btn-primary">
                      Next
                      <i class="fas fa-chevron-right ms-2"></i>
                    </button>

                    <button v-if="currentQuestionIndex === questions.length - 1" @click="submitQuiz"
                      class="btn btn-success">
                      <i class="fas fa-check me-2"></i>
                      Submit Test
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Test Results -->
        <div v-if="quizCompleted && quizResult" class="row">
          <div class="col-lg-10 mx-auto">
            <div class="card shadow">
              <div class="card-header bg-success text-white text-center">
                <h4 class="mb-0">
                  <i class="fas fa-trophy me-2"></i>
                  Test Completed!
                </h4>
              </div>
              <div class="card-body text-center py-4">
                <!-- Score Summary -->
                <div class="row mb-4">
                  <div class="col-md-4">
                    <div class="result-stat">
                      <h3 class="text-primary">{{ Math.round(quizResult.percentage) }}%</h3>
                      <p class="text-muted">Your Score</p>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="result-stat">
                      <h3 class="text-success">{{ quizResult.score }}/{{ quizResult.total_questions }}</h3>
                      <p class="text-muted">Correct Answers</p>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="result-stat">
                      <h3 class="text-info">{{ quizResult.correct_answers?.length || 0 }}</h3>
                      <p class="text-muted">Questions Right</p>
                    </div>
                  </div>
                </div>
                <!-- Action Buttons -->
                <div class="d-grid gap-2 d-md-block mb-4">
                  <button @click="showReview = !showReview" class="btn btn-info me-2">
                    <i class="fas fa-eye me-2"></i>
                    {{ showReview ? 'Hide Review' : 'Review Answers' }}
                  </button>
                  <button @click="retakeQuiz" class="btn btn-primary me-2">
                    <i class="fas fa-redo me-2"></i>
                    Retake Test
                  </button>
                  <button @click="goBack" class="btn btn-outline-secondary">
                    <i class="fas fa-list me-2"></i>
                    Back to Tests
                  </button>
                </div>

                <!-- Detailed Review Section -->
                <div v-if="showReview && quizResult.incorrect_answers" class="mt-4">
                  <div class="card">
                    <div class="card-header bg-light">
                      <h5 class="mb-0 text-start">
                        <i class="fas fa-clipboard-list me-2"></i>
                        Answer Review
                      </h5>
                    </div>
                    <div class="card-body p-0">
                      <!-- Show all questions with answers -->
                      <div v-for="(question, index) in questions" :key="question.id" class="border-bottom p-4">

                        <!-- Question Header -->
                        <div class="d-flex align-items-start justify-content-between mb-3">
                          <h6 class="fw-bold mb-0">
                            <span class="badge me-2"
                              :class="isQuestionCorrect(question.id) ? 'bg-success' : 'bg-danger'">
                              {{ index + 1 }}
                            </span>
                            {{ question.question }}
                          </h6>
                          <span class="badge" :class="isQuestionCorrect(question.id) ? 'bg-success' : 'bg-danger'">
                            <i class="fas" :class="isQuestionCorrect(question.id) ? 'fa-check' : 'fa-times'"></i>
                            {{ isQuestionCorrect(question.id) ? 'Correct' : 'Wrong' }}
                          </span>
                        </div>

                        <!-- Answer Options -->
                        <div class="row">
                          <div class="col-md-6">
                            <div class="mb-3">
                              <label class="form-label fw-bold text-muted">Your Answer:</label>
                              <div class="p-2 rounded"
                                :class="isQuestionCorrect(question.id) ? 'bg-success bg-opacity-10 border border-success' : 'bg-danger bg-opacity-10 border border-danger'">
                                <i class="fas me-2"
                                  :class="isQuestionCorrect(question.id) ? 'fa-check text-success' : 'fa-times text-danger'"></i>
                                {{ userAnswers[question.id] || 'No answer' }}
                              </div>
                            </div>
                          </div>

                          <div class="col-md-6" v-if="!isQuestionCorrect(question.id)">
                            <div class="mb-3">
                              <label class="form-label fw-bold text-muted">Correct Answer:</label>
                              <div class="p-2 rounded bg-success bg-opacity-10 border border-success">
                                <i class="fas fa-check text-success me-2"></i>
                                {{ getCorrectAnswerForQuestion(question.id) }}
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- All Options Display -->
                        <div class="mt-3">
                          <label class="form-label fw-bold text-muted">All Options:</label>
                          <div class="row">
                            <div v-for="(option, optIndex) in getOptionsForQuestion(question)" :key="optIndex"
                              class="col-md-6 mb-2">
                              <div class="p-2 rounded border" :class="{
                                'bg-success bg-opacity-10 border-success': option === getCorrectAnswerForQuestion(question.id),
                                'bg-danger bg-opacity-10 border-danger': option === userAnswers[question.id] && !isQuestionCorrect(question.id),
                                'border-light': option !== getCorrectAnswerForQuestion(question.id) && option !== userAnswers[question.id]
                              }">
                                <span class="badge bg-light text-dark me-2">
                                  {{ String.fromCharCode(65 + optIndex) }}
                                </span>
                                {{ option }}
                                <i v-if="option === getCorrectAnswerForQuestion(question.id)"
                                  class="fas fa-check text-success ms-2"></i>
                                <i v-else-if="option === userAnswers[question.id] && !isQuestionCorrect(question.id)"
                                  class="fas fa-times text-danger ms-2"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ChatbotQuiz v-if="quizStarted && !quizCompleted && quiz && currentQuestion" :test-data="quiz"
      :current-question="currentQuestion" :current-question-number="currentQuestionIndex + 1" :show-toggle="true" />
  </defaultlayout>
</template>

<script>
import defaultlayout from '@/layout/default.vue';
import ChatbotQuiz from '@/components/chatbot/ChatbotQuiz.vue';
export default {
  name: 'TestDetail',
  components: { defaultlayout, ChatbotQuiz },
  data() {
    return {
      quiz: null,
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      quizStarted: false,
      quizCompleted: false,
      quizResult: null,
      loading: true,
      error: null,
      timeRemaining: 0,
      timer: null,
      showReview: false
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || null;
    },
    currentQuestionOptions() {
      if (!this.currentQuestion) return [];
      return this.getOptionsForQuestion(this.currentQuestion);
    },
    progressPercentage() {
      if (this.questions.length === 0) return 0;
      return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
    }
  },
  async mounted() {
    await this.loadQuiz();
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    async loadQuiz() {
      try {
        this.loading = true;
        this.error = null;

        const quizId = this.$route.params.id;
        const quiz = await this.$api.quiz.getById(quizId);

        console.log('Quiz API response:', quiz);

        if (quiz && quiz.id) { // check đơn giản
          this.quiz = quiz;
          this.questions = quiz.questions || [];
          this.timeRemaining = (quiz.time_limit || 30) * 60; // giây
        } else {
          this.error = 'Quiz data is invalid.';
        }
      } catch (error) {
        console.error('Error loading test:', error);
        this.error = 'Failed to load test. Please try again later.';
      } finally {
        this.loading = false;
      }
    },


    getOptionsForQuestion(question) {
      if (!question || !question.options) return [];

      let options = question.options;

      // If options is a string, try to parse it as JSON
      if (typeof options === 'string') {
        try {
          options = JSON.parse(options);
        } catch (e) {
          // If parsing fails, split by comma or return as single option
          options = options.includes(',') ? options.split(',') : [options];
        }
      }

      // Ensure it's an array
      if (!Array.isArray(options)) {
        return [];
      }

      return options.map(option => {
        // Handle both string options and object options with text property
        return typeof option === 'object' && option.text ? option.text : option;
      });
    },

    startQuiz() {
      this.quizStarted = true;
      this.startTimer();
    },

    startTimer() {
      this.timer = setInterval(() => {
        if (this.timeRemaining > 0) {
          this.timeRemaining--;
        } else {
          this.submitQuiz();
        }
      }, 1000);
    },

    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },

    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      }
    },

    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      }
    },

    async submitQuiz() {
      try {
        if (this.timer) {
          clearInterval(this.timer);
        }

        const formattedAnswers = {};
        Object.keys(this.userAnswers).forEach(questionId => {
          formattedAnswers[parseInt(questionId)] = this.userAnswers[questionId];
        });

        const result = await this.$api.quiz.submit(this.quiz.id, {
          answers: formattedAnswers,
          time_taken: (this.quiz.time_limit * 60) - this.timeRemaining
        });

        console.log('Quiz submit result:', result);

        if (result && result.quiz_id) { // check đơn giản
          this.quizResult = result;
          this.quizCompleted = true;
          this.quizStarted = false;
        } else {
          this.error = 'Invalid quiz result from server.';
        }
      } catch (error) {
        console.error('Error submitting test:', error);
        this.error = 'Failed to submit test. Please try again.';
      }
    },


    retakeQuiz() {
      this.quizStarted = false;
      this.quizCompleted = false;
      this.quizResult = null;
      this.currentQuestionIndex = 0;
      this.userAnswers = {};
      this.timeRemaining = (this.quiz.time_limit || 30) * 60;
      this.showReview = false;
    },

    goBack() {
      this.$router.push('/quizzes');
    },

    isQuestionCorrect(questionId) {
      if (!this.quizResult) return false;
      return this.quizResult.correct_answers?.includes(questionId) || false;
    },

    getCorrectAnswerForQuestion(questionId) {
      if (!this.quizResult || !this.quizResult.incorrect_answers) return '';

      const incorrectAnswer = this.quizResult.incorrect_answers.find(
        item => item.question_id === questionId
      );

      return incorrectAnswer ? incorrectAnswer.correct_answer : '';
    }
  }
}
</script>

<style scoped>
.result-stat {
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f9fa;
  margin-bottom: 20px;
}

.form-check-label {
  cursor: pointer;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.form-check-input:checked+.form-check-label {
  background-color: #e3f2fd;
  border-color: #2196f3;
}

.form-check-label:hover {
  background-color: #f5f5f5;
}

.question-content {
  font-size: 1.1rem;
  line-height: 1.6;
}

.progress {
  height: 8px;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.bg-light-success {
  background-color: rgba(25, 135, 84, 0.05) !important;
}

.bg-light-danger {
  background-color: rgba(220, 53, 69, 0.05) !important;
}

.result-stat h3 {
  font-size: 2.5rem;
  font-weight: bold;
}

.review-question {
  transition: all 0.3s ease;
}

.review-question:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.option-correct {
  border-left: 4px solid #28a745;
}

.option-wrong {
  border-left: 4px solid #dc3545;
}

.option-neutral {
  border-left: 4px solid #6c757d;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
