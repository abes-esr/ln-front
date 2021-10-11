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
                        <template v-slot:[`item.action`]="{ item }">
                          <v-icon
                            small
                            class="mr-2"
                            @click="modifierEditeur(item)"
                            >mdi-pencil</v-icon
                          >
                          <v-icon small @click="supprimerEditeur(item)"
                            >mdi-delete</v-icon
                          >
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
import { serviceLn } from "../../service/licencesnationales/LicencesNationalesApiService";
import moment from "moment";
import { Logger } from "@/utils/Logger";
import Editeur from "@/components/Editeur";
import { Action } from "@/components/CommonDefinition";
import {
  JsonEditeurResponse,
  JsonListeEditeurResponse,
  JsonSimpleEditeurResponse
} from "@/service/licencesnationales/LicencesNationalesJsonDefinition";
import { LicencesNationalesUnauthorizedApiError } from "@/service/licencesnationales/exception/LicencesNationalesUnauthorizedApiError";

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
    { text: "Editeur", value: "nomEditeur", sortable: true },
    { text: "Action", value: "action", sortable: false }
  ];

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

    serviceLn
      .getEditeurs(this.$store.getters.getToken())
      .then(res => {
        const response: Array<JsonSimpleEditeurResponse> = (res as unknown) as Array<
          JsonSimpleEditeurResponse
        >;
        response.forEach(element => {
          const editeur = new Editeur();
          editeur.id = element.id;
          editeur.nom = element.nom;
          editeur.dateCreation = new Date(element.dateCreation);
          this.editeurs.push(editeur);
        });
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

    serviceLn
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
