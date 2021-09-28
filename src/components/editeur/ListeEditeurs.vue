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
                    <v-col cols="12" sm="2"> </v-col>
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
<style src="./style.css"></style>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { serviceLn } from "../../service/licencesnationales/LicencesNationalesApiService";
import moment from "moment";
import { Logger } from "@/utils/Logger";
import { Editeur } from "@/components/CommonDefinition";

@Component
export default class ListeEditeurs extends Vue {
  rechercher: string = "";
  editeur: Array<string> = [];
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
    return this.$store.getters.notification;
  }
  get getUserSiren() {
    return this.$store.getters.userSiren;
  }
  get getEditeurs(): Array<string> {
    return this.editeur;
  }

  mounted() {
    moment.locale("fr");
    this.collecterEditeurs();
    this.id = this.getIdEditeur(this.editeur);
  }

  getIdEditeur(editeur): string {
    return editeur.id;
  }
  getAll(): any {
    return serviceLn.getEditeurs(this.$store.getters.token);
  }
  collecterEditeurs(): void {
    this.getAll()
      .then(response => {
        this.editeur = response.data.map(this.affichageEditeurs);
        Logger.debug(response.data);
      })
      .catch(e => {
        Logger.error(e);
      });
  }
  affichageEditeurs(editeur): Editeur {
    return {
      id: editeur.idEditeur,
      dateCreation: moment(editeur.dateCreation).format("L"),
      nomEditeur: editeur.nomEditeur
    };
  }
  listeAcces(siren): void {
    this.$store.dispatch("setSirenEtabSiAdmin", siren).catch(err => {
      Logger.error(err);
    });
    this.$router.push({
      name: "ListeAcces"
    });
  }
  supprimerEditeur(id): void {
    serviceLn
      .deleteEditeur(this.$store.getters.token, { id: id })
      .then(response => {
        this.refreshList();
        Logger.debug("notification = " + response.data);
        this.$store.dispatch("setNotification", response.data).catch(err => {
          Logger.error(err);
        });
      })
      .catch(err => {
        this.error = err.response.data;
        this.alert = true;
      });
  }
  refreshList(): void {
    this.collecterEditeurs();
  }

  modifierEditeur(id): void {
    this.$router.push({ name: "ModifierEditeur", params: { id: id } });
  }
}
</script>
