import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: { name: "", token: "", nameEtab: "", isLoggedIn: false, isAdmin: false },
    darkTheme: false
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.user.token = token.accessToken;
      state.user.name = token.userName;
      state.user.nameEtab = token.userNameEtab;
      state.user.isLoggedIn = true;
      state.user.isAdmin = token.isAdmin;
    },
    SET_LOGOUT(state) {
      state.user.token = "";
      state.user.name = "";
      state.user.nameEtab = "";
      state.user.isLoggedIn = false;
      state.user.isAdmin = false;
    },
    SET_THEME(state) {
      state.darkTheme = !state.darkTheme;
    }
  },
  actions: {
    login({ commit }, credentials) {
      return axios
        .post("http://localhost:8081/" + "login", {
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
    creationCompte({ commit }, data) {
      return axios
          .post("http://localhost:8081/" + "creationCompte", {
            nom:data.nomEtab,
            siren:data.sirenEtab,
            typeEtablissement:data.typeEtab,
            idAbes:data.idAbes,
            nomContact:data.nomContact,
            prenomContact:data.prenomContact,
            adresseContact:data.adresseContact,
            boitePostaleContact:data.boitePostaleContact,
            codePostalContact:data.codePostalContact,
            villeContact:data.villeContact,
            cedexContact:data.cedexContact,
            telephoneContact:data.telContact,
            mailContact:data.emailContact,
            motDePasse:data.passContact,
            roleContact:data.roleContact
          })
          .then(result => {
            commit(result.data);
          });
    },
  },
  getters: {
    userName: state => {
      return state.user.name;
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
    }
  },
  plugins: [createPersistedState()]
});
