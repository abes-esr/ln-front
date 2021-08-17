<template>
  <div>
    <v-card width="100%">
      <v-card-text>
        <v-row>
          <v-col lg="12" md="12" xs="12">
            <v-row>
              <v-col cols="12" sm="12">
                <v-card class="mx-auto" tile>
                  <v-card-title>Liste des Editeurs</v-card-title>
                  <v-row>
                    <v-col cols="1" />
                    <v-col cols="10">
                      <v-data-table
                        dense
                        :headers="headers"
                        :items="getEditeurs"
                        :items-per-page="10"
                        class="elevation-1"
                        :search="rechercher"
                        id="mytable"
                      >
                        <template v-slot:header.statut="{ header }">
                          {{ header.text }}
                        </template>
                        <template v-slot:top>
                          <v-row>
                            <v-col cols="12" sm="6"></v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="rechercher"
                                label="Chercher sur toutes les colonnes"
                                class="mx-4"
                                prepend-inner-icon="mdi-magnify"
                                outlined
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </template>
                        <template v-slot:[`item.action`]="{ item }">
                          <v-icon
                            small
                            class="mr-2"
                            @click="modifierEditeur(item.id)"
                            >mdi-pencil</v-icon
                          >
                          <v-icon small @click="supprimerEditeur(item.id)"
                            >mdi-delete</v-icon
                          >
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="7"></v-col>
                    <v-col cols="12" sm="2">
                    </v-col>
                    <v-col cols="12" sm="3">
                      <v-btn
                        @click="$router.push({ path: '/nouvelEditeur' })"
                        color="warning"
                        ><br />Nouvel éditeur</v-btn
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
    <v-alert dense outlined :value="notification !== ''" type="success">
      {{ notification }}
    </v-alert>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { AxiosApi } from "../utils/AxiosApi";
import { mapActions } from "vuex";
import moment from "moment";

export default Vue.extend({
  name: "ListeEditeurs",
  data() {
    return {
      rechercher: "",
      editeur: [] as any,
      title: "" as string,
      id: "" as any,
      error: "",
      alert: false,
      headers: [
        {
          text: "Date de création",
          align: "start",
          value: "dateCreation",
          sortable: true
        },
        { text: "Editeur", value: "nomEditeur", sortable: true },
        { text: "Action", value: "action", sortable: false }
      ]
    };
  },
  computed: {
    notification() {
      return this.$store.state.notification;
    },
    getUserSiren() {
      return this.$store.state.user.siren;
    },
    getEditeurs(): string {
      return this.editeur;
    }
  },
  mounted() {
    moment.locale("fr");
    this.collecterEditeurs();
    this.id = this.getIdEditeur(this.editeur);
    console.log(this.id);
  },

  methods: {
    ...mapActions({
      setNotification: "setNotification",
      setSirenEtabSiAdmin: "setSirenEtabSiAdmin"
    }),
    getIdEditeur(editeur) {
      console.log("editeur.id = " + editeur.idEditeur);
      return {
        id: editeur.idEditeur
      };
    },
    getAll(): any {
      return AxiosApi.getEditeurs();
    },
    collecterEditeurs(): any {
      this.getAll()
        .then(response => {
          this.editeur = response.data.map(this.affichageEditeurs);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    affichageEditeurs(editeur) {
      return {
        id: editeur.idEditeur,
        dateCreation: moment(editeur.dateCreation).format("L"),
        nomEditeur: editeur.nomEditeur
      };
    },

    supprimerEditeur(id): void {
      console.log("supprimerEditeur id = " + id);
      AxiosApi.deleteEditeur(id)
        .then(response => {
          this.refreshList();
          console.log("notification = " + response.data);
          this.setNotification(response.data);
        })
        .catch(err => {
          this.error = err.response.data;
          this.alert = true;
        });
    },
    refreshList(): void {
      this.collecterEditeurs();
    },
    modifierEditeur(id): void {
      this.$router.push({ name: "ModifierEditeur", params: { id: id } });
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
#mytable table thead {
  background: aquamarine;
}
</style>
