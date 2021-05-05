<template>
  <div>
    <v-list dense nav>
      <v-list-item v-on:click="saveTheme()">
        <v-switch v-model="$vuetify.theme.dark" inset></v-switch>
        <v-list-item-title>Thème sombre</v-list-item-title>
      </v-list-item>
      <v-list-item v-on:click="$router.push({ name: 'Home' }).catch(err => {})">
        <v-list-item-action>
          <v-icon>mdi-home</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Accueil</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
          v-on:click="$router.push({ name: 'ListeAcces' }).catch(err => {})"
      >
        <v-list-item-action>
          <v-icon>mdi-ip-network</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Mes IPs</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-on:click="$router.push({ name: 'Profil' }).catch(err => {})"
      >
        <v-list-item-action>
          <v-icon>mdi-account-box</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Modifier profil</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-on:click="$router.push({ name: 'Password' }).catch(err => {})"
      >
        <v-list-item-action>
          <v-icon>mdi-lock</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Modifier mon mot de passe</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-on:click="disconnect()">
        <v-list-item-action>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Se déconnecter</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";
import Vue from "vue";

export default Vue.extend({
  name: "SideMenu",
  methods: {
    ...mapActions({
      changeTheme: "changeTheme",
      logout: "logout"
    }),
    saveTheme(): void {
      this.changeTheme();
    },
    disconnect(): void {
      this.logout();
      this.$router.push({ name: "Login" });
    }
  }
});
</script>
