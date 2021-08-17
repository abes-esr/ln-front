import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import fr from "vuetify/src/locale/fr";

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { fr },
    current: "fr"
  },
  theme: {
    themes: {
      light: {
        primary: "#295494",
        secondary: "#252C61",
        accent: "#980827",
        button: "#cf491f"
      },
      dark: {
        primary: "#404552",
        secondary: "#383c4a",
        accent: "#980827",
        button: "#cf491f"
      }
    }
  }
});
