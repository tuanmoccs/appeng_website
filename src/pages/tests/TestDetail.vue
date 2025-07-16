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
                      :id="'option_' + currentQuestion.id + '_' + index"
                      :value="option.key || String.fromCharCode(65 + index)" v-model="userAnswers[currentQuestion.id]">
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
          <div class="col-lg-8 mx-auto">
            <div class="card shadow">
              <div class="card-header bg-success text-white text-center">
                <h4 class="mb-0">
                  <i class="fas fa-trophy me-2"></i>
                  Test Completed!
                </h4>
              </div>
              <div class="card-body text-center py-5">
                <div class="row mb-4">
                  <div class="col-md-4">
                    <div class="result-stat">
                      <h3 class="text-primary">{{ testResult.score }}%</h3>
                      <p class="text-muted">Your Score</p>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="result-stat">
                      <h3 class="text-success">{{ testResult.correct_answers }}</h3>
                      <p class="text-muted">Correct Answers</p>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="result-stat">
                      <h3 class="text-danger">{{ testResult.wrong_answers }}</h3>
                      <p class="text-muted">Wrong Answers</p>
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <div class="alert" :class="testResult.passed ? 'alert-success' : 'alert-warning'">
                    <i class="fas me-2" :class="testResult.passed ? 'fa-check-circle' : 'fa-exclamation-triangle'"></i>
                    {{ testResult.passed ? 'Congratulations! You passed the test.' : 'Keep practicing!'
                    }}
                  </div>
                </div>

                <div class="d-grid gap-2 d-md-block">
                  <button @click="retakeTest" class="btn btn-primary">
                    <i class="fas fa-redo me-2"></i>
                    Retake Test
                  </button>
                  <button @click="goBack" class="btn btn-outline-secondary">
                    <i class="fas fa-list me-2"></i>
                    Back to Tests
                  </button>
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
      timer: null
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
          answer: this.userAnswers[questionId]
        }));

        const response = await this.$api.test.submit(this.test.id, {
          answers,
          time_taken: (this.test.duration * 60) - this.timeRemaining
        });

        if (response.success) {
          this.testResult = response.data;
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
</style>
