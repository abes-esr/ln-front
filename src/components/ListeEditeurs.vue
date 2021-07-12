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
                        :items="filteredEditeurByStatut"
                        :items-per-page="10"
                        class="elevation-1"
                        :search="rechercher"
                        id="mytable"
                      >
                        <template v-slot:header.statut="{ header }">
                          {{ header.text }}
                          <v-menu offset-y :close-on-content-click="false">
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn icon v-bind="attrs" v-on="on">
                                <v-icon small :color="statut ? 'primary' : ''">
                                  mdi-filter
                                </v-icon>
                              </v-btn>
                            </template>
                            <div style="background-color: white; width: 280px">
                              <v-text-field
                                v-model="statut"
                                class="pa-4"
                                type="text"
                                label="Entrez le statut"
                              ></v-text-field>
                              <v-btn
                                @click="statut = ''"
                                small
                                text
                                color="primary"
                                class="ml-2 mb-2"
                                >Effacer</v-btn
                              >
                            </div>
                          </v-menu>
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
                          <v-icon
                            small
                            @click.stop="openDialogSuppression(item.id)"
                            >mdi-delete</v-icon
                          >
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="7"></v-col>
                    <v-col cols="12" sm="2">
                      <!--                      <v-btn
                        @click="$router.push({ path: '/ajouterEtab' })"
                        color="warning"
                        ><br />Ajouter un établissement</v-btn
                      >-->
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

    &lt;!&ndash; Popup de suppression &ndash;&gt;
    <div class="text-center">
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2">
            Supprimer un éditeur
          </v-card-title>

          <v-card-text>
            Vous êtes sur le point de supprimer l'éditeur :
            {{ currentIdToDelete }}. Êtes vous sûr ? Veuillez indiquer le motif
            de la suppression :
            <v-textarea
              outlined
              label="Motif suppression"
              v-model="motifSuppression"
            ></v-textarea>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">
              Annuler
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="
                dialog = false;
                supprimerEditeur();
              "
            >
              Valider
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { HTTP } from "../utils/http-commons";
import { mapActions } from "vuex";
import moment from "moment";

export default Vue.extend({
  name: "ListeEditeurs",
  data() {
    return {
      statut: "",
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
        { text: "Statut", value: "statut", sortable: true },
        { text: "Action", value: "action", sortable: false }
      ],
      dialog: false,
      currentIdToDelete: "",
      motifSuppression: ""
    };
  },
  computed: {
    notification() {
      return this.$store.state.notification;
    },
    getUserSiren() {
      return this.$store.state.user.siren;
    },
    filteredEditeurByStatut(): string {
      const conditions = [] as any;
      if (this.statut) {
        conditions.push(this.filterStatut);
      }
      if (conditions.length > 0) {
        return this.editeur.filter(editeur => {
          return conditions.every(condition => {
            return condition(editeur);
          });
        });
      }
      return this.editeur;
    }
  },
  mounted() {
    moment.locale("fr");
    this.collecterEditeurs();
    this.id = this.getIdEditeur(this.editeur);
  },

  methods: {
    ...mapActions({
      setNotification: "setNotification",
      setSirenEtabSiAdmin: "setSirenEtabSiAdmin"
    }),
    getIdEditeur(editeur) {
      return {
        id: editeur.id
      };
    },
    filterStatut(statutRecherche) {
      return (
        statutRecherche.statut
          .toString()
          .substring(0, 1)
          .toLowerCase()
          .includes(this.statut) ||
        statutRecherche.statut
          .toString()
          .substring(0, 1)
          .toUpperCase()
          .includes(this.statut)
      );
    },
    getAll(): any {
      return HTTP.get("/ln/editeur/getListEditeurs");
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
        id: editeur.id,
        dateCreation: moment(editeur.dateCreation).format("L"),
        nomEditeur: editeur.nomEditeur,
        statut: editeur.valide ? "Validé" : "En validation"
      };
    },
    listeAcces(siren): void {
      this.setSirenEtabSiAdmin(siren);
      this.$router.push({
        name: "ListeAcces"
      });
    },
    openDialogSuppression(id): void {
      this.dialog = true;
      this.currentIdToDelete = id;
    },
    supprimerEditeur(): void {
      HTTP.post("/ln/editeur/suppression/" + this.currentIdToDelete, {
        motif: this.motifSuppression
      })
        .then(response => {
          this.refreshList();
          console.log("notification = " + response.data);
          this.setNotification(response.data);
        })
        .catch(err => {
          this.error = err.response.data;
          this.alert = true;
        });
      this.currentIdToDelete = "";
      this.motifSuppression = "";
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
