<template>
  <div>
    <v-card width="100%">
      <v-card-text>
        <v-row>
          <v-col lg="12" md="12" xs="12">
            <v-row>
              <v-col cols="12" sm="12">
                <v-card class="mx-auto" tile>
                  <v-card-title>Liste des Accès</v-card-title>
                  <v-row>
                    <v-col cols="1" />
                    <v-col cols="10">
                      <v-data-table
                        dense
                        :headers="headers"
                        :items="acces"
                        class="elevation-1"
                        :search="rechercher"
                      >
                        <template v-slot:top>
                          <v-text-field
                              v-model="rechercher"
                              label="Chercher sur toutes les colonnes"
                              class="mx-4"
                          ></v-text-field>
                        </template>
                        <template v-slot:[`item.action`]="{ item }">
                          <v-icon small class="mr-2" @click="modifierAcces(item.id)"
                            >mdi-pencil</v-icon
                          >
                          <!--                      <v-icon small class="mr-2" @click="analyserAcces(item.id)"
                            >mdi-help-circle-outline</v-icon
                          >-->
                          <v-icon small @click="supprimerAcces(item.id)"
                            >mdi-delete</v-icon
                          >
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="1" />
                    <v-col cols="10">
                      <a @click="$router.push({ path: '/ajouterAcces' })"
                      ><br />Ajouter une adresse IP</a
                      >
                      <a @click="$router.push({ path: '/ajoutPlageAcces' })"
                      ><br />Ajouter une plage d'adresses IP</a
                      >
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <br />
    <v-alert dense outlined :value="alert" type="error">
      {{ error }}
    </v-alert>
    <v-alert dense outlined :value="notification!==''" type="success">
      {{ notification }}
    </v-alert>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { HTTP } from "../utils/http-commons";
import {mapActions, mapGetters} from "vuex";

export default Vue.extend({
  name: "ListeAcces",
  data() {
    return {
      rechercher: '',
      acces: [],
      title: "",
      id: "" as any,
      headers: [
        {
          text: "Date de création",
          align: "start",
          value: "dateCreation",
          sortable: false
        },
        {
          text: "Date de modification",
          value: "dateModification",
          sortable: false
        },
        { text: "Type d'accès", value: "typeAcces", sortable: false },
        { text: "Type d'IP", value: "typeIp", sortable: false },
        { text: "Valeur", value: "valeur", sortable: false },
        { text: "Statut", value: "statut", sortable: false },
        { text: "Action", value: "action", sortable: false }
      ]
    };
  },
  computed: {
    ...mapGetters(["notification"]),

    getUserSiren() {
      return this.$store.state.user.siren;
    }
  },
  mounted() {
    this.collecterAcces();
    this.id = this.getIdAcces(this.acces);
  },

  methods: {
    ...mapActions({
      setNotification: "setNotification"
    }),

    getAll() {
      return HTTP.get("/ln/ip/" + this.getUserSiren);
    },
    /*get(id) {
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
    },*/
    collecterAcces() {
      this.getAll()
        .then(response => {
          this.acces = response.data.map(this.affichageAcces);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    modifierAcces(id) {
      this.$router.push({ name: "ModifierAcces", params: { id: id } });
    },
    /* refreshList() {
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
    },*/
    affichageAcces(acces) {
      return {
        id: acces.id,
        dateCreation: acces.dateCreation,
        dateModification: acces.dateModification,
        typeAcces: acces.typeAcces,
        typeIp: acces.typeIp,
        valeur: acces.ip,
        statut: acces.validee ? "Validée" : "En validation"
      };
    },
    getIdAcces(acces) {
      return {
        id: acces.id
      };
    }
  },
  destroyed() {
    this.setNotification("");
  }

});
</script>
<style>
.list {
  max-width: 750px;
}
</style>
