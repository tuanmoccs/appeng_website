<template>
  <defaultlayout>
    <div class="section courses" id="courses" style="margin-top: 20px;">
      <div class="container">
        <div class="row">
          <div class="col-lg-12 text-center">
            <div class="section-heading">
              <h4>Listening Tests</h4>
              <h2>English Listening Practice</h2>
              <p>Improve your listening skills with our comprehensive audio tests</p>
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

        <!-- Listening Tests Grid -->
        <div v-if="!loading && !error" class="row">
          <div v-for="test in listeningTests" :key="test.id" class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 shadow-sm listening-test-card">
              <div class="card-img-top position-relative" style="margin-top: 35px;">
                <!-- <img :src="test.image || '/placeholder.svg?height=200&width=350'" class="w-100"
                  style="height: 200px; object-fit: cover;" :alt="test.title"> -->
                <div class="position-absolute bottom-0 end-0 m-2">
                  <span class="badge bg-info">
                    <i class="fas fa-headphones me-1"></i>
                    {{ test.type || 'Listening' }}
                  </span>
                </div>
                <div class="position-absolute bottom-0 start-0 m-2">
                  <span class="badge bg-success">
                    <i class="fas fa-clock me-1"></i>
                    {{ test.time_limit || 20 }} mins
                  </span>
                </div>
              </div>

              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ test.title }}</h5>
                <p class="card-text text-muted flex-grow-1">
                  {{ test.description || 'Practice your English listening skills with audio exercises.' }}
                </p>

                <div v-if="isLogged && test.user_latest_result && test.user_latest_result.score !== undefined"
                  class="alert alert-info mb-3 py-2">
                  <small class="d-block">
                    <i class="fas fa-history me-1"></i>
                    <strong>Lần làm gần nhất:</strong>
                  </small>
                  <div class="row text-center mt-2">
                    <div class="col-12">
                      <small class="text-muted">Điểm số</small>
                      <div class="fw-bold">
                        {{ test.user_latest_result.score }}%
                      </div>
                    </div>
                  </div>
                  <small class="text-muted d-block mt-1">
                    {{ formatDate(test.user_latest_result.completed_at) }}
                  </small>
                </div>
                <div class="test-stats mb-3">
                  <div class="row text-center">
                    <div class="col-4">
                      <small class="text-muted">Type</small>
                      <div class="fw-bold">{{ capitalize(test.type) || 'N/A' }}</div>
                    </div>
                    <div class="col-4">
                      <small class="text-muted">Questions</small>
                      <div class="fw-bold">{{ test.total_questions || 0 }}</div>
                    </div>
                    <div class="col-4">
                      <small class="text-muted">Pass Score</small>
                      <div class="fw-bold">{{ test.passing_score || 0 }}%</div>
                    </div>
                  </div>
                </div>

                <div class="d-grid">
                  <button @click="startListeningTest(test.id)" class="btn btn-info text-white">
                    <i class="fas fa-headphones me-2"></i>
                    {{ isLogged ? 'Start Listening Test' : 'Login Required' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && !error && listeningTests.length === 0" class="text-center py-5">
          <i class="fas fa-headphones fa-3x text-muted mb-3"></i>
          <h4 class="text-muted">No listening tests available</h4>
          <p class="text-muted">Check back later for new listening exercises.</p>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > pagination.per_page" class="row mt-4">
          <div class="col-12">
            <nav aria-label="Listening test pagination">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                  <button class="page-link" @click="loadListeningTests(pagination.current_page - 1)"
                    :disabled="pagination.current_page === 1">
                    Previous
                  </button>
                </li>

                <li v-for="page in visiblePages" :key="page" class="page-item"
                  :class="{ active: page === pagination.current_page }">
                  <button class="page-link" @click="loadListeningTests(page)">
                    {{ page }}
                  </button>
                </li>

                <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
                  <button class="page-link" @click="loadListeningTests(pagination.current_page + 1)"
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
  name: 'ListeningTestList',
  components: { defaultlayout },
  data() {
    return {
      listeningTests: [],
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
    await this.loadListeningTests();
  },
  methods: {
    async loadListeningTests(page = 1) {
      try {
        this.loading = true;
        this.error = null;

        const response = await this.$api.listeningtest.getList({
          page,
          per_page: this.pagination.per_page
        });

        console.log('API Response:', response); // Debug log

        if (response && response.success) {
          // The data is in response.tests array
          this.listeningTests = response.tests || [];

          // Since there's no pagination info in the response, create simple pagination
          this.pagination = {
            current_page: page,
            last_page: Math.ceil((response.tests || []).length / this.pagination.per_page),
            per_page: this.pagination.per_page,
            total: (response.tests || []).length
          };
        } else {
          this.listeningTests = [];
          this.error = 'Failed to load listening tests.';
        }

        console.log('Processed tests:', this.listeningTests); // Debug log
      } catch (error) {
        console.error('Error loading listening tests:', error);
        this.error = 'Failed to load listening tests. Please try again later.';
        this.listeningTests = [];
      } finally {
        this.loading = false;
      }
    },

    startListeningTest(testId) {
      if (!this.isLogged) {
        this.$router.push('/login');
        return;
      }

      this.$router.push(`/listening-test/${testId}`);
    },

    capitalize(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
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
.listening-test-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.listening-test-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.test-stats {
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 15px 0;
}

.badge {
  font-size: 0.75rem;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.page-link {
  color: #17a2b8;
}

.page-item.active .page-link {
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.section-heading h4 {
  color: #7a6ad8;
  font-size: 18px;
  text-transform: uppercase;
  font-weight: 600;
}
</style>
