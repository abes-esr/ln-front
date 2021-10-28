<template>
  <v-app>
    <Header></Header>
    <v-layout class="flex-shrink-0">
      <side-menu :display-menu="isLoggedIn" :is-admin="isAdmin"></side-menu>
      <v-main class="ma-0 pa-3">
        <transition name="fade">
          <router-view/>
        </transition>
      </v-main>
    </v-layout>
    <Footer></Footer>
  </v-app>
</template>
<style lang="scss">
@import "./assets/styles/main.scss";
</style>
<script lang="ts">
import Vue from "vue";
import SideMenu from "./components/SideMenu.vue";
import {Component} from "vue-property-decorator";
import Footer from "@/components/Footer.vue";
import Header from "@/components/Header.vue";

@Component({
  components: {Header, SideMenu, Footer}
})
export default class App extends Vue {
  get isDark(): boolean {
    return this.$store.getters.isDark();
  }

  get isLoggedIn(): boolean {
    return this.$store.getters.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.$store.getters.isAdmin();
  }

  mounted() {
    if (this.isDark) {
      this.$vuetify.theme.dark = true;
    }
  }
}
</script>
