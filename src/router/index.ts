import Vue from "vue";
import store from "../store/index";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import FormLogin from "../components/FormLogin.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: FormLogin
  },
  {
    path: "*",
    /* component: NotFoundComponent, */
    redirect: "/"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters["isLoggedIn"];
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next({ path: "/login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
