import Vue from "vue";
import store from "../store/index";
import VueRouter, { RouteConfig } from "vue-router";
import Login from "../views/Login.vue";
import { Action, Message, MessageType } from "@/core/CommonDefinition";
import { authService } from "@/core/service/licencesnationales/AuthentificationService";
import { Logger } from "@/utils/Logger";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/TableauDeBord.vue"),
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
    component: () =>
      import(
        "../components/authentification/login/FormReinitialisationPass.vue"
      )
  },
  {
    path: "/forgotPassword",
    name: "ForgotPassword",
    component: () =>
      import("../components/authentification/login/ForgotPassword.vue")
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
    path: "/afficherEtablissement",
    name: "AfficherEtablissement",
    component: () => import("../components/etablissement/CardEtablissement.vue")
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
    path: "/listeAcces",
    name: "ListeIP",
    component: () => import("../components/ip/ListeAcces.vue"),
    meta: {
      requiresAuth: true
    }
  },
  //TODO faire un composant générique pour la route /ajouterAccess
  {
    path: "/ajouterAcces",
    name: "ajouterAcces",
    component: () => import("../components/ip/AjouterAcces.vue"),
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
    path: "/recherche",
    name: "Recherche",
    component: () => import("../components/common/Recherche.vue"),
    meta: {
      requiresAuth: true,
      isAdmin: true
    }
  },
  {
    path: "/CGU",
    name: "CGU",
    component: () => import("../views/footer-static/CGU.vue")
  },
  {
    path: "/donneespersonnelles",
    name: "DonneesPersonnelles",
    component: () => import("../views/footer-static/DonneesPersonnelles.vue")
  },
  {
    path: "/mentions",
    name: "MentionsLegales",
    component: () => import("../views/footer-static/MentionsLegales.vue")
  },
  {
    path: "/accessibilite",
    name: "Accessibilite",
    component: () => import("../views/footer-static/Accessibilite.vue")
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
  } else if (to.matched.some(record => record.meta.requiresAuth)) {
    authService
      .verifierValiditeToken(store.getters.getToken())
      .then(response => {
        if (!response) {
          const message: Message = new Message();
          message.type = MessageType.ERREUR;
          message.texte = "Votre session a expiré";
          message.isSticky = true;
          store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          store.dispatch("logout").catch(err => {
            Logger.error(err.toString());
          });
        } else {
          next();
        }
      })
      .catch(err => {
        // On déconnecte l'utilisateur au cas où...;
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        message.texte = err.message + ". Vous avez été déconnecté";
        message.isSticky = true;
        store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err.toString());
        });
        store.dispatch("logout").catch(err => {
          Logger.error(err.toString());
        });
      });
  } else {
    next();
  }
});

export default router;
