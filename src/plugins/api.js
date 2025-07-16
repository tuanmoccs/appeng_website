import auth from '@/services/auth'
import word from '@/services/word'
import lesson from '@/services/lesson'
import quiz from '@/services/quiz'
import test from '@/services/test'
import listeningtest from '@/services/listeningtest'

export default {
  install(app) {
    const $axios = app.config.globalProperties.$axios

    if(!$axios) {
      throw new Error('Axios plugin must be installed before API plugin')
    }
    
    const api = {
      auth: auth({ $axios }),
      word: word({ $axios }),
      lesson: lesson({ $axios }),
      quiz: quiz({ $axios }),
      test: test({ $axios }),
      listeningtest: listeningtest({ $axios })
    }
    app.config.globalProperties.$api = api
    app.provide('api', api)
  }
}
export const createApi = ($axios) => {
  return {
    auth: auth({ $axios }),
    word: word({ $axios }),
    lesson: lesson({ $axios }),
    quiz: quiz({ $axios }),
    test: test({ $axios }),
    listeningtest: listeningtest({ $axios })
  }
}