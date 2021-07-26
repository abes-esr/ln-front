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
    <v-app-bar
      color="primary"
      clipped-left
      app
      flat
      height="80px"
      id="appBar"
      src="@/assets/graphe-couleur-appli-ln.png"
      extended
      extension-height="30"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          width="500px"
          style="margin-left: 80%; height: 80%"
        ></v-img>
      </template>
      <template v-slot:extension>
        <div id="blueBar"></div>
      </template>
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.xsOnly"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title
        id="titleBar"
        v-on:click="$router.push({ name: 'Home' }).catch(err => {})"
        ><v-img
          alt="Logo licences nationales"
          src="@/assets/logo.svg"
          target="_blank"
          max-width="300px"
          style="margin-left: 1em; margin-top: 0.5em"
        ></v-img
      ></v-toolbar-title>
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
#appBar {
  background: rgb(46, 63, 80);
  background: linear-gradient(
    90deg,
    rgba(46, 63, 80, 1) 20%,
    rgba(97, 142, 186, 1) 100%
  );
}
#blueBar {
  width: 100%;
  height: 100%;
  background-color: #252c61;
}
.v-navigation-drawer__content {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.v-toolbar__extension {
  padding: 0 !important;
  padding-top: 8px !important;
  margin: 0;
  z-index: 0;
  position: static !important;
}
h1 {
  color: #478dcb;
  font-size: 1.8em;
  font-weight: 900;
}
h2,
.v-card__title {
  color: #252c61;
  font-size: 1.5em !important;
  font-weight: 900 !important;
}
h3,
h4,
h5 {
  color: #252c61;
}
body {
  color: black;
}
</style>
