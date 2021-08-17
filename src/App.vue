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
      src="@/assets/img/header/graphe-couleur-appli-ln.png"
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
          src="@/assets/img/logo.svg"
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
<style lang="scss">
@import "./assets/styles/main.scss";
</style>
<script lang="ts">
import Vue from "vue";
import SideMenu from "./components/SideMenu.vue";
import { Component } from "vue-property-decorator";

@Component({
  components: { SideMenu }
})
export default class App extends Vue {
  drawer: boolean = true;

  get isDark(): boolean {
    return this.$store.getters.isDark;
  }

  get isLoggedIn(): boolean {
    return this.$store.getters.isLoggedIn;
  }

  mounted() {
    if (this.isDark) {
      this.$vuetify.theme.dark = true;
    }
  }
}
</script>
