import axios from "axios";
import store from "../store";

export const HTTP = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API,
  headers: {
    Authorization: store.getters.token
  }
});
