export default ({ $axios }) => ({
  // Public routes
  async getList(params) {
    return await $axios.$get('lessons', { params })
  },
  
  // Protected routes (cần authentication)
  async getStats(params) {
    return await $axios.$get('lessons/stats', { params })
  },
  
  async getById(id) {
    return await $axios.$get(`lessons/${id}`)
  },
  
  async updateProgress(id, params) {
    return await $axios.$post(`lessons/${id}/progress`, params)
  },
  
  async complete(id, params) {
    return await $axios.$post(`lessons/${id}/complete`, params)
  }
})