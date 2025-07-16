export default ({ $axios }) => ({
  // Authentication routes (public)
  async login(params) {
    return await $axios.$post('auth/login', params)
  },
  
  async register(params) {
    return await $axios.$post('auth/register', params)
  },
  
  async forgotPassword(params) {
    return await $axios.$post('auth/forgot-password', params)
  },
  
  async sendResetOTP(params) {
    return await $axios.$post('auth/send-reset-otp', params)
  },
  
  async resetPasswordWithOTP(params) {
    return await $axios.$post('auth/reset-password-otp', params)
  },
  
  // Protected routes (cần authentication)
  async getUser() {
    return await $axios.$get('auth/user')
  },
  
  async logout() {
    return await $axios.$post('auth/logout')
  },
  
  async refresh() {
    return await $axios.$post('auth/refresh')
  },
  
  async updateProfile(params) {
    return await $axios.$put('auth/profile', params)
  },
  
  async changePassword(params) {
    return await $axios.$post('auth/change-password', params)
  },
  
  async getUserAchievements() {
    return await $axios.$get('auth/achievements')
  },
  
  async getUserStats() {
    return await $axios.$get('auth/stats')
  }
})