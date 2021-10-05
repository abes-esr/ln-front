<template>
  <div>
    <v-card width="100%">
      <v-card-text>
        <v-row>
          <v-col lg="12" md="12" xs="12">
            <v-row>
              <v-col cols="12" sm="12">
                <v-card class="mx-auto" tile>
                  <v-card-title>Liste des Etablissements</v-card-title>
                  <v-row>
                    <v-col cols="1" />
                    <v-col cols="10">
                      <v-data-table
                        dense
                        :headers="headers"
                        :items="filteredEtabByStatut"
                        :items-per-page="30"
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
                              <v-card-actions
                                ><v-select
                                  v-model="statut"
                                  label="Selectionnez le statut"
                                  outlined
                                  :items="selectStatut"
                                ></v-select
                              ></v-card-actions>
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
                            @click="modifierEtab(item.siren)"
                            >mdi-pencil</v-icon
                          >
                          <v-icon
                            small
                            class="mr-2"
                            @click="listeAcces(item.siren)"
                            >mdi-ip-network</v-icon
                          >
                          <v-icon
                            small
                            @click.stop="openDialogSuppression(item.siren)"
                            >mdi-delete</v-icon
                          >
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="7"></v-col>
                    <v-col cols="12" sm="2">
                      <v-btn
                        @click="$router.push({ path: '/ajouterEtab' })"
                        color="warning"
                        ><br />Ajouter un établissement</v-btn
                      >
                    </v-col>
                    <v-col cols="12" sm="3">
                      <v-btn
                        @click="$router.push({ path: '/ajoutEditeur' })"
                        color="warning"
                        ><br />Ajouter un éditeur</v-btn
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

    <!-- Popup de suppression -->
    <div class="text-center">
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2">
            Supprimer un établissement
          </v-card-title>

          <v-card-text>
            Vous êtes sur le point de supprimer l'établissement :
            {{ currentSirenToDelete }}. Êtes vous sûr ? Veuillez indiquer le
            motif de la suppresion :
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
                supprimerEtab();
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
<style src="./style.css"></style>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import moment from "moment";
import { serviceLn } from "../../service/licencesnationales/LicencesNationalesApiService";
import { Logger } from "@/utils/Logger";

@Component
export default class ListeEtab extends Vue {
  statut: string = "";
  selectStatut: Array<string> = [
    "Nouveau",
    "En validation",
    "Validé",
    "Aucune IP"
  ];
  rechercher: string = "";
  etab: Array<string> = [];
  title: string = "";
  id: string = "";
  error: string = "";
  alert: boolean = false;
  derniereDateModificationIpTemp: string = "";
  headers = [
    {
      text: "Date de création",
      align: "start",
      value: "dateCreation",
      sortable: true
    },
    { text: "ID Abes", value: "idAbes", sortable: true },
    { text: "SIREN", value: "siren", sortable: true },
    { text: "Etablissement", value: "nom", sortable: true },
    {
      text: "Type d'établissement",
      value: "typeEtablissement",
      sortable: true
    },
    {
      text: "Dernière date de modification",
      value: "derniereDateModificationIp",
      sortable: true
    },
    { text: "Statut", value: "statut", sortable: true },
    { text: "Action", value: "action", sortable: false }
  ];

  dialog: boolean = false;
  currentSirenToDelete: string = "";
  motifSuppression: string = "";

  get notification() {
    return this.$store.getters.notification;
  }
  get getUserSiren() {
    return this.$store.getters.userSiren;
  }

  get filteredEtabByStatut(): string[] {
    Logger.debug("debut filteredEtabByStatut");
    const conditions = [] as any;
    Logger.debug("this.statut = " + this.statut);
    if (this.statut) {
      conditions.push(this.filterStatut);
    }
    if (conditions.length > 0) {
      return this.etab.filter(acces => {
        return conditions.every(condition => {
          return condition(acces);
        });
      });
    }
    return this.etab;
  }
  mounted() {
    moment.locale("fr");
    this.collecterEtab();
    this.id = this.getIdEtab(this.etab);
  }

  getIdEtab(etab) {
    return etab.id;
  }
  filterStatut(statutRecherche) {
    return statutRecherche.statut.toString().includes(this.statut);
  }
  getAll(): any {
    return serviceLn.listeEtab(this.$store.getters.token);
  }
  collecterEtab(): any {
    this.getAll()
      .then(response => {
        this.etab = response.data.map(this.affichageEtab);
        Logger.debug(response.data);
      })
      .catch(e => {
        Logger.error(e);
      });
  }

  affichageEtab(etab) {
    if (moment(etab.derniereDateModificationIp).format("L") !== "Invalid date")
      this.derniereDateModificationIpTemp = moment(
        etab.derniereDateModificationIp
      ).format("L");
    else this.derniereDateModificationIpTemp = "";
    return {
      id: etab.id,
      dateCreation: moment(etab.dateCreation).format("L"),
      idAbes: etab.idAbes,
      siren: etab.siren,
      nom: etab.nom,
      derniereDateModificationIp: this.derniereDateModificationIpTemp,
      typeEtablissement: etab.typeEtablissement,
      statut: etab.valide ? "Validé" : "En validation"
    };
  }

  listeAcces(siren?): void {
    this.$router.push({
      name: "ListeAcces",
      params: { sirenEtabSiAdmin: siren }
    });
  }
  openDialogSuppression(siren): void {
    this.dialog = true;
    this.currentSirenToDelete = siren;
    //(this as any).supprimerEtab(siren);
  }
  supprimerEtab(): void {
    serviceLn
      .deleteEtab(this.$store.getters.token, this.currentSirenToDelete, {
        motif: this.motifSuppression
      })
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
    this.currentSirenToDelete = "";
    this.motifSuppression = "";
  }
  refreshList(): void {
    this.collecterEtab();
  }

  modifierEtab(sirenParam): void {
    this.$router.push({
      name: "modifierEtabAdmin",
      params: { sirenParam: sirenParam }
    });
  }
}
</script>
