export default ({ $axios }) => ({
  // Public routes
  async getList(params) {
    return await $axios.$get('quizzes', { params })
  },
  
  // Protected routes (cần authentication)
  async getById(id) {
    return await $axios.$get(`quizzes/${id}`)
  },
  
  async submit(id, params) {
    return await $axios.$post(`quizzes/${id}/submit`, params)
  },
  
  async getUserResults(params) {
    return await $axios.$get('user/quiz-results', { params })
  }
})