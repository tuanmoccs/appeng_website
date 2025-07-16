export default ({ $axios }) => ({
  // Public routes
  async getList(params) {
    return await $axios.$get('words', { params })
  },
  
  async getById(id) {
    return await $axios.$get(`words/${id}`)
  }
})