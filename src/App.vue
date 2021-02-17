<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      bottom
      temporary
      disable-resize-watcher
      app
    >
      <side-menu></side-menu>
    </v-navigation-drawer>
    <v-app-bar color="primary" app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Licences Nationales</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <transition name="fade">
        <router-view />
      </transition>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import SideMenu from "./components/SideMenu.vue";

import { mapGetters } from "vuex";

export default Vue.extend({
  name: "App",
  data: () => ({
    drawer: false
  }),
  components: {
    SideMenu
  },
  computed: {
    ...mapGetters({
      darkTheme: "isDark"
    })
  },
  mounted() {
    if (this.darkTheme) {
      this.$vuetify.theme.dark = true;
    }
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
