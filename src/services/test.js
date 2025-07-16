export default ({ $axios }) => ({
  // Public routes
  async getList(params) {
    return await $axios.$get('tests', { params })
  },
  
  // Protected routes (cần authentication)
  async getById(id) {
    return await $axios.$get(`tests/${id}`)
  },
  
  async submit(id, params) {
    return await $axios.$post(`tests/${id}/submit`, params)
  },
  
  async getUserResults(id, params) {
    return await $axios.$get(`tests/${id}/results`, { params })
  }
})