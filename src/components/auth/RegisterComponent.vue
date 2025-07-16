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
            <form id="contact-form" @submit.prevent="handleRegister">
              <div
                style="display: flex; align-items: center; justify-self: center; color: aliceblue; margin-bottom: 20px;">
                <h2>REGISTER</h2>
              </div>

              <!-- Error message -->
              <div v-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
              </div>

              <div class="row">
                <div class="col-lg-12">
                  <fieldset>
                    <input type="text" v-model="registerForm.name" placeholder="Your Name ..." autocomplete="name"
                      required :class="{ 'error': registerForm.nameError }">
                    <span v-if="registerForm.nameError" class="error-text">{{ registerForm.nameError }}</span>
                  </fieldset>
                </div>
                <div class="col-lg-12">
                  <fieldset>
                    <input type="email" v-model="registerForm.email" placeholder="Your Email ..." autocomplete="email"
                      required :class="{ 'error': registerForm.emailError }">
                    <span v-if="registerForm.emailError" class="error-text">{{ registerForm.emailError }}</span>
                  </fieldset>
                </div>
                <div class="col-lg-12">
                  <fieldset>
                    <input type="password" v-model="registerForm.password" placeholder="Password" required
                      :class="{ 'error': registerForm.passwordError }" @input="checkPasswordStrength">
                    <span v-if="registerForm.passwordError" class="error-text">{{ registerForm.passwordError }}</span>
                    <div v-if="passwordStrength.text" :class="passwordStrength.class" class="password-strength">
                      {{ passwordStrength.text }}
                    </div>
                  </fieldset>
                </div>
                <div class="col-lg-12">
                  <fieldset>
                    <input type="password" v-model="registerForm.confirmPassword" placeholder="Confirm Password"
                      required :class="{ 'error': registerForm.confirmPasswordError }">
                    <span v-if="registerForm.confirmPasswordError" class="error-text">{{
                      registerForm.confirmPasswordError }}</span>
                  </fieldset>
                </div>
                <div class="col-lg-12">
                  <fieldset>
                    <button type="submit" class="orange-button" :disabled="registerLoading"
                      style="min-width: 200px; margin-top: 5px; margin-bottom: 5px;">
                      {{ registerLoading ? 'Đang đăng ký...' : 'Register' }}
                    </button>
                  </fieldset>
                  <p class="auth-switch-section" style="color: aliceblue;">
                    Have an account?
                    <router-link to="/login" class="auth-switch-link">Login Now</router-link>
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
  name: 'registerComponent',
  data() {
    return {
      registerForm: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        nameError: '',
        emailError: '',
        passwordError: '',
        confirmPasswordError: ''
      },
      registerLoading: false,
      passwordStrength: { class: '', text: '' },
      errorMessage: ''
    }
  },
  methods: {
    ...mapActions(['login']),

    checkPasswordStrength() {
      const password = this.registerForm.password;

      if (!password) {
        this.passwordStrength = { class: '', text: '' };
        return;
      }

      if (password.length < 6) {
        this.passwordStrength = { class: 'weak', text: 'Weak password' };
      } else if (password.length < 8) {
        this.passwordStrength = { class: 'medium', text: 'Medium password' };
      } else if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)) {
        this.passwordStrength = { class: 'strong', text: 'Strong password' };
      } else {
        this.passwordStrength = { class: 'medium', text: 'Medium password' };
      }
    },

    validateForm() {
      let isValid = true;

      // Reset errors
      this.registerForm.nameError = '';
      this.registerForm.emailError = '';
      this.registerForm.passwordError = '';
      this.registerForm.confirmPasswordError = '';
      this.errorMessage = '';

      // Name validation
      if (!this.registerForm.name) {
        this.registerForm.nameError = 'Name is required';
        isValid = false;
      } else if (this.registerForm.name.length < 2) {
        this.registerForm.nameError = 'Name must be at least 2 characters';
        isValid = false;
      }

      // Email validation
      if (!this.registerForm.email) {
        this.registerForm.emailError = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(this.registerForm.email)) {
        this.registerForm.emailError = 'Email is invalid';
        isValid = false;
      }

      // Password validation
      if (!this.registerForm.password) {
        this.registerForm.passwordError = 'Password is required';
        isValid = false;
      } else if (this.registerForm.password.length < 6) {
        this.registerForm.passwordError = 'Password must be at least 6 characters';
        isValid = false;
      }

      // Confirm password validation
      if (!this.registerForm.confirmPassword) {
        this.registerForm.confirmPasswordError = 'Confirm password is required';
        isValid = false;
      } else if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.registerForm.confirmPasswordError = 'Passwords do not match';
        isValid = false;
      }

      return isValid;
    },

    async handleRegister() {
      if (!this.validateForm()) return;

      this.registerLoading = true;

      try {
        const userData = {
          name: this.registerForm.name,
          email: this.registerForm.email,
          password: this.registerForm.password,
          password_confirmation: this.registerForm.confirmPassword
        };

        const response = await this.$api.auth.register(userData);

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
          this.$toast?.success('Đăng ký thành công!');
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi khi đăng ký';
        console.error('Register error:', error);
      } finally {
        this.registerLoading = false;
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

.password-strength {
  font-size: 12px;
  margin-top: 5px;
}

.weak {
  color: #dc3545;
}

.medium {
  color: #ffc107;
}

.strong {
  color: #28a745;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>