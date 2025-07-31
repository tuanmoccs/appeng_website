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
      <div v-if="!loading && !error && test">
        <!-- Test Header -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="card shadow-sm">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h1 class="h3 mb-2">{{ test.title }}</h1>
                    <p class="text-muted mb-3">{{ test.description }}</p>
                    <div class="d-flex gap-3">
                      <span class="badge bg-primary">{{ test.difficulty || 'Intermediate' }}</span>
                      <span class="badge bg-success">
                        <i class="fas fa-clock me-1"></i>
                        {{ test.duration || 30 }} minutes
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
        <div class="row mb-4" v-if="testStarted">
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
        <div v-if="!testStarted && !testCompleted" class="row">
          <div class="col-lg-8 mx-auto">
            <div class="card shadow">
              <div class="card-body text-center py-5">
                <i class="fas fa-play-circle fa-4x text-primary mb-4"></i>
                <h3 class="mb-3">Ready to start the test?</h3>
                <p class="text-muted mb-4">
                  You have {{ test.duration || 30 }} minutes to complete {{ questions.length }} questions.
                  Make sure you have a stable internet connection.
                </p>
                <div class="d-grid gap-2 d-md-block">
                  <button @click="startTest" class="btn btn-primary btn-lg px-5">
                    <i class="fas fa-play me-2"></i>
                    Start Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Question Display -->
        <div v-if="testStarted && !testCompleted && currentQuestion" class="row">
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
                  <div v-for="(option, index) in currentQuestion.options" :key="index" class="form-check mb-3">
                    <input class="form-check-input" type="radio" :name="'question_' + currentQuestion.id"
                      :id="'option_' + currentQuestion.id + '_' + index" :value="option.text || option"
                      v-model="userAnswers[currentQuestion.id]">
                    <label class="form-check-label w-100" :for="'option_' + currentQuestion.id + '_' + index">
                      <div class="d-flex align-items-center">
                        <span class="badge bg-light text-dark me-3">
                          {{ option.key || String.fromCharCode(65 + index) }}
                        </span>
                        <span>{{ option.text || option }}</span>
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

                    <button v-if="currentQuestionIndex === questions.length - 1" @click="submitTest"
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
        <div v-if="testCompleted && testResult" class="row">
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
                  <div class="col-md-6">
                    <div class="result-stat">
                      <h3 class="text-primary">{{ testResult.score }}%</h3>
                      <p class="text-muted">Your Score</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="result-stat">
                      <h3 class="text-success">{{ testResult.correct_answers }}/{{ testResult.total_questions }}</h3>
                      <p class="text-muted">Correct Answers</p>
                    </div>
                  </div>
                </div>

                <!-- Pass/Fail Status -->
                <div class="mb-4">
                  <div class="alert" :class="testResult.is_passed ? 'alert-success' : 'alert-warning'">
                    <i class="fas me-2"
                      :class="testResult.is_passed ? 'fa-check-circle' : 'fa-exclamation-triangle'"></i>
                    {{ testResult.is_passed ? 'Congratulations! You passed the test.' : 'Keep practicing!' }}
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="d-grid gap-2 d-md-block mb-4">
                  <button @click="showReview = !showReview" class="btn btn-info me-2">
                    <i class="fas fa-eye me-2"></i>
                    {{ showReview ? 'Hide Review' : 'Review Answers' }}
                  </button>
                  <button @click="retakeTest" class="btn btn-primary me-2">
                    <i class="fas fa-redo me-2"></i>
                    Retake Test
                  </button>
                  <button @click="goBack" class="btn btn-outline-secondary">
                    <i class="fas fa-list me-2"></i>
                    Back to Tests
                  </button>
                </div>

                <!-- Detailed Review Section -->
                <div v-if="showReview && testResult.detailed_results" class="mt-4">
                  <div class="card">
                    <div class="card-header bg-light">
                      <h5 class="mb-0 text-start">
                        <i class="fas fa-clipboard-list me-2"></i>
                        Answer Review
                      </h5>
                    </div>
                    <div class="card-body p-0">
                      <div v-for="(result, index) in testResult.detailed_results" :key="result.question_id"
                        class="border-bottom p-4"
                        :class="{ 'bg-light-success': result.is_correct, 'bg-light-danger': !result.is_correct }">

                        <!-- Question Header -->
                        <div class="d-flex align-items-start justify-content-between mb-3">
                          <h6 class="fw-bold mb-0">
                            <span class="badge me-2" :class="result.is_correct ? 'bg-success' : 'bg-danger'">
                              {{ index + 1 }}
                            </span>
                            {{ result.question }}
                          </h6>
                          <span class="badge" :class="result.is_correct ? 'bg-success' : 'bg-danger'">
                            <i class="fas" :class="result.is_correct ? 'fa-check' : 'fa-times'"></i>
                            {{ result.is_correct ? 'Correct' : 'Wrong' }}
                          </span>
                        </div>

                        <!-- Answer Options -->
                        <div class="row">
                          <div class="col-md-6">
                            <div class="mb-3">
                              <label class="form-label fw-bold text-muted">Your Answer:</label>
                              <div class="p-2 rounded"
                                :class="result.is_correct ? 'bg-success bg-opacity-10 border border-success' : 'bg-danger bg-opacity-10 border border-danger'">
                                <i class="fas me-2"
                                  :class="result.is_correct ? 'fa-check text-success' : 'fa-times text-danger'"></i>
                                {{ result.user_answer }}
                              </div>
                            </div>
                          </div>

                          <div class="col-md-6" v-if="!result.is_correct">
                            <div class="mb-3">
                              <label class="form-label fw-bold text-muted">Correct Answer:</label>
                              <div class="p-2 rounded bg-success bg-opacity-10 border border-success">
                                <i class="fas fa-check text-success me-2"></i>
                                {{ result.correct_answer }}
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- All Options Display -->
                        <div class="mt-3">
                          <label class="form-label fw-bold text-muted">All Options:</label>
                          <div class="row">
                            <div v-for="(option, optIndex) in result.options" :key="optIndex" class="col-md-6 mb-2">
                              <div class="p-2 rounded border" :class="{
                                'bg-success bg-opacity-10 border-success': (option.text || option) === result.correct_answer,
                                'bg-danger bg-opacity-10 border-danger': (option.text || option) === result.user_answer && !result.is_correct,
                                'border-light': (option.text || option) !== result.correct_answer && (option.text || option) !== result.user_answer
                              }">
                                <span class="badge bg-light text-dark me-2">
                                  {{ option.key || String.fromCharCode(65 + optIndex) }}
                                </span>
                                {{ option.text || option }}
                                <i v-if="(option.text || option) === result.correct_answer"
                                  class="fas fa-check text-success ms-2"></i>
                                <i v-else-if="(option.text || option) === result.user_answer && !result.is_correct"
                                  class="fas fa-times text-danger ms-2"></i>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Explanation if available -->
                        <div v-if="result.explanation" class="mt-3">
                          <div class="alert alert-info mb-0">
                            <i class="fas fa-info-circle me-2"></i>
                            <strong>Explanation:</strong> {{ result.explanation }}
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
  </defaultlayout>
