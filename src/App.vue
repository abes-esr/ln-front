<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      :permanent="!$vuetify.breakpoint.xsOnly"
      hide-overlay
      flat
      width="180"
    >
      <side-menu></side-menu>
    </v-navigation-drawer>
    <v-app-bar color="primary" clipped-left app flat>
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.xsOnly"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
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
  data: () => ({
    drawer: true
  }),
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
