import Vue from "vue";
import store from "../store/index";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import { Action } from "@/core/CommonDefinition";

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
  //Authentication
  {
    path: "/login",
    name: "Login",
    component: Login
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
    path: "/forgotPassword",
    name: "ForgotPassword",
    component: () => import("../components/login/ForgotPassword.vue")
  },
  //Etablissement
  {
    path: "/creationEtablissement",
    name: "CreationEtablissement",
    component: () =>
      import("../components/etablissement/FormEtablissement.vue"),
    props: { action: Action.CREATION }
  },
  {
    path: "/profil",
    name: "Profil",
    component: () => import("../components/etablissement/FormEtablissement.vue"),
    props: {
      action: Action.MODIFICATION
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/ModifierEtablissement",
    name: "ModifierEtablissement",
    component: () =>
      import("../components/etablissement/FormEtablissement.vue"),
    props: {
      action: Action.MODIFICATION
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/donneespersonnelles",
    name: "DonneesPersonnelles",
    component: () => import("../views/DonneesPersonnelles.vue")
  },

  {
    path: "/listeEtab",
    name: "ListeEtab",
    component: () => import("../components/etablissement/ListeEtab.vue")
  },
  {
    path: "/fusionEtablissement",
    name: "fusionEtablissement",
    component: () =>
      import("../components/etablissement/FormFusionEtablissement.vue"),
    meta: {
      requiresAuth: true,
      isAdmin: true
    }
  },
  {
    path: "/scissionEtablissement",
    name: "scissionEtablissement",
    component: () =>
      import("../components/etablissement/FormScissionEtablissement.vue"),
    meta: {
      requiresAuth: true,
      isAdmin: true
    }
  },
  {
    path: "/listeAcces/:sirenEtabSiAdmin",
    name: "ListeAcces",
    component: () => import("../components/acces/ListeAcces.vue"),
    props: true,
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
    path: "/modifierAcces/:id&:typeAcces",
    name: "ModifierAcces",
    component: () => import("../components/acces/ModifierAcces.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/listeEditeurs",
    name: "ListeEditeurs",
    component: () => import("../components/editeur/ListeEditeurs.vue"),
    meta: {
      requiresAuth: true,
      isAdmin: true
    }
  },
  {
    path: "/nouvelEditeur",
    name: "NouvelEditeur",
    component: () => import("../components/editeur/FormEditeur.vue"),
    props: { action: Action.CREATION },
    meta: {
      requiresAuth: true,
      isAdmin: true
    }
  },
  {
    path: "/modifierEditeur",
    name: "ModifierEditeur",
    component: () => import("../components/editeur/FormEditeur.vue"),
    props: { action: Action.MODIFICATION },
    meta: {
      requiresAuth: true,
      isAdmin: true
    }
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

const DEFAULT_TITLE = "Licences Nationales";
router.afterEach(to => {
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});

router.beforeEach((to, from, next) => {
  if (
    to.matched.some(record => record.meta.requiresAuth) &&
    !store.getters.isLoggedIn()
  ) {
    next({
      path: "/login"
    });
  } else if (
    to.matched.some(record => record.name === "Login") &&
    store.getters.isLoggedIn()
  ) {
    next({
      path: "/home"
    });
  } else if (
    to.matched.some(record => record.name === "ReinitialisationPass") &&
    store.getters.isLoggedIn()
  ) {
    next({
      path: "/home"
    });
  } else {
    next();
  }
});

export default router;
