import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { VueReCaptcha } from "vue-recaptcha-v3";
import { Logger } from "@/utils/Logger";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { library } from "@fortawesome/fontawesome-svg-core";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { fas } from "@fortawesome/free-solid-svg-icons";

// Handle all Vue errors
Vue.config.errorHandler = error =>
  Logger.error(error.message, error.constructor.name);

Vue.config.productionTip = false;

if (process.env.VUE_APP_RECAPTCHA_KEY_SITE == "") {
  Logger.error("La clé ReCaptcha est vide");
}

Vue.use(VueReCaptcha, { siteKey: process.env.VUE_APP_RECAPTCHA_KEY_SITE });

library.add(fas); // Import de toutes les icones
Vue.component("font-awesome-icon", FontAwesomeIcon);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");

export const TypeIpChangeEvent = new Vue();
export const IpChangeEvent = new Vue();
export const GetTypeIpFromModifierAccesEvent = new Vue();
export const AjouterAccesSubmitEvent = new Vue();
export const FormModuleSegmentsIpPlageEvent = new Vue();
