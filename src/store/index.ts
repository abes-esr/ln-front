import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      siren: "",
      token: "",
      nameEtab: "",
      isLoggedIn: false,
      isAdmin: false
    },
    darkTheme: false,
    notification: "",
    creationCompteEffectuee: false,
    sirenEtabSiAdmin: ""
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.user.token = token.accessToken;
      state.user.siren = token.siren;
      state.user.nameEtab = token.nameEtab;
      state.user.isLoggedIn = true;
      state.user.isAdmin = token.isAdmin;
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
    }
  },
  actions: {
    login({ commit }, credentials) {
      return axios
        .post(process.env.VUE_APP_ROOT_API + "login", {
          login: credentials.siren,
          password: credentials.password
        })
        .then(result => {
          commit("SET_TOKEN", result.data);
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
    }
  },
  getters: {
    userSiren: state => {
      return state.user.siren;
    },
    userEtab: state => {
      return state.user.nameEtab;
    },
    token: state => {
      return state.user.token;
    },
    isLoggedIn: state => {
      return state.user.isLoggedIn;
    },
    isAdmin: state => {
      return state.user.isAdmin;
    },
    isDark: state => {
      return state.darkTheme;
    },
    notification: state => {
      return state.notification;
    },
    creationCompteEffectuee: state => {
      return state.creationCompteEffectuee;
    },
    sirenEtabSiAdmin: state => {
      return state.sirenEtabSiAdmin;
    }
  },
  plugins: [createPersistedState()]
});
