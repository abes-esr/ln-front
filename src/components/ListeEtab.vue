<template>
  <v-row align="center" class="list px-3 mx-auto">
    <v-col cols="12" md="8">
      <v-text-field v-model="valeur" label="Recherche par valeur"></v-text-field>
    </v-col>
    <v-col cols="12" md="4">
      <v-btn small @click="rechercheParValeur">
        Search
      </v-btn>
    </v-col>
    <v-col cols="12" sm="12">
      <v-card class="mx-auto" tile>
        <v-card-title>Liste des Etablissements</v-card-title>
        <v-data-table
            :headers="headers"
            :items="acces"
            disable-pagination
            :hide-default-footer="true"
        >
          <template v-slot:[`item.action`]="{ item }">
            <v-icon small class="mr-2" @click="modifierEtab(item.id)">mdi-pencil</v-icon>
            <v-icon small class="mr-2" @click="analyserEtab(item.id)">mdi-help-circle-outline</v-icon>
            <v-icon small @click="supprimerEtab(item.id)">mdi-delete</v-icon>
          </template>
        </v-data-table>
        <v-card-actions v-if="acces.length > 0">
          <v-btn small color="error" @click="suppTousEtab">
            Supprimer tous les établissements
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import Vue from "vue";
import axios from "axios";
export default Vue.extend({
  name: "ListeEtab",
  data() {
    return {
      acces: [],
      title: "",
      headers: [
        { text: "Date de création", align: "start", value: "dateCreation", sortable: false },
        { text: "Etablissement", value: "nomEtab", sortable: false },
        { text: "Type d'établissement", value: "typeEtab", sortable: false },
        { text: "Statut", value: "statut", sortable: false },
        { text: "Action", value: "action", sortable: false },
      ],
    };
  },
  computed: {
    //siren:this.$store.state.user.siren as string,
    /*loggedIn() {
      return this.$store.state.user.isLoggedIn;
    },*/
    getUserSiren() {
      return this.$store.state.user.siren;
    }
  },
  mounted() {
    /*if (this.loggedIn) {
      this.$router.push("/profile");
    }*/
    this.collecterEtab();
  },
  methods: {
    getAll() {
      return axios.get(process.env.VUE_APP_ROOT_API +'/ip/' + this.getUserSiren);
    },

    collecterEtab() {
      this.getAll()
          .then((response) => {
            this.acces = response.data.map(this.affichageEtab);
            console.log(response.data);
          })
          .catch((e) => {
            console.log(e);
          });
    },

    affichageEtab(etab) {
      return {
        id: etab.id,
        dateCreation: etab.dateCreation,
        nomEtab: etab.nomEtab,
        typeEtab: etab.typeEtab,
        statut: etab.statut ? "Published" : "Pending",
      };
    },
  },
});
</script>
<style>
.list {
  max-width: 750px;
}
</style>