</template>

<script>
import defaultlayout from '@/layout/default.vue';

export default {
  name: 'TestDetail',
  components: { defaultlayout },
  data() {
    return {
      test: null,
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      testStarted: false,
      testCompleted: false,
      testResult: null,
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
    progressPercentage() {
      if (this.questions.length === 0) return 0;
      return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
    }
  },
  async mounted() {
    await this.loadTest();
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    async loadTest() {
      try {
        this.loading = true;
        this.error = null;

        const testId = this.$route.params.id;
        const response = await this.$api.test.getById(testId);

        if (response.success) {
          this.test = response.test.test || response.test;
          this.questions = response.test.questions || [];
          this.timeRemaining = (this.test.time_limit || 30) * 60; // Convert to seconds
        }
      } catch (error) {
        console.error('Error loading test:', error);
        this.error = 'Failed to load test. Please try again later.';
      } finally {
        this.loading = false;
      }
    },

    startTest() {
      this.testStarted = true;
      this.startTimer();
    },

    startTimer() {
      this.timer = setInterval(() => {
        if (this.timeRemaining > 0) {
          this.timeRemaining--;
        } else {
          this.submitTest();
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

    async submitTest() {
      try {
        if (this.timer) {
          clearInterval(this.timer);
        }

        const answers = Object.keys(this.userAnswers).map(questionId => ({
          question_id: parseInt(questionId),
          selected_answer: this.userAnswers[questionId]
        }));

        const response = await this.$api.test.submit(this.test.id, {
          answers,
          //time_taken: (this.test.duration * 60) - this.timeRemaining
        });

        if (response.success) {
          this.testResult = response.result;
          this.testCompleted = true;
          this.testStarted = false;
        }
      } catch (error) {
        console.error('Error submitting test:', error);
        this.error = 'Failed to submit test. Please try again.';
      }
    },

    retakeTest() {
      this.testStarted = false;
      this.testCompleted = false;
      this.testResult = null;
      this.currentQuestionIndex = 0;
      this.userAnswers = {};
      this.timeRemaining = (this.test.duration || 30) * 60;
      this.showReview = false;
    },

    goBack() {
      this.$router.push('/tests');
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
