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
            <p class="text-sm text-center text-main-2">Or sign in with:</p>
            <div class="other-login" style="display: flex;">
              <button @click="handleFacebookLogin" :disabled="socialLoading"
                class="w-100 text-md mb_8 btn btn-social btn-facebook">
                <svg class="icon" width="24" height="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="white" />
                  <path fill="#1877F2"
                    d="M20.155 10.656L18.649 10.657C17.468 10.657 17.239 11.218 17.239 12.041V13.857H20.056L19.689 16.702H17.239V24H14.302V16.702H11.846V13.857H14.302V11.76C14.302 9.325 15.789 8 17.96 8C19 8 19.894 8.077 20.155 8.112V10.656Z" />
                </svg>
                FACEBOOK
              </button>
              <button @click="handleGoogleLogin" :disabled="socialLoading"
                class="w-100 text-md mb_8 btn btn-social btn-google">
                <svg class="icon" width="24" height="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0)">
                    <path fill="#167EE6"
                      d="M30.7919 13.218L17.7394 13.2174C17.163 13.2174 16.6958 13.6845 16.6958 14.2609V18.4306C16.6958 19.0068 17.163 19.4741 17.7393 19.4741H25.0897C24.2848 21.5629 22.7825 23.3122 20.8659 24.4237L24.0001 29.8493C29.0277 26.9416 32.0001 21.8398 32.0001 16.1287C32.0001 15.3155 31.9402 14.7342 31.8203 14.0796C31.7292 13.5823 31.2974 13.218 30.7919 13.218Z" />
                    <path fill="#12B347"
                      d="M16.0002 25.7392C12.4031 25.7392 9.26282 23.7738 7.57625 20.8655L2.15088 23.9926C4.91182 28.7777 10.0839 32 16.0002 32C18.9025 32 21.6411 31.2186 24.0002 29.8568V29.8494L20.866 24.4237C19.4324 25.2552 17.7734 25.7392 16.0002 25.7392Z" />
                    <path fill="#FFD500"
                      d="M6.26088 16C6.26088 14.2269 6.74475 12.5681 7.57606 11.1346L2.15069 8.00745C0.781375 10.3591 0 13.0903 0 16C0 18.9098 0.781375 21.6409 2.15069 23.9926L7.57606 20.8654C6.74475 19.4319 6.26088 17.7731 6.26088 16Z" />
                    <path fill="#FF4B26"
                      d="M16.0002 6.26088C18.3459 6.26088 20.5005 7.09437 22.1834 8.48081C22.5986 8.82281 23.2021 8.79813 23.5824 8.41781L26.5368 5.46344C26.9683 5.03194 26.9375 4.32562 26.4766 3.92575C23.6569 1.47956 19.9881 0 16.0002 0C10.0839 0 4.91182 3.22231 2.15088 8.00744L7.57625 11.1346C9.26282 8.22625 12.4031 6.26088 16.0002 6.26088Z" />
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect width="32" height="32" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                GOOGLE
              </button>
            </div>
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
      errorMessage: '',
      socialLoading: false,
    }
  },
  mounted() {
    // Xử lý OAuth callback nếu có
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userStr = urlParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));

        // Lưu vào store và localStorage
        this.login({
          userInfo: user,
          token: token
        });

        localStorage.setItem('access_token', token);
        localStorage.setItem('user_info', JSON.stringify(user));

        // Xóa query params
        window.history.replaceState({}, document.title, window.location.pathname);

        // Redirect về home
        this.$router.push('/');

        if (this.$toast) {
          this.$toast.success('Đăng nhập thành công!');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        this.errorMessage = 'Có lỗi xảy ra khi đăng nhập';
      }
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
    },

    async handleGoogleLogin() {
      await this.handleOAuthLogin('google');
    },

    async handleFacebookLogin() {
      await this.handleOAuthLogin('facebook');
    },
    async handleOAuthLogin(provider) {
      this.oauthLoading = true;
      this.errorMessage = '';

      try {
        const response = await this.$api.auth[`loginWith${provider.charAt(0).toUpperCase() + provider.slice(1)}`]();

        if (response.success && response.url) {
          // Lưu provider để xử lý callback
          sessionStorage.setItem('oauth_provider', provider);

          // Redirect đến OAuth provider
          window.location.href = response.url;
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.message || `Không thể đăng nhập với ${provider}`;
        console.error('OAuth error:', error);
        this.oauthLoading = false;
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

.btn-social {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
  cursor: pointer;
  margin-right: 10px;
}

.btn-social .icon {
  margin-right: 8px;
}

/* --- Facebook --- */
.btn-facebook {
  background-color: #1877F2;
  color: #fff;
}

.btn-facebook:hover {
  background-color: #145DBF;
}

/* --- Google --- */
.btn-google {
  background-color: #fff;
  color: #444;
  border: 1px solid #ddd;
}

.btn-google:hover {
  background-color: #f2f2f2;
}
</style>
