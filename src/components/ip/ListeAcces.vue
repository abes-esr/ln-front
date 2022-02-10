<template>
  <div>
    <v-card flat>
      <v-row>
        <v-col lg="12" md="12" xs="12">
          <v-row>
            <v-col cols="12" sm="12">
              <v-row>
                <h1>Liste des IP déclarées</h1>
              </v-row>
              <v-row>
                <v-col cols="12" sm="8"></v-col>
                <v-col cols="12" sm="2">
                  <v-btn @click="$router.push({ path: '/ajouterAcces/' })"
                    ><span class="btnText"
                      >Ajouter une adresse ou une plage IP</span
                    >
                    <font-awesome-icon :icon="['fas', 'plus-circle']"/></v-btn
                ></v-col>
              </v-row>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-alert dense :value="alert" type="error">
                    {{ error }}
                  </v-alert>
                  <v-alert dense :value="notification !== ''" type="success">
                    {{ notification }}
                  </v-alert>
                  <v-card-text>
                    <v-data-table
                      id="mytable"
                      :headers="headers"
                      :items="filteredAccesByStatut"
                      :items-per-page="30"
                      :search="rechercher"
                      flat
                    >
                      <template v-slot:[header.statut="{ header }">
                        {{ header.texte }}
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
                              label="Chercher dans les colonnes"
                              class="mx-4"
                              prepend-inner-icon="mdi-magnify"
                              outlined
                              clearable
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </template>

                      <template v-slot:[`item.action`]="{ item }">
                        <v-icon
                          small
                          class="mr-2"
                          v-if="isAdmin === 'true'"
                          @click="analyserAcces(item.id)"
                          >mdi-help-circle-outline</v-icon
                        >
                        <v-btn
                          class="ma-0 pa-0 bouton-simple "
                          icon
                          title="Supprimer"
                          @click="supprimerAcces(item.id)"
                        >
                          <font-awesome-icon :icon="['fas', 'trash-alt']"
                        /></v-btn>
                      </template> </v-data-table
                  ></v-card-text>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <br />
  </div>
</template>
<style src="./style.css"></style>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import moment from "moment";
import { Logger } from "@/utils/Logger";
import { iPService } from "@/core/service/licencesnationales/IPService";

const ListeAccesProps = Vue.extend({
  props: {
    sirenEtabSiAdmin: {
      type: String,
      default: ""
    }
  }
});

@Component
export default class ListeAcces extends ListeAccesProps {
  statut: string = "";
  selectStatut: Array<string> = ["En validation", "Validée", ""];
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

  get getUserSiren() {
    return this.$store.state.user.siren;
  }

  get isAdmin() {
    return this.$store.getters.isAdmin();
  }

  get filteredAccesByStatut(): string[] {
    const conditions = [] as any;
    if (this.statut) {
      conditions.push(this.filterStatut);
    }
    if (conditions.length > 0) {
      return this.acces.filter(acces => {
        return conditions.every(condition => {
          return condition(acces);
        });
      });
    }
    return this.acces;
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
    if (this.isAdmin)
      return iPService.getListIPEtab(
        this.$store.getters.getToken(),
        this.$store.getters.getCurrentEtablissement().siren
      );
    else
      return iPService.getListIP(
        this.$store.getters.getToken(),
        this.getUserSiren
      );
  }

  collecterAcces(): void {
    this.getAll()
      .then(response => {
        this.acces = response.data.map(this.affichageAcces);
      })
      .catch(err => {
        Logger.error(err);
        this.error = err.response.data.message;
        this.alert = true;
      });
  }

  affichageAcces(acces) {
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
    iPService
      .deleteIP(this.$store.getters.getToken(), id)
      .then(response => {
        this.refreshList();
        this.$store.dispatch("setNotification", response.data).catch(err => {
          Logger.error(err);
        });
      })
      .catch(err => {
        this.error = err.response.data.message;
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

<style scoped>
.row {
  margin: 0 !important;
}
.btnText {
  padding-right: 5px;
}
</style>
