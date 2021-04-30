import Vue from "vue";
import store from "../store/index";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";

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
    component: Login
  },
  {
    path: "/profil",
    name: "Profil",
    component: () => import("../views/Profile.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/password",
    name: "Password",
    component: () => import("../views/Password.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/reinitialisationPass",
    name: "ReinitialisationPass",
    component: () => import("../components/FormReinitialisationPass.vue")
  },
  {
    path: "/fusionEtablissement",
    name: "fusionEtablissement",
    component: () => import("../components/FormFusionEtablissement.vue")
  },
  {
    path: "/formEtab",
    name: "FormEtab",
    component: () => import("../components/FormEtab.vue")
  },
  {
    path: "/listeAcces",
    name: "ListeAcces",
    component: () => import("../components/ListeAcces.vue")
  },
  {
    path: "/listeEtab",
    name: "ListeEtab",
    component: () => import("../components/ListeEtab.vue")
  },
  {
    path: "/creationCompte",
    name: "CreationCompte",
    component: () => import("../views/CreationCompte.vue")
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
