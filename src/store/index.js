import { createStore } from "vuex"

const store = createStore({
  state: () => ({
    userInfo: {},
    accessToken: null,
    email: "",
    isLoading: false,
  }),

  getters: {
    isLogged: (state) => {
      return state.userInfo && state.userInfo.id !== null && state.userInfo.id !== undefined
    },
    currentUser: (state) => {
      return state.userInfo
    },
    isLoading: (state) => {
      return state.isLoading
    },
  },

  mutations: {
    SET_LOADING(state, status) {
      state.isLoading = status
    },
    SET_ACCESS_TOKEN(state, token) {
      state.accessToken = token
    },
    SET_USER_INFO(state, user) {
      state.userInfo = user
    },
    SET_EMAIL(state, email) {
      state.email = email
    },
    UPDATE_USER_INFO(state, userData) {
      state.userInfo = { ...state.userInfo, ...userData }
    },
    LOGOUT(state) {
      state.userInfo = {}
      state.accessToken = null
      state.email = ""
    },
  },

  actions: {
    login({ commit }, { userInfo, token }) {
      commit("SET_ACCESS_TOKEN", token)
      commit("SET_USER_INFO", userInfo)
    },
    logout({ commit }) {
      commit("LOGOUT")
      localStorage.removeItem("access_token")
      localStorage.removeItem("user_info")
      localStorage.removeItem("token_expired_at")
    },
    initializeAuth({ commit }) {
      const token = localStorage.getItem("access_token")
      const userInfoStr = localStorage.getItem("user_info")

      if (token && userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr)
          commit("SET_ACCESS_TOKEN", token)
          commit("SET_USER_INFO", userInfo)
        } catch (error) {
          // Clear invalid auth data
          localStorage.removeItem("access_token")
          localStorage.removeItem("user_info")
          localStorage.removeItem("token_expired_at")
          commit("LOGOUT")
        }
      } else {
        // Clear invalid auth data
        localStorage.removeItem("access_token")
        localStorage.removeItem("user_info")
        localStorage.removeItem("token_expired_at")
        commit("LOGOUT")
      }
    },
  },
})

export default store
