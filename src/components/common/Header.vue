<template>
  <v-app-bar
    color="primary"
    flat
    id="appBar"
    src="@/assets/img/header/graphe-couleur-appli-ln.png"
    max-height="150px"
  >
    <template v-slot:img="{ props }">
      <v-img
        v-bind="props"
        width="500px"
        style="margin-left: 70vw; height: 100%;"
      ></v-img>
    </template>
    <v-layout class="d-flex flex-column" fill-height>
      <v-container class="justify-start pa-0" style="height: 100%">
        <v-toolbar-title
          id="titleBar"
          v-on:click="$router.push({ name: 'Home' }).catch(err => {})"
        >
          <v-img
            alt="Logo licences nationales"
            src="@/assets/img/logo.svg"
            target="_blank"
            max-width="300px"
          ></v-img>
        </v-toolbar-title>
      </v-container>
      <v-container
        v-if="isLoggedIn"
        class="d-flex justify-end mainBar ma-0 pa-0 pr-12"
        style="max-height: 40px"
      >
        <div class="menu-slot btn-3 d-flex align-center mr-3">
          Bienvenue {{ loggedInUsername }}
        </div>
        <v-divider vertical dark></v-divider>
        <v-tooltip top max-width="20vw" open-delay="100">
          <template v-slot:activator="{ on }">
            <v-btn
              href="https://stp.abes.fr/node/3?origine=LicencesNationales"
              target="_blank"
              class="menu-slot btn-3"
              plain
              v-on="on"
            >
              <font-awesome-icon :icon="['fas', 'comments']" size="2x" />
            </v-btn>
          </template>
          <span>Assistance</span>
        </v-tooltip>
        <v-divider vertical dark></v-divider>
        <v-tooltip top max-width="20vw" open-delay="100">
          <template v-slot:activator="{ on }">
            <v-btn
              href="http://documentation.abes.fr/aidelicencesnationales/index.html"
              target="_blank"
              class="menu-slot btn-3"
              plain
              v-on="on"
            >
              <font-awesome-icon :icon="['fas', 'question']" size="2x" />
            </v-btn>
          </template>
          <span>Documentation</span>
        </v-tooltip>
        <v-divider vertical dark></v-divider>
        <v-tooltip top max-width="20vw" open-delay="100">
          <template v-slot:activator="{ on }">
            <v-btn
              @click="seDeconnecter()"
              class="menu-slot btn-3"
              plain
              v-on="on"
            >
              <font-awesome-icon :icon="['fas', 'sign-out-alt']" size="2x" />
            </v-btn>
          </template>
          <span>Se déconnecter</span>
        </v-tooltip>
      </v-container>
    </v-layout>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Logger } from "@/utils/Logger";

@Component
export default class Header extends Vue {
  drawer: boolean = true;

  get isLoggedIn(): boolean {
    return this.$store.getters.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.$store.getters.isAdmin();
  }

  get loggedInUsername(): string {
    return this.$store.getters.userEtab();
  }

  seDeconnecter(): void {
    this.$store.dispatch("logout").catch(err => {
      Logger.error(err);
    });
  }
}
</script>
