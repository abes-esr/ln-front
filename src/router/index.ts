import Vue from "vue";
import store from "../store/index";
import VueRouter, {RouteConfig} from "vue-router";
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
    component: () => import("../components/login/FormReinitialisationPass.vue")
  },
  {
    path: "/fusionEtablissement",
    name: "fusionEtablissement",
    component: () =>
      import("../components/etablissement/FormFusionEtablissement.vue")
  },
  {
    path: "/scissionEtablissement",
    name: "scissionEtablissement",
    component: () =>
      import("../components/etablissement/FormScissionEtablissement.vue")
  },
  {
    path: "/listeAcces",
    name: "ListeAcces",
    component: () => import("../components/acces/ListeAcces.vue"),
    meta: {
      requiresAuth: true
    }
  },
  //TODO faire un composant générique pour la route /ajouterAccess
  {
    path: "/ajouterAcces2/ip",
    name: "ajouterAcces2",
    component: () => import("../components/acces/AjouterAcces.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/ajouterAcces2/plage",
    name: "ajouterAcces2",
    component: () => import("../components/acces/AjouterAcces.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/modifierAcces/:id&:typeAcces",
    name: "ModifierAcces",
    component: () => import("../components/acces/ModifierAcces.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/listeEtab",
    name: "ListeEtab",
    component: () => import("../components/etablissement/ListeEtab.vue")
  },
  {
    path: "/forgotPassword",
    name: "ForgotPassword",
    component: () => import("../components/login/ForgotPassword.vue")
  },
  {
    path: "/creationCompte",
    name: "CreationCompte",
    component: () => import("../views/CreationCompte.vue")
  },
  {
    path: "/listeEditeurs",
    name: "ListeEditeurs",
    component: () => import("../components/editeur/ListeEditeurs.vue")
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
