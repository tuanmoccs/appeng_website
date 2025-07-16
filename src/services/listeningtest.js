export default ({ $axios }) => ({
  // Public routes
  async getList(params) {
    return await $axios.$get('listening-tests', { params })
  },
  
  // Protected routes (cần authentication)
  async getById(id) {
    return await $axios.$get(`listening-tests/${id}`)
  },
  
  async submit(id, params) {
    return await $axios.$post(`listening-tests/${id}/submit`, params)
  },
  
  async getResults(id, params) {
    return await $axios.$get(`listening-tests/${id}/results`, { params })
  }
})