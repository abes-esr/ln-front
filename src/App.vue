<template>
  <v-app>
    <v-navigation-drawer app clipped permanent hide-overlay stateless flat>
      <side-menu></side-menu>
    </v-navigation-drawer>
    <v-app-bar color="primary" clipped-left app flat>
      <v-toolbar-title
        id="titleBar"
        v-on:click="$router.push({ name: 'Home' }).catch(err => {})"
        >Licences Nationales</v-toolbar-title
      >
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
  components: {
    SideMenu
  },
  computed: {
    ...mapGetters({
      darkTheme: "isDark",
      isLogged: "isLoggedIn"
    })
  },
  mounted() {
    if (this.darkTheme) {
      this.$vuetify.theme.dark = true;
    }
  }
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
#titleBar {
  cursor: pointer;
}
.v-navigation-drawer__content {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
