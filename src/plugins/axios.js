import axios from "axios"
import router from "@/router"
import errorMessages from "@/constants/error"

// Tạo axios instance
const $axios = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || "http://localhost:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Thêm method $get, $post, $put, $delete như Nuxt.js
$axios.$get = async (url, config = {}) => {
  const response = await $axios.get(url, config)
  return response.data
}

$axios.$post = async (url, data, config = {}) => {
  const response = await $axios.post(url, data, config)
  return response.data
}

$axios.$put = async (url, data, config = {}) => {
  const response = await $axios.put(url, data, config)
  return response.data
}

$axios.$delete = async (url, config = {}) => {
  const response = await $axios.delete(url, config)
  return response.data
}

$axios.$patch = async (url, data, config = {}) => {
  const response = await $axios.patch(url, data, config)
  return response.data
}

// Request interceptor
$axios.interceptors.request.use(
  (config) => {
    // Ignore handle error on response by flag
    const configData = config.data || {}
    const { clientOptions } = configData

    if (clientOptions) {
      config.headers["Client-Error-Handler"] = clientOptions.errorHandler
      if (typeof clientOptions === "object") {
        delete configData.clientOptions
      }
    }

    // Thêm token vào header nếu có
    const accessToken = localStorage.getItem("access_token")

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
$axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const statusCode = error.response?.status
    const errorCode = error.response?.data?.error_code
    const errorMessage = error.response?.data?.message

    // Xử lý lỗi 401 - Unauthorized
    if (statusCode === 401) {
      // Clear tokens
      localStorage.removeItem("access_token")
      localStorage.removeItem("user_info")
      localStorage.removeItem("token_expired_at")

      // Redirect to login
      router.push("/login")

      return Promise.reject(error)
    }

    // Xử lý lỗi 403 - Forbidden
    if (statusCode === 403) {
      console.error("Bạn không có quyền truy cập tài nguyên này")
      return Promise.reject(error)
    }

    // Xử lý lỗi 429 - Too Many Requests
    if (statusCode === 429) {
      console.error("Bạn đã gửi quá nhiều yêu cầu trong thời gian ngắn")
      return Promise.reject(error)
    }

    // Xử lý lỗi validation 422
    if (statusCode === 422) {
      return Promise.reject(error) // Không hiển thị toast, trả lỗi về component
    }

    // Xử lý các lỗi khác
    let message = errorMessage || errorCode || "Đã xảy ra lỗi. Vui lòng thử lại."
    message = errorMessages[errorCode] ? errorMessages[errorCode] : message

    console.error(message)

    return Promise.reject(error)
  },
)

// Plugin install function
export default {
  install(app) {
    app.config.globalProperties.$axios = $axios
    app.provide("axios", $axios)
  },
}

// Export để sử dụng trong composition API
export { $axios }
