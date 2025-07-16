import { createRouter, createWebHistory } from "vue-router"
import Home from "@/pages/home.vue"
import Login from "@/pages/auth/Login.vue"
import Register from "@/pages/auth/Register.vue"
import TestList from "@/pages/tests/TestList.vue"
import TestDetail from "@/pages/tests/TestDetail.vue"
import ListeningTestList from "@/pages/listeningtests/ListeningTestList.vue"
import ListeningTestDetail from "@/pages/listeningtests/ListeningTestDetail.vue"

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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
