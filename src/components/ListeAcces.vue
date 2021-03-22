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
        <v-card-title>Liste des Accès</v-card-title>

        <v-data-table
            :headers="headers"
            :items="acces"
            disable-pagination
            :hide-default-footer="true"
        >
          <template v-slot:[`item.action`]="{ item }">
            <v-icon small class="mr-2" @click="modifierAcces(item.id)">mdi-pencil</v-icon>
            <v-icon small class="mr-2" @click="analyserAcces(item.id)">mdi-help-circle-outline</v-icon>
            <v-icon small @click="supprimerAcces(item.id)">mdi-delete</v-icon>
          </template>
        </v-data-table>

        <v-card-actions v-if="acces.length > 0">
          <v-btn small color="error" @click="suppTousAcces">
            Supprimer tous les accès
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
//import AccesDataService from "../services/AccesDataService";
//import http from "../http-commons";
import Vue from "vue";
import axios from "axios";

export default Vue.extend({
  name: "ListeAcces",
  data() {
    return {
      acces: [],
      title: "",
      headers: [
        { text: "Date de création", align: "start", value: "dateCreation", sortable: false },
        { text: "Date de modification", value: "dateModif", sortable: false },
        { text: "Type d'accès", value: "typeAcces", sortable: false },
        { text: "Type d'IP", value: "typeIp", sortable: false },
        { text: "Valeur", value: "valeur", sortable: false  },
        { text: "Statut", value: "statut", sortable: false },
        { text: "Action", value: "action", sortable: false },
      ],
    };
  },
  computed: {

    loggedIn() {
      return this.$store.state.user.isLoggedIn;
    },
    getUserSiren() {
      return this.$store.state.user.name;
    }
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    getAll() {
      return axios.get(process.env.VUE_APP_ROOT_API +"/ip")
    },

    get(id) {
      return axios.get(process.env.VUE_APP_ROOT_API +`/ip/${id}`);
    },

    create(data) {
      return axios.post(process.env.VUE_APP_ROOT_API +"/ip", data);
    },

    update(id, data) {
      return axios.put(process.env.VUE_APP_ROOT_API +`/ip/${id}`, data);
    },

    delete(id) {
      return axios.delete(process.env.VUE_APP_ROOT_API +`/ip/${id}`);
    },

    deleteAll() {
      return axios.delete(process.env.VUE_APP_ROOT_API +`/ip`);
    },

    findByValeur(valeur) {
      return axios.get(process.env.VUE_APP_ROOT_API +`/ip?valeur=${valeur}`);
    },

    collecterAcces() {
      this.getAll()
          .then((response) => {
            this.acces = response.data.map(this.affichageAcces);
            console.log(response.data);
          })
          .catch((e) => {
            console.log(e);
          });
    },

    refreshList() {
      this.collecterAcces();
    },

    suppTousAcces() {
      this.deleteAll()
          .then((response) => {
            console.log(response.data);
            this.refreshList();
          })
          .catch((e) => {
            console.log(e);
          });
    },

    rechercheParValeur() {
      this.findByValeur(this.valeur)
          .then((response) => {
            this.acces = response.data.map(this.affichageAcces);
            console.log(response.data);
          })
          .catch((e) => {
            console.log(e);
          });
    },

    modifierAcces(id) {
      this.$router.push({ name: "acces-details", params: { id: id } });
    },

    analyserAcces(id) {
      this.$router.push({ name: "acces-analyse", params: { id: id } });
    },

    supprimerAcces(id) {
      this.delete(id)
          .then(() => {
            this.refreshList();
          })
          .catch((e) => {
            console.log(e);
          });
    },

    affichageAcces(acces) {
      return {
        id: acces.id,
        dateCreation: acces.dateCreation,
        dateModification: acces.dateModification,
        typeAcces: acces.typeAcces,
        typeIp: acces.typeIp,
        valeur: acces.valeur,
        statut: acces.statut ? "Published" : "Pending",

      };
    },
  },
  mounted() {
    this.collecterAcces();
  },
});
</script>

<style>
.list {
  max-width: 750px;
}
</style>

