<template>
  <div class="contact-us section" id="contact">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 align-self-center">
          <div class="section-heading">
            <h6>E-Learning</h6>
            <h2>Get newest lesson</h2>
            <p>Thanks for visiting our website! We offer completely free English lessons for you. Feel free to support
              us by sharing our site with your friends!</p>
            <div class="special-offer">
              <span class="offer">off<br><em>50%</em></span>
              <h6>Valide: <em>24 April 2036</em></h6>
              <h4>Special Offer <em>50%</em> OFF!</h4>
              <a href="#"><i class="fa fa-angle-right"></i></a>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="contact-us-content">
            <form id="contact-form" @submit.prevent="handleLogin">
              <div
                style="display: flex; align-items: center; justify-self: center; color: aliceblue; margin-bottom: 20px;">
                <h2>LOGIN</h2>
              </div>

              <!-- Error message -->
              <div v-if="errorMessage" class="alert alert-danger" style="color: red; margin-bottom: 15px;">
                {{ errorMessage }}
              </div>

              <div class="row">
                <div class="col-lg-12">
                  <fieldset>
                    <input type="email" id="email" v-model="loginForm.email" placeholder="Your Email ..."
                      autocomplete="email" required :class="{ 'error': loginForm.emailError }">
                    <span v-if="loginForm.emailError" class="error-text">{{ loginForm.emailError }}</span>
                  </fieldset>
                </div>
                <div class="col-lg-12">
                  <fieldset>
                    <input type="password" id="password" v-model="loginForm.password" placeholder="Password" required
                      :class="{ 'error': loginForm.passwordError }">
                    <span v-if="loginForm.passwordError" class="error-text">{{ loginForm.passwordError }}</span>
                  </fieldset>
                </div>
                <div class="col-lg-12">
                  <a href="forgot-password.html" class="forgot-password-link">
                    Forgot Password?
                  </a>
                  <fieldset>
                    <button type="submit" class="orange-button" :disabled="loginLoading"
                      style="min-width: 100%; margin-top: 5px; margin-bottom: 5px;">
                      {{ loginLoading ? 'Đang đăng nhập...' : 'Login' }}
                    </button>
                  </fieldset>
                  <p class="auth-switch-section" style="color: aliceblue;">
                    Don't have an account?
                    <router-link to="/register" class="auth-switch-link">Register Now</router-link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'loginComponent',
  data() {
    return {
      loginForm: {
        email: '',
        password: '',
        emailError: '',
        passwordError: ''
      },
      loginLoading: false,
      errorMessage: ''
    }
  },
  methods: {
    ...mapActions(['login']),

    validateForm() {
      let isValid = true;

      // Reset errors
      this.loginForm.emailError = '';
      this.loginForm.passwordError = '';
      this.errorMessage = '';

      // Email validation
      if (!this.loginForm.email) {
        this.loginForm.emailError = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(this.loginForm.email)) {
        this.loginForm.emailError = 'Email is invalid';
        isValid = false;
      }

      // Password validation
      if (!this.loginForm.password) {
        this.loginForm.passwordError = 'Password is required';
        isValid = false;
      } else if (this.loginForm.password.length < 6) {
        this.loginForm.passwordError = 'Password must be at least 6 characters';
        isValid = false;
      }

      return isValid;
    },

    async handleLogin() {
      if (!this.validateForm()) return;

      this.loginLoading = true;

      try {
        const credentials = {
          email: this.loginForm.email,
          password: this.loginForm.password
        };

        // Fix: Change $pai to $api
        const response = await this.$api.auth.login(credentials);

        if (response.success) {
          // Save to Vuex store
          this.login({
            userInfo: response.user,
            token: response.token
          });

          // Save to localStorage
          localStorage.setItem('access_token', response.token);
          localStorage.setItem('user_info', JSON.stringify(response.user));

          // Redirect to home
          this.$router.push('/');

          // Show success message
          if (this.$toast) {
            this.$toast.success('Đăng nhập thành công!');
          }
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi khi đăng nhập';
        console.error('Login error:', error);
      } finally {
        this.loginLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.error-text {
  color: red;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.error {
  border: 1px solid red !important;
}

.alert {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.alert-danger {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
