<template>
  <div class="oauth-callback"
    style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #1e1e1e;">
    <div style="text-align: center; color: white;">
      <div class="spinner" style="margin: 0 auto 20px;"></div>
      <h3>Đang xử lý đăng nhập...</h3>
      <p v-if="errorMessage" style="color: #ff6b6b; margin-top: 20px;">{{ errorMessage }}</p>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'OAuthCallback',
  data() {
    return {
      errorMessage: ''
    };
  },
  methods: {
    ...mapActions(['login'])
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userStr = urlParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));

        // Lưu vào store
        this.login({
          userInfo: user,
          token: token
        });

        // Lưu vào localStorage
        localStorage.setItem('access_token', token);
        localStorage.setItem('user_info', JSON.stringify(user));

        // Redirect về home
        setTimeout(() => {
          this.$router.push('/');
          if (this.$toast) {
            this.$toast.success('Đăng nhập thành công!');
          }
        }, 500);
      } catch (error) {
        console.error('OAuth callback error:', error);
        this.errorMessage = 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.';
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      }
    } else {
      this.errorMessage = 'Thông tin đăng nhập không hợp lệ';
      setTimeout(() => {
        this.$router.push('/login');
      }, 2000);
    }
  }
};
</script>
<style scoped>
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff6b6b;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
