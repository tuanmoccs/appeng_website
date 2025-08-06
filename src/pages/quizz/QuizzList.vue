<template>
  <defaultlayout>
    <div class="section courses" id="courses" style="margin-top: 20px;">
      <div class="container">
        <div class="row">
          <div class="col-lg-12 text-center">
            <div class="section-heading">
              <h4>Quizzes</h4>
              <h2>English Practice</h2>
              <p>Reinforce lessons through quizzes</p>
            </div>
          </div>
        </div>

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

        <!-- Tests Grid -->
        <div v-if="!loading && !error" class="row">
          <div v-for="quiz in quizzes" :key="quiz.id" class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 shadow-sm test-card">
              <div class="card-img-top position-relative" style="margin-top: 35px;">
                <!-- <img :src="test.image || '/placeholder.svg?height=200&width=350'" class="w-100"
                  style="height: 200px; object-fit: cover;" :alt="test.title"> -->
              </div>

              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ quiz.title }}</h5>
                <p class="card-text text-muted flex-grow-1">
                  {{ quiz.description || 'Practice your English skills with this comprehensive test.' }}
                </p>

                <!-- User Latest Result -->
                <div v-if="isLogged && quiz.user_latest_result" class="alert alert-info mb-3 py-2">
                  <small class="d-block">
                    <i class="fas fa-history me-1"></i>
                    <strong>Lần làm gần nhất:</strong>
                  </small>
                  <div class="row text-center mt-2">
                    <div class="col-12">
                      <small class="text-muted">Điểm số</small>
                      <div class="fw-bold">
                        {{ quiz.user_latest_result.score }}/{{ quiz.user_latest_result.total_questions }}
                      </div>
                    </div>
                  </div>
                  <small class="text-muted d-block mt-1">
                    {{ formatDate(quiz.user_latest_result.completed_at) }}
                  </small>
                </div>

                <!-- <div class="test-stats mb-3">
                  <div class="row text-center">
                    <div class="col-4">
                      <small class="text-muted">Questions</small>
                      <div class="fw-bold">{{ test.total_questions || 0 }}</div>
                    </div>

                    <div class="col-4">
                      <small class="text-muted">Pass Rate</small>
                      <div class="fw-bold">{{ test.passing_score || 0 }}%</div>
                    </div>
                  </div>
                </div> -->

                <div class="d-grid">
                  <button @click="startTest(quiz.id)" class="btn btn-primary">
                    <i class="fas fa-play me-2"></i>
                    {{ getButtonText(quiz) }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && !error && quizzes.length === 0" class="text-center py-5">
          <i class="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
          <h4 class="text-muted">No quizzes available</h4>
          <p class="text-muted">Check back later for new practice quizzes.</p>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > pagination.per_page" class="row mt-4">
          <div class="col-12">
            <nav aria-label="Test pagination">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                  <button class="page-link" @click="loadTests(pagination.current_page - 1)"
                    :disabled="pagination.current_page === 1">
                    Previous
                  </button>
                </li>

                <li v-for="page in visiblePages" :key="page" class="page-item"
                  :class="{ active: page === pagination.current_page }">
                  <button class="page-link" @click="loadTests(page)">
                    {{ page }}
                  </button>
                </li>

                <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
                  <button class="page-link" @click="loadTests(pagination.current_page + 1)"
                    :disabled="pagination.current_page === pagination.last_page">
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </defaultlayout>
</template>

<script>
import { mapGetters } from 'vuex';
import defaultlayout from '@/layout/default.vue';

export default {
  name: 'TestList',
  components: { defaultlayout },
  data() {
    return {
      quizzes: [],
      loading: true,
      error: null,
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 9,
        total: 0
      }
    }
  },
  computed: {
    ...mapGetters(['isLogged']),
    visiblePages() {
      const current = this.pagination.current_page;
      const last = this.pagination.last_page;
      const pages = [];

      const start = Math.max(1, current - 2);
      const end = Math.min(last, current + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    }
  },
  async mounted() {
    await this.loadQuizzes();
  },
  methods: {
    async loadQuizzes(page = 1) {
      try {
        this.loading = true;
        this.error = null;

        const response = await this.$api.quiz.getList({
          page,
          per_page: this.pagination.per_page
        });

        if (response) {
          // Handle direct array response
          this.quizzes = Array.isArray(response) ? response : (response.data || []);
          this.pagination = {
            current_page: page,
            last_page: 1,
            per_page: this.pagination.per_page,
            total: this.quizzes.length
          };
        }
      } catch (error) {
        console.error('Error loading tests:', error);
        this.error = 'Failed to load tests. Please try again later.';
      } finally {
        this.loading = false;
      }
    },

    startTest(quizId) {
      if (!this.isLogged) {
        this.$router.push('/login');
        return;
      }

      this.$router.push(`/quizz/${quizId}`);
    },

    getButtonText(quiz) {
      if (!this.isLogged) {
        return 'Login Required';
      }

      if (quiz.user_latest_result) {
        return 'Retake Quiz';
      }

      return 'Start Quiz';
    },

    formatDate(dateString) {
      if (!dateString) return '';

      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
}
</script>

<style scoped>
.test-card {
  transition: transform 0.2s ease-in-out;
}

.test-card:hover {
  transform: translateY(-5px);
}

.alert-info {
  background-color: #e3f2fd;
  border-color: #2196f3;
  color: #1976d2;
}
</style>