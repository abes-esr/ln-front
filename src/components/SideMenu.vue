<template>
  <div>
    <v-list dense rounded color="transparent">
      <v-col cols="1" sm="1"></v-col>
      <v-col cols="1" sm="1">
        <v-row>
          <v-list-item v-on:click="saveTheme()">
            <v-switch v-model="$vuetify.theme.dark" inset></v-switch>
            <v-list-item-title>Thème sombre</v-list-item-title>
          </v-list-item>
        </v-row>

        <v-row>
          <v-list-item
            v-on:click="$router.push({ name: 'Home' }).catch(err => {})"
          >
            <v-list-item-action>
              <v-icon>mdi-home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Accueil</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-row>

        <v-row v-if="this.isAdmin === 'false'">
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
        </v-row>
        <v-row v-else></v-row>

        <v-row v-if="this.isAdmin === 'true'">
          <v-list-item
            v-on:click="$router.push({ name: 'ListeEtab' }).catch(err => {})"
          >
            <v-list-item-action>
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Etablissements</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-row>
        <v-row v-else></v-row>

        <v-row v-if="this.isAdmin === 'true'">
          <v-list-item
            v-on:click="
              $router.push({ name: 'ListeEditeurs' }).catch(err => {})
            "
          >
            <v-list-item-action>
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Editeurs</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-row>
        <v-row v-else></v-row>

        <v-row>
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
        </v-row>

        <v-row>
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
        </v-row>

        <v-row v-if="this.isAdmin === 'true'">
          <v-list-item
            v-on:click="
              $router.push({ name: 'scissionEtablissement' }).catch(err => {})
            "
          >
            <v-list-item-action>
              <v-icon>mdi-set-split</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Scission établissements</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-row>
        <v-row v-else></v-row>

        <v-row v-if="this.isAdmin === 'true'">
          <v-list-item
            v-on:click="
              $router.push({ name: 'fusionEtablissement' }).catch(err => {})
            "
          >
            <v-list-item-action>
              <v-icon>mdi-set-merge</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Fusion établissements</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-row>
        <v-row v-else></v-row>

        <v-row>
          <v-list-item v-on:click="disconnect()">
            <v-list-item-action>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Se déconnecter</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-row>
      </v-col>
    </v-list>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {Logger} from "@/utils/Logger";

@Component
export default class SideMenu extends Vue {
  get isAdmin() {
    Logger.debug("isAdmin = " + this.$store.getters.isAdmin);
    return this.$store.getters.isAdmin;
  }

  saveTheme(): void {
    this.$store.dispatch("changeTheme").catch(err => {
      Logger.error(err);
    });
  }
  disconnect(): void {
    this.$store.dispatch("logout").catch(err => {
      Logger.error(err);
    });

    this.$router.push({ name: "Login" });
  }
}
</script>
