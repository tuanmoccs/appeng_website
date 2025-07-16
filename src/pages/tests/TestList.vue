<template>
  <defaultlayout>
    <div class="section courses" id="courses" style="padding-top: 30px;">
      <div class="container">
        <div class="row">
          <div class="col-lg-12 text-center">
            <div class="section-heading">
              <h6>Practice Tests</h6>
              <h2>English Practice Tests</h2>
              <p>Improve your English skills with our comprehensive practice tests</p>
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
          <div v-for="test in tests" :key="test.id" class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 shadow-sm test-card">
              <div class="card-img-top position-relative" style="margin-top: 35px;">
                <!-- <img :src="test.image || '/placeholder.svg?height=200&width=350'" class="w-100"
                  style="height: 200px; object-fit: cover;" :alt="test.title"> -->
                <div class="position-absolute bottom-0 end-0 m-2">
                  <span class="badge bg-primary">{{ test.difficulty || 'Intermediate' }}</span>
                </div>
                <div class="position-absolute bottom-0 start-0 m-2">
                  <span class="badge bg-success">
                    <i class="fas fa-clock me-1"></i>
                    {{ test.time_limit || 30 }} mins
                  </span>
                </div>
              </div>

              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ test.title }}</h5>
                <p class="card-text text-muted flex-grow-1">
                  {{ test.description || 'Practice your English skills with this comprehensive test.' }}
                </p>

                <div class="test-stats mb-3">
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
                </div>

                <div class="d-grid">
                  <button @click="startTest(test.id)" class="btn btn-primary">
                    <i class="fas fa-play me-2"></i>
                    {{ isLogged ? 'Start Test' : 'Login Required' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && !error && tests.length === 0" class="text-center py-5">
          <i class="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
          <h4 class="text-muted">No tests available</h4>
          <p class="text-muted">Check back later for new practice tests.</p>
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
      tests: [],
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
    await this.loadTests();
  },
  methods: {
    async loadTests(page = 1) {
      try {
        this.loading = true;
        this.error = null;

        const response = await this.$api.test.getList({
          page,
          per_page: this.pagination.per_page
        });

        if (response) {
          // Handle direct array response
          this.tests = Array.isArray(response) ? response : (response.data || []);
          this.pagination = {
            current_page: page,
            last_page: 1,
            per_page: this.pagination.per_page,
            total: this.tests.length
          };
        }
      } catch (error) {
        console.error('Error loading tests:', error);
        this.error = 'Failed to load tests. Please try again later.';
      } finally {
        this.loading = false;
      }
    },

    startTest(testId) {
      if (!this.isLogged) {
        this.$router.push('/login');
        return;
      }

      this.$router.push(`/test/${testId}`);
    }
  }
}
</script>

<style scoped>
.test-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.test-card:hover {
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
  color: #007bff;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}
</style>
