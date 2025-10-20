import { createRouter, createWebHistory } from "vue-router"
import Home from "@/pages/home.vue"
import Login from "@/pages/auth/Login.vue"
import Register from "@/pages/auth/Register.vue"
import TestList from "@/pages/tests/TestList.vue"
import TestDetail from "@/pages/tests/TestDetail.vue"
import ListeningTestList from "@/pages/listeningtests/ListeningTestList.vue"
import ListeningTestDetail from "@/pages/listeningtests/ListeningTestDetail.vue"
import QuizzList from "@/pages/quizz/QuizzList.vue"
import QuizDetail from "@/pages/quizz/QuizDetail.vue"
import Translate from "@/pages/word/translate.vue"
import SpeakingwithAI from "@/pages/speaking/speakingwithAI.vue"
import OauthCallback from "@/pages/auth/OauthCallback.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "auth.login",
    component: Login,
  },
  {
    path: "/register",
    name: "auth.register",
    component: Register,
  },
  {
    path: "/tests",
    name: "test.list",
    component: TestList,
  },
  {
    path: "/test/:id",
    name: "test.detail",
    component: TestDetail,
  },
  {
    path: "/listening-tests",
    name: "listening.list",
    component: ListeningTestList,
  },
  {
    path: "/listening-test/:id",
    name: "listening.detail",
    component: ListeningTestDetail,
  },
  {
    path: "/quizzes",
    name: "quizzes.list",
    component: QuizzList,
  },
  {
    path: "/quizz/:id",
    name: "quizzes.detail",
    component: QuizDetail,
  },
  {
    path: "/translate",
    name: "translate",
    component: Translate,
  },
  {
    path: "/speaking-with-ai",
    name: "speaking-with-ai",
    component: SpeakingwithAI,
  },
  {
    path: '/oauth/callback',
    name: 'OAuthCallback',
    component: OauthCallback,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
