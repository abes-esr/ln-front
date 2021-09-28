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
                        id="mytable"
                        :headers="headers"
                        :items="filteredAccesByStatut"
                        :items-per-page="30"
                        class="elevation-1"
                        :search="rechercher"
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
                            @click="modifierAcces(item.id, item.typeAcces)"
                            >mdi-pencil</v-icon
                          >
                          <v-icon
                            small
                            class="mr-2"
                            v-if="isAdmin === 'true'"
                            @click="analyserAcces(item.id)"
                            >mdi-help-circle-outline</v-icon
                          >
                          <v-icon small @click="supprimerAcces(item.id)"
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
                        @click="$router.push({ path: '/ajouterAcces/ip' })"
                        color="warning"
                        >Ajouter une adresse IP</v-btn
                      ></v-col
                    >
                    <v-col cols="12" sm="3">
                      <v-btn
                        @click="$router.push({ path: '/ajouterAcces/plage' })"
                        color="warning"
                        >Ajouter une plage d'adresses IP</v-btn
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

@Component
export default class ListeAcces extends Vue {
  statut: string = "";
  selectStatut: Array<string> = ["En validation", "Validée"];
  rechercher: string = "";
  acces: Array<string> = [];
  title: string = "";
  id: string = "";
  error: string = "";
  alert: boolean = false;
  headers = [
    {
      text: "Date de création",
      align: "start",
      value: "dateCreation",
      sortable: true
    },
    {
      text: "Date de modification",
      value: "dateModification",
      sortable: true
    },
    {
      text: "Type d'accès",
      value: "typeAcces",
      sortable: true
    },
    {
      text: "Type d'IP",
      value: "typeIp",
      sortable: true
    },
    { text: "Valeur", value: "ip", sortable: true },
    { text: "Statut", value: "statut", sortable: true },
    { text: "Action", value: "action", sortable: false }
  ];

  get notification() {
    return this.$store.state.notification;
  }

  get sirenEtabSiAdmin() {
    return this.$store.state.sirenEtabSiAdmin;
  }

  get getUserSiren() {
    return this.$store.state.user.siren;
  }

  get isAdmin() {
    Logger.debug("isAdmin = " + this.$store.state.user.isAdmin);
    return this.$store.state.user.isAdmin;
  }

  // pour éviter l'erreur this.qch doesn not exist on ...
  // declarer le type returné par la fonction computed
  get filteredAccesByStatut(): string {
    const conditions = [] as any;
    if (this.statut) {
      conditions.push(this.filterStatut);
    }
    if (conditions.length > 0) {
      return this.acces.filter(acces => {
        return conditions.every(condition => {
          return condition(acces);
        });
      })[0];
    }
    return this.acces[0];
  }

  mounted() {
    moment.locale("fr");
    this.collecterAcces();
    this.id = this.getIdAcces(this.acces);
  }

  getIdAcces(acces): any {
    return {
      id: acces.id
    };
  }

  filterStatut(statutRecherche) {
    return statutRecherche.statut.toString().includes(this.statut);
  }

  getAll() {
    if (this.isAdmin === "true")
      return serviceLn.getListIPEtab(
        this.$store.getters.token,
        this.sirenEtabSiAdmin
      );
    else
      return serviceLn.getListIP(this.$store.getters.token, this.getUserSiren);
  }

  collecterAcces(): void {
    this.getAll()
      .then(response => {
        this.acces = response.data.map(this.affichageAcces);
        Logger.debug(response.data);
      })
      .catch(e => {
        Logger.error(e);
      });
  }

  affichageAcces(acces) {
    Logger.debug("debut affichage acces");
    return {
      id: acces.id,
      dateCreation: moment(acces.dateCreation).format("L"),
      dateModification: this.getDateModification(acces),
      typeAcces: acces.typeAcces,
      typeIp: acces.typeIp,
      ip: acces.ip,
      statut: acces.validee ? "Validée" : "En validation"
    };
  }

  getDateModification(acces) {
    if (acces.dateModification === null) return acces.dateModification;
    else return moment(acces.dateModification).format("L");
  }

  getUrlSuppressionIp() {
    if (this.isAdmin === "true") return "ln/ip/supprimeByAdmin";
    else return "ln/ip/supprime";
  }

  getSirenSuppressionIp() {
    if (this.isAdmin === "true") return this.sirenEtabSiAdmin;
    else return this.getUserSiren;
  }

  supprimerAcces(id): void {
    Logger.debug("id = " + id);
    serviceLn
      .deleteIP(this.$store.getters.token, this.getUrlSuppressionIp(), {
        id: id,
        siren: this.getSirenSuppressionIp()
      })
      .then(response => {
        this.refreshList();
        Logger.debug("notification = " + response.data);
        this.$store.dispatch("setNotification", response.data).catch(err => {
          Logger.error(err);
        });
        Logger.debug("notification = " + this.$store.state.notification);
      })
      .catch(err => {
        this.error = err.response.data;
        this.alert = true;
      });
  }

  refreshList(): void {
    this.collecterAcces();
  }

  modifierAcces(id, typeAcces) {
    this.$router.push({
      name: "ModifierAcces",
      params: { id: id, typeAcces: typeAcces }
    });
  }
}
</script>
