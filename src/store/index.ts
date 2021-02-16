import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: { name: "", token: "", isLoggedIn: false }
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.user.token = token.accessToken;
      state.user.name = token.userName;
      state.user.isLoggedIn = true;
    },
    SET_LOGOUT(state) {
      state.user.token = "";
      state.user.name = "";
      state.user.isLoggedIn = false;
    }
  },
  actions: {
    login({ commit }, credentials) {
      return axios
        .post(process.env.VUE_APP_ROOT_API + "login", {
          username: credentials.username,
          password: credentials.password
        })
        .then(result => {
          commit("SET_TOKEN", result.data);
        });
    },
    logout({ commit }) {
      commit("SET_LOGOUT");
    }
  },
  getters: {
    userName: state => {
      return state.user.name;
    },
    token: state => {
      return state.user.token;
    },
    isLoggedIn: state => {
      return state.user.isLoggedIn;
    }
  }
});
