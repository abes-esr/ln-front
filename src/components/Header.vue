<template>
  <v-app-bar
      color="primary"
      clipped-left
      app
      flat
      id="appBar"
      src="@/assets/img/header/graphe-couleur-appli-ln.png"
      height="150px"
  >
    <template v-slot:img="{ props }">
      <v-img
          v-bind="props"
          width="500px"
          style="margin-left: 70vw; height: 30vh;"
      ></v-img>
    </template>
    <v-layout class="d-flex flex-column" fill-height>
      <v-container class="justify-start">
        <v-app-bar-nav-icon
            v-if="$vuetify.breakpoint.xsOnly"
            @click="drawer = !drawer"
        ></v-app-bar-nav-icon>
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
      >
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                text
                outlined
                v-bind="attrs"
                v-on="on"
                class="menu-slot"
            >
              Bienvenue  {{ loggedInUsername }}
            </v-btn>
          </template>
          <v-list dense >
            <v-list-item class="d-flex flex-column align-stretch justify-start " style="min-height: auto;">
              <v-list-item-content class="align-self-auto menu-slot">
                <v-btn dark color="black" @click="allerAMonProfil()" plain>
                  <font-awesome-icon :icon="['fas', 'id-card']" size="1x" class="mx-2"/> Modifier mon profil
                </v-btn>
              </v-list-item-content>
              <v-list-item-content class="align-self-auto menu-slot">
                <v-btn dark color="black" @click="allerAModifierMotDePasse()" plain>
                  <font-awesome-icon :icon="['fas', 'key']" size="1x" class="mx-2"/> Modifier mon mot de passe
                </v-btn>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-divider vertical dark ></v-divider>
        <v-tooltip top max-width="20vw" open-delay="100">
          <template v-slot:activator="{ on }">
            <v-btn @click="seDeconnecter()"  class="menu-slot" plain v-on="on">
              <font-awesome-icon :icon="['fas', 'sign-out-alt']" size="2x"/>
            </v-btn>
          </template>
          <span>Se déconnecter</span>
        </v-tooltip>
      </v-container>
    </v-layout>
  </v-app-bar>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {Logger} from "@/utils/Logger";

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
    Logger.debug("username=" + this.$store.getters.userEtab());
    return this.$store.getters.userEtab();
  }

  seDeconnecter(): void {
    this.$store.dispatch("logout").catch(err => {
      Logger.error(err);
    });

    this.$router.push({name: "Login"});
  }

  allerAModifierMotDePasse(): void {
    this.$router.push({ name: "Password" }).catch(err => { Logger.error(err)});
  }

  allerAMonProfil(): void {
    this.$router.push({ name: "Profil" }).catch(err => { Logger.error(err)});
  }
}
</script>
