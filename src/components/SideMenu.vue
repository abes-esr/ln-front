<template>
  <div>
    <v-list dense nav>
      <v-list-item v-on:click="saveTheme()">
        <v-switch v-model="$vuetify.theme.dark" inset></v-switch>
        <v-list-item-title>Changer de thème</v-list-item-title>
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
        v-on:click="$router.push({ name: 'Profil' }).catch(err => {})"
      >
        <v-list-item-action>
          <v-icon>mdi-account-box</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Modifier profil</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";

export default {
  name: "SideMenu",
  methods: {
    ...mapActions({
      changeTheme: "changeTheme"
    }),
    saveTheme(): void {
      this.changeTheme();
    }
  }
};
</script>
