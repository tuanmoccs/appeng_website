<template>
  <defaultlayout>
    <div class="container py-5" style="margin-top: 50px;">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-info" role="status">
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
                    <h1 class="h3 mb-2">
                      <i class="fas fa-headphones text-info me-2"></i>
                      {{ test.title }}
                    </h1>
                    <p class="text-muted mb-3">{{ test.description }}</p>
                    <div class="d-flex gap-3">
                      <span class="badge bg-info">
                        <i class="fas fa-volume-up me-1"></i>
                        Listening Test
                      </span>
                      <span class="badge bg-success">
                        <i class="fas fa-clock me-1"></i>
                        {{ test.duration || 20 }} minutes
                      </span>
                      <span class="badge bg-primary">
                        <i class="fas fa-list me-1"></i>
                        {{ sections.length }} sections
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
                    Section {{ currentSectionIndex + 1 }} of {{ sections.length }}
                    <span v-if="currentSection">
                      - Question {{ currentQuestionIndex + 1 }} of {{ currentSection.questions.length }}
                    </span>
                  </span>
                </div>
                <div class="progress">
                  <div class="progress-bar bg-info" role="progressbar" :style="{ width: progressPercentage + '%' }"
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
                <i class="fas fa-headphones fa-4x text-info mb-4"></i>
                <h3 class="mb-3">Ready to start the listening test?</h3>
                <p class="text-muted mb-4">
                  This test contains {{ sections.length }} sections with audio recordings.
                  You'll have {{ test.duration || 20 }} minutes to complete all questions.
                  Make sure your audio is working properly.
                </p>
                <div class="alert alert-info">
                  <i class="fas fa-info-circle me-2"></i>
                  <strong>Instructions:</strong> Listen carefully to each audio section and answer the questions.
                  You can replay audio sections, but time will continue running.
                </div>
                <div class="d-grid gap-2 d-md-block">
                  <button @click="startTest" class="btn btn-info btn-lg px-5 text-white">
                    <i class="fas fa-play me-2"></i>
                    Start Listening Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Display -->
        <div v-if="testStarted && !testCompleted && currentSection" class="row">
          <div class="col-lg-10 mx-auto">
            <div class="card shadow">
              <div class="card-header bg-info text-white">
                <h5 class="mb-0">
                  <i class="fas fa-volume-up me-2"></i>
                  Section {{ currentSectionIndex + 1 }}: {{ currentSection.title }}
                </h5>
              </div>
              <div class="card-body">
                <!-- Audio Player -->
                <div class="audio-section mb-4">
                  <div class="card bg-light">
                    <div class="card-body text-center">
                      <h6 class="mb-3">
                        <i class="fas fa-headphones me-2"></i>
                        Listen to the audio
                      </h6>
                      <audio ref="audioPlayer" :src="currentSection.audio_url" controls class="w-100 mb-3"
                        @loadedmetadata="onAudioLoaded" @timeupdate="onTimeUpdate" @ended="onAudioEnded">
                        Your browser does not support the audio element.
                      </audio>
                      <div class="d-flex justify-content-center gap-2">
                        <button @click="replayAudio" class="btn btn-sm btn-outline-info">
                          <i class="fas fa-redo me-1"></i>
                          Replay
                        </button>
                        <button @click="togglePlayPause" class="btn btn-sm btn-info text-white">
                          <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'" class="me-1"></i>
                          {{ isPlaying ? 'Pause' : 'Play' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Section Instructions -->
                <div v-if="currentSection.instructions" class="alert alert-light mb-4">
                  <i class="fas fa-info-circle me-2"></i>
                  {{ currentSection.instructions }}
                </div>

                <!-- Current Question -->
                <div v-if="currentQuestion" class="question-section">
                  <div class="card border-primary">
                    <div class="card-header bg-primary text-white">
                      <h6 class="mb-0">
                        Question {{ currentQuestionIndex + 1 }} of {{ currentSection.questions.length }}
                      </h6>
                    </div>
                    <div class="card-body">
                      <h6 class="fw-bold mb-3">{{ currentQuestion.question }}</h6>

                      <!-- Question Image if exists -->
                      <div v-if="currentQuestion.image" class="mb-3">
                        <img :src="currentQuestion.image" class="img-fluid rounded"
                          :alt="'Question ' + (currentQuestionIndex + 1)">
                      </div>

                      <!-- Answer Options -->
                      <div class="answers">
                        <div v-for="(option, index) in currentQuestion.options" :key="index" class="form-check mb-3">
                          <input class="form-check-input" type="radio" :name="'question_' + currentQuestion.id"
                            :id="'option_' + currentQuestion.id + '_' + index"
                            :value="option.key || String.fromCharCode(65 + index)"
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
                    </div>
                  </div>
                </div>

                <!-- Navigation Buttons -->
                <div class="d-flex justify-content-between mt-4">
                  <button @click="previousQuestion" class="btn btn-outline-secondary"
                    :disabled="currentSectionIndex === 0 && currentQuestionIndex === 0">
                    <i class="fas fa-chevron-left me-2"></i>
                    Previous
                  </button>

                  <div class="d-flex gap-2">
                    <button v-if="!isLastQuestion" @click="nextQuestion" class="btn btn-info text-white">
                      Next
                      <i class="fas fa-chevron-right ms-2"></i>
                    </button>

                    <button v-if="isLastQuestion" @click="submitTest" class="btn btn-success">
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
                  Listening Test Completed!
                </h4>
              </div>
              <div class="card-body text-center py-5">
                <div class="row mb-4">
                  <div class="col-md-4">
                    <div class="result-stat">
                      <h3 class="text-info">{{ testResult.score }}%</h3>
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
                    {{ testResult.passed ? 'Excellent! Your listening skills are improving.' : 'Keep practicing!'
                    }}
                  </div>
                </div>

                <div class="d-grid gap-2 d-md-block">
                  <button @click="retakeTest" class="btn btn-info text-white">
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
  name: 'ListeningTestDetail',
  components: { defaultlayout },
  data() {
    return {
      test: null,
      sections: [],
      currentSectionIndex: 0,
      currentQuestionIndex: 0,
      userAnswers: {},
      testStarted: false,
      testCompleted: false,
      testResult: null,
      loading: true,
      error: null,
      timeRemaining: 0,
      timer: null,
      isPlaying: false,
      audioDuration: 0,
      audioCurrentTime: 0
    }
  },
  computed: {
    currentSection() {
      return this.sections[this.currentSectionIndex] || null;
    },
    currentQuestion() {
      if (!this.currentSection || !this.currentSection.questions) return null;
      return this.currentSection.questions[this.currentQuestionIndex] || null;
    },
    progressPercentage() {
      let totalQuestions = 0;
      let completedQuestions = 0;

      this.sections.forEach((section, sectionIndex) => {
        totalQuestions += section.questions.length;
        if (sectionIndex < this.currentSectionIndex) {
          completedQuestions += section.questions.length;
        } else if (sectionIndex === this.currentSectionIndex) {
          completedQuestions += this.currentQuestionIndex;
        }
      });

      if (totalQuestions === 0) return 0;
      return (completedQuestions / totalQuestions) * 100;
    },
    isLastQuestion() {
      return this.currentSectionIndex === this.sections.length - 1 &&
        this.currentQuestionIndex === this.currentSection.questions.length - 1;
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
        const response = await this.$api.listeningtest.getById(testId);

        if (response.success) {
          this.test = response.test.test || response.test;
          this.sections = response.test.sections || [];
          this.timeRemaining = (this.test.duration || 20) * 60; // Convert to seconds
        }
      } catch (error) {
        console.error('Error loading listening test:', error);
        this.error = 'Failed to load listening test. Please try again later.';
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

    onAudioLoaded() {
      if (this.$refs.audioPlayer) {
        this.audioDuration = this.$refs.audioPlayer.duration;
      }
    },

    onTimeUpdate() {
      if (this.$refs.audioPlayer) {
        this.audioCurrentTime = this.$refs.audioPlayer.currentTime;
        this.isPlaying = !this.$refs.audioPlayer.paused;
      }
    },

    onAudioEnded() {
      this.isPlaying = false;
    },

    replayAudio() {
      if (this.$refs.audioPlayer) {
        this.$refs.audioPlayer.currentTime = 0;
        this.$refs.audioPlayer.play();
      }
    },

    togglePlayPause() {
      if (this.$refs.audioPlayer) {
        if (this.isPlaying) {
          this.$refs.audioPlayer.pause();
        } else {
          this.$refs.audioPlayer.play();
        }
      }
    },

    nextQuestion() {
      if (this.currentQuestionIndex < this.currentSection.questions.length - 1) {
        this.currentQuestionIndex++;
      } else if (this.currentSectionIndex < this.sections.length - 1) {
        this.currentSectionIndex++;
        this.currentQuestionIndex = 0;
      }
    },

    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      } else if (this.currentSectionIndex > 0) {
        this.currentSectionIndex--;
        this.currentQuestionIndex = this.sections[this.currentSectionIndex].questions.length - 1;
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

        const response = await this.$api.listeningtest.submit(this.test.id, {
          answers,
          time_taken: (this.test.duration * 60) - this.timeRemaining
        });

        if (response.success) {
          this.testResult = response.data;
          this.testCompleted = true;
          this.testStarted = false;
        }
      } catch (error) {
        console.error('Error submitting listening test:', error);
        this.error = 'Failed to submit test. Please try again.';
      }
    },

    retakeTest() {
      this.testStarted = false;
      this.testCompleted = false;
      this.testResult = null;
      this.currentSectionIndex = 0;
      this.currentQuestionIndex = 0;
      this.userAnswers = {};
      this.timeRemaining = (this.test.duration || 20) * 60;
      this.isPlaying = false;
    },

    goBack() {
      this.$router.push('/listening-tests');
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
  background-color: #e8f4fd;
  border-color: #17a2b8;
}

.form-check-label:hover {
  background-color: #f5f5f5;
}

.audio-section {
  background: linear-gradient(135deg, #e8f4fd 0%, #f8f9fa 100%);
  border-radius: 10px;
  padding: 20px;
}

.progress {
  height: 8px;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

audio {
  max-width: 100%;
  height: 40px;
}

.question-section {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>