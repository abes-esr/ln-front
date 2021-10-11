import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import {
  JsonLoginRequest,
  JsonLoginResponse
} from "@/service/licencesnationales/LicencesNationalesJsonDefinition";
import { serviceLn } from "@/service/licencesnationales/LicencesNationalesApiService";
import { Logger } from "@/utils/Logger";
import User from "@/components/User";
import Editeur from "@/components/Editeur";


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: new User(),
    darkTheme: false,
    notification: "",
    creationCompteEffectuee: false,
    sirenEtabSiAdmin: "",
    currentEditeur: new Editeur()
  },
  mutations: {
    SET_USER(state, token: JsonLoginResponse) {
      state.user.token = token.accessToken;
      state.user.siren = token.userSiren;
      state.user.nameEtab = token.nameEtab;
      state.user.isLoggedIn = true;
      state.user.isAdmin = token.role == "admin" ? true : false;
    },
    SET_LOGOUT(state) {
      state.user.token = "";
      state.user.siren = "";
      state.user.nameEtab = "";
      state.user.isLoggedIn = false;
      state.user.isAdmin = false;
    },
    SET_THEME(state) {
      state.darkTheme = !state.darkTheme;
    },
    SET_CREATION_COMPTE_TRUE(state) {
      state.creationCompteEffectuee = true;
    },
    SET_CREATION_COMPTE_FALSE(state) {
      state.creationCompteEffectuee = false;
    },
    SET_NOTIFICATION(state, notif) {
      state.notification = notif;
    },
    SET_SIRENETABSIADMIN(state, sirenEtabSiAdmin) {
      state.sirenEtabSiAdmin = sirenEtabSiAdmin;
    },
    SET_CURRENT_EDITEUR(state, item: Editeur) {
      state.currentEditeur = item;
    }
  },
  actions: {
    login({ commit }, credentials: JsonLoginRequest): Promise<boolean> {
      return new Promise((resolve, reject) => {
        // On appel le serviceLn LicencesNationales
        serviceLn
          .login(credentials)
          .then(result => {
            // On sauvegarde le getToken
            commit("SET_USER", result);
            resolve(true);
          })
          .catch(err => {
            //Si une erreur avec le ws est jetée, on lève un message d'erreur
            reject(err);
          });
      });
    },
    logout({ commit }) {
      commit("SET_LOGOUT");
    },
    changeTheme({ commit }) {
      commit("SET_THEME");
    },
    setCreationCompteEffectueeTrue({ commit }) {
      commit("SET_CREATION_COMPTE_TRUE");
    },
    setCreationCompteEffectueeFalse({ commit }) {
      commit("SET_CREATION_COMPTE_FALSE");
    },
    setNotification({ commit }, notif) {
      commit("SET_NOTIFICATION", notif);
    },
    setSirenEtabSiAdmin({ commit }, sirenEtabSiAdmin) {
      commit("SET_SIRENETABSIADMIN", sirenEtabSiAdmin);
    },
    setCurrentEditeur({ commit }, editeur: Editeur) {
      commit("SET_CURRENT_EDITEUR", editeur);
    }
  },
  getters: {
    userSiren: state => () => {
      return state.user.siren;
    },
    userEtab: state => () => {
      return state.user.nameEtab;
    },
    getToken: state => () => {
      return state.user.token;
    },
    isLoggedIn: state => () => {
      return state.user.isLoggedIn;
    },
    isAdmin: state => () => {
      return state.user.isAdmin;
    },
    isDark: state => () => {
      return state.darkTheme;
    },
    notification: state => () => {
      return state.notification;
    },
    creationCompteEffectuee: state => () => {
      return state.creationCompteEffectuee;
    },
    sirenEtabSiAdmin: state => () => {
      return state.sirenEtabSiAdmin;
    },
    getCurrentEditeur: state => () => {
      return state.currentEditeur;
    }
  },
  plugins: [createPersistedState()]
});
