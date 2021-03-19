import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import {VueReCaptcha} from "vue-recaptcha-v3";

Vue.config.productionTip = false;
console.log(process.env.VUE_APP_RECAPTCHA_KEY_SITE);
Vue.use(VueReCaptcha, { siteKey: process.env.VUE_APP_RECAPTCHA_KEY_SITE })

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
