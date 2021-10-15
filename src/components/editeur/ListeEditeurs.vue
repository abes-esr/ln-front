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
                        :items="editeurs"
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
                        <template v-slot:item.dateCreation="{ item }">
                          <span>{{ item.dateCreation.toLocaleString() }}</span>
                        </template>
                        <template v-slot:[`item.action`]="{ item }">
                          <v-icon
                            small
                            class="mr-2"
                            @click="modifierEditeur(item)"
                            >mdi-pencil</v-icon
                          >
                          <v-icon small @click="$set(confirmDeleteDialog, item.id, true)"
                            >mdi-delete</v-icon
                          >
                          <v-dialog
                              v-model="confirmDeleteDialog[item.id]"
                              width="500"
                              :key="item.id"
                          >
                            <v-card>
                              <v-card-title class="text-h5">
                                Confirmation de suppression
                              </v-card-title>

                              <v-card-text>
                                Êtes-vous sûr de vouloir supprimer l'éditeur
                                {{ item.nom }} ?
                              </v-card-text>

                              <v-divider></v-divider>

                              <v-card-actions>
                                <v-btn
                                    color="primary"
                                    text
                                    @click="$set(confirmDeleteDialog, item.id, false)"
                                >
                                  Non
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" text @click="supprimerEditeur(item)">
                                  Oui
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="7"></v-col>
                    <v-col cols="12" sm="2"> </v-col>
                    <v-col cols="12" sm="3">
                      <v-btn @click="ajouterEditeur()" color="warning"
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
<style src="./style.css"></style>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import moment from "moment";
import { Logger } from "@/utils/Logger";
import Editeur from "@/core/Editeur";
import { Action } from "@/core/CommonDefinition";
import { LicencesNationalesUnauthorizedApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesUnauthorizedApiError";
import { editeurService } from "@/core/service/licencesnationales/EditeurService";

@Component
export default class ListeEditeurs extends Vue {
  rechercher: string = "";
  editeurs: Array<Editeur> = [];
  title: string = "";
  id: string = "";
  error: string = "";
  alert: boolean = false;
  headers: Array<any> = [
    {
      text: "Date de création",
      align: "start",
      value: "dateCreation",
      sortable: true
    },
    { text: "Editeur", value: "nom", sortable: true },
    { text: "Action", value: "action", sortable: false }
  ];
  confirmDeleteDialog: any = {};

  get notification() {
    return this.$store.getters.notification();
  }

  mounted() {
    moment.locale("fr");
    this.fetchEditeurs();
    this.id = this.getIdEditeur(this.editeurs);
  }

  getIdEditeur(editeur): string {
    return editeur.id;
  }

  fetchEditeurs(): void {
    this.alert = false;

    editeurService
      .getEditeurs(this.$store.getters.getToken())
      .then(res => {
        this.editeurs = res;
      })
      .catch(err => {
        this.alert = true;
        Logger.error(err.toString());
        if (err instanceof LicencesNationalesUnauthorizedApiError) {
          this.error = "Vous n'êtes pas autorisé à effectuer cette opération";
        } else {
          this.error = "Impossible de charger les éditeurs : " + err.message;
        }
      });
  }

  ajouterEditeur(): void {
    this.alert = false;
    this.$store
      .dispatch("setCurrentEditeur", new Editeur())
      .then(() => {
        this.$router.push({ name: "NouvelEditeur" });
      })
      .catch(err => {
        Logger.error(err);
        this.error = "Impossible de créer un nouvel éditeur : " + err.message;
        this.alert = true;
      });
  }

  modifierEditeur(item: Editeur): void {
    this.alert = false;
    this.$store
      .dispatch("setCurrentEditeur", item)
      .then(() => {
        this.$router.push({ name: "ModifierEditeur" });
      })
      .catch(err => {
        Logger.error(err);
        this.error = "Impossible de modifier cet éditeur : " + err.message;
        this.alert = true;
      });
  }

  supprimerEditeur(item: Editeur): void {
    this.alert = false;
    this.$set(this.confirmDeleteDialog, item.id, false);

    editeurService
      .deleteEditeur(item.id, this.$store.getters.getToken())
      .then(response => {
        this.fetchEditeurs();
      })
      .catch(err => {
        Logger.error(err);
        this.error = "Impossible de supprimer cet éditeur : " + err.message;
        this.alert = true;
      });
  }
}
</script>
