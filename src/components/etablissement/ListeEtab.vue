<template>
  <v-card flat :disabled="disableForm">
    <h1>Gestion des comptes établissements</h1>
    <MessageBox></MessageBox>
    <v-card-title>
      <v-row class="d-flex flex-row-reverse">
        <v-btn @click="allerAScionnerEtab()" class="btn-1 mx-2"
          >Scission
          <font-awesome-icon :icon="['fas', 'object-ungroup']" class="mx-2"
        /></v-btn>
        <v-btn @click="allerAFusionnerEtab" class="btn-1 mx-2"
          >Fusion
          <font-awesome-icon :icon="['fas', 'object-group']" class="mx-2"
        /></v-btn>
        <v-btn @click="ajouterEtablissement()" class="btn-1 mx-2"
          >Créer un établissement
          <font-awesome-icon :icon="['fas', 'plus']" class="mx-2"
        /></v-btn>
      </v-row>
    </v-card-title>
    <v-card-text class="mt-3">
      <v-data-table
        dense
        :headers="headers"
        :items="filteredEtabByStatut"
        :items-per-page="25"
        :footer-props="{ 'items-per-page-options': [25, 50, 100, -1] }"
        class="elevation-0 ma-3"
        :search="rechercher"
        :loading="dataLoading"
        id="mytable"
      >
        <template v-slot:top>
          <div class="d-flex align-content-end justify-end">
            <v-text-field
              v-model="rechercher"
              label="Chercher sur toutes les colonnes"
              class="mx-4 search-bar"
              prepend-inner-icon="mdi-magnify"
              outlined
              dense
              clearable
            ></v-text-field>
          </div>
          <v-tooltip top max-width="20vw" open-delay="100">
            <template v-slot:activator="{ on }">
              <v-btn
                text
                @click="downloadEtablissements()"
                class="mx-2 text-lowercase bouton-simple"
                v-on="on"
                :loading="isExportLoading"
                ><span class="text-uppercase">T</span>élécharger la liste des
                Etabs
                <font-awesome-icon :icon="['fas', 'download']" class="mx-2"
              /></v-btn>
            </template>
            <span>Le téléchargement correspond à la vue filtrée</span>
          </v-tooltip>
        </template>
        <template v-slot:header.typeEtablissement="{ header }">
          {{ header.texte }}
          <v-menu offset-y :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-btn text class="bouton-simple" v-bind="attrs" v-on="on">
                Type d'établissement
                <v-icon small :color="statut ? 'primary' : ''">
                  mdi-filter
                </v-icon>
              </v-btn>
            </template>
            <div style="background-color: white; width: 500px">
              <ul>
                <li
                  v-for="item in typesEtab"
                  :key="item.id"
                  @click="eventTypeEtabChoice(item)"
                >
                  <a>{{ item }}</a>
                </li>
              </ul>
            </div>
          </v-menu>
        </template>
        <template v-slot:header.statut="{ header }">
          {{ header.texte }}
          <v-menu offset-y :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-btn text class="bouton-simple" v-bind="attrs" v-on="on">
                Statut
                <v-icon small :color="statut ? 'primary' : ''">
                  mdi-filter
                </v-icon>
              </v-btn>
            </template>
            <div style="background-color: white; width: 280px">
              <ul>
                <li
                  v-for="item in selectStatut"
                  :key="item.id"
                  @click="eventStatutChoice(item)"
                >
                  <a>{{ item }}</a>
                </li>
              </ul>
            </div>
          </v-menu>
        </template>
        <template v-slot:item.dateCreationFormattedInString="{ item }">
          <span>{{ item.dateCreation.toLocaleDateString() }}</span>
        </template>

        <template v-slot:item.nom="{ item }">
          <a class="bouton-simple" @click="allerAAfficherEtab(item)"
            ><strong>{{ item.nom }}</strong></a
          >
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-icon large class="mr-2" @click="allerAIPs(item)"
            >mdi-ip-network</v-icon
          >
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Logger } from "@/utils/Logger";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import Etablissement from "@/core/Etablissement";
import { Message, MessageType } from "@/core/CommonDefinition";
import { LicencesNationalesBadRequestApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import { LicencesNationalesUnauthorizedApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesUnauthorizedApiError";
import MessageBox from "@/components/common/MessageBox.vue";
import { LicencesNationalesApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesApiError";
import moment from "moment";

@Component({
  components: { MessageBox }
})
export default class ListeEtab extends Vue {
  isAdmin: boolean = this.$store.getters.isAdmin();
  disableForm: boolean = false;
  statut: string = "";
  dataLoading: boolean = true;
  selectStatut: Array<string> = [
    "Tous",
    "Nouveau",
    "En validation",
    "Validé",
    "Aucune IP"
  ];
  rechercher: string = "";
  etabs: Array<Etablissement> = [];
  etabsFiltered: Array<Etablissement> = [];
  selectedType: string = "";
  typesEtab: Array<string> = [];
  isDisableForm: boolean = false;
  isExportLoading: boolean = false;
  title: string = "";
  id: string = "";
  headers = [
    {
      text: "Date de création",
      align: "start",
      value: "dateCreationFormattedInString",
      sortable: true
    },
    { text: "Identifiant Abes", value: "idAbes", sortable: true },
    { text: "SIREN", value: "siren", sortable: true },
    { text: "Nom de l'établissement", value: "nom", sortable: true },
    {
      text: "Type d'établissement",
      value: "typeEtablissement",
      sortable: true
    },
    {
      text: "Dernière date de modification des IPs",
      value: "dateModificationDerniereIp",
      sortable: true
    },
    { text: "Statut", value: "statut", sortable: true },
    { text: "Liste des IPs", value: "action", sortable: false }
  ];

  constructor() {
    super();
    if (!this.isAdmin) {
      const message: Message = new Message();
      message.type = MessageType.ERREUR;
      message.texte =
        "Vous n'êtes pas autorisé à exécuter l'action AfficherEtablissemnts";
      message.isSticky = true;
      this.$store.dispatch("openDisplayedMessage", message).catch(err => {
        Logger.error(err.toString());
      });
      this.$router.push({ name: "Home" }).catch(err => {
        Logger.error(err);
      });
    }

    this.collecterEtab();
    this.fetchListeType();
  }

  get filteredEtabByStatut(): Array<Etablissement> {
    const conditions = [] as any;
    if (this.statut) {
      conditions.push(this.statut);
    }
    if (this.selectedType) {
      conditions.push(this.selectedType);
    }

    if (conditions.length > 0) {
      this.etabsFiltered = this.etabs.filter(acces => {
        return conditions.every(condition => {
          return (
            acces.typeEtablissement == condition || acces.statut == condition
          );
        });
      });
      return this.etabsFiltered;
    }
    //Formatage des dates pour le tri du tableau
    this.etabs.forEach(element => {
      element.dateCreationFormattedInString = moment(
        element.dateCreation
      ).format("YYYY-MM-DD");
      if (element.dateModificationDerniereIp) {
        element.dateModificationDerniereIp = element.dateModificationDerniereIp.replace(
          /-/g,
          "/"
        );
      }
    });
    this.etabsFiltered = this.etabs;
    return this.etabs;
  }

  get listEtab(): Array<string> {
    return this.typesEtab;
  }

  async fetchListeType() {
    this.$store.dispatch("closeDisplayedMessage");
    await etablissementService
      .listeType()
      .then(result => {
        this.isDisableForm = false;
        this.typesEtab = result;
        this.typesEtab.push("Tous");

        this.typesEtab.sort((n1, n2) => {
          if (n1 > n2) {
            return 1;
          }
          if (n1 < n2) {
            return -1;
          }
          return 0;
        });

        this.typesEtab.unshift(
          this.typesEtab.splice(
            this.typesEtab.findIndex(item => item === "Tous"),
            1
          )[0]
        );
      })
      .catch(err => {
        Logger.error(err.toString());
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        if (err instanceof LicencesNationalesApiError) {
          this.isDisableForm = true;
          message.texte =
            "Fonctionnalité momentanement indisponible pour le moment. Réessayer plus tard";
        } else {
          message.texte = "Impossible d'exécuter l'action : " + err.message;
        }
        message.isSticky = true;
        this.$store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err.toString());
        });
      });
  }

  eventTypeEtabChoice(element: string): void {
    if (element === "Tous") {
      this.selectedType = "";
    } else {
      this.selectedType = element;
    }
    this.filteredEtabByStatut;
  }

  eventStatutChoice(element: string): void {
    if (element === "Tous") {
      this.statut = "";
    } else {
      this.statut = element;
    }
    this.filteredEtabByStatut;
  }

  ajouterEtablissement(): void {
    this.$store.dispatch("closeDisplayedMessage");
    this.$store
      .dispatch("setCurrentEtablissement", new Etablissement())
      .then(() => {
        this.$router.push({ name: "CreationEtablissement" }).catch(err => {
          Logger.error(err);
        });
      })
      .catch(err => {
        Logger.error(err.toString());
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        if (err instanceof LicencesNationalesBadRequestApiError) {
          message.texte = err.message;
        } else {
          message.texte = "Impossible d'exécuter l'action : " + err.message;
        }
        message.isSticky = true;

        this.$store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err.toString());
        });
        // On glisse sur le message d'erreur
        const messageBox = document.getElementById("messageBox");
        if (messageBox) {
          window.scrollTo(0, messageBox.offsetTop);
        }
      });
  }

  allerAFusionnerEtab(): void {
    this.$store.dispatch("closeDisplayedMessage");
    this.$router.push({ name: "fusionEtablissement" }).catch(err => {
      Logger.error(err);
    });
  }

  allerAScionnerEtab(): void {
    this.$store.dispatch("closeDisplayedMessage");
    this.$router.push({ name: "scissionEtablissement" }).catch(err => {
      Logger.error(err);
    });
  }

  filterStatut(statutRecherche) {
    return statutRecherche.statut.toString().includes(this.statut);
  }

  collecterEtab(): void {
    this.$store.dispatch("closeDisplayedMessage");
    etablissementService
      .getEtablissements(this.$store.getters.getToken())
      .then(response => {
        this.etabs = response;
      })
      .catch(err => {
        Logger.error(err.toString());
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        if (err instanceof LicencesNationalesBadRequestApiError) {
          message.texte = err.message;
        } else if (err instanceof LicencesNationalesUnauthorizedApiError) {
          this.disableForm = true;
          message.texte =
            "Vous n'êtes pas autorisé à effectuer cette opération";
          setTimeout(() => {
            this.$router.push({ name: "Home" });
          });
        } else {
          message.texte = "Impossible d'exécuter l'action : " + err.message;
        }
        message.isSticky = true;
        this.$store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err.toString());
        });
      })
      .finally(() => {
        this.dataLoading = false;
      });
  }

  allerAIPs(item: Etablissement): void {
    this.$store.dispatch("closeDisplayedMessage");
    this.$store
      .dispatch("setCurrentEtablissement", item)
      .then(() => {
        this.$router.push({ name: "ListeIP" });
      })
      .catch(err => {
        Logger.error(err.toString());
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        if (err instanceof LicencesNationalesBadRequestApiError) {
          message.texte = err.message;
        } else {
          message.texte = "Impossible d'exécuter l'action : " + err.message;
        }
        message.isSticky = true;

        this.$store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err.toString());
        });
        // On glisse sur le message d'erreur
        const messageBox = document.getElementById("messageBox");
        if (messageBox) {
          window.scrollTo(0, messageBox.offsetTop);
        }
      });
  }

  downloadEtablissements(): void {
    this.isExportLoading = true;
    this.$store.dispatch("closeDisplayedMessage");
    const sirens = new Array<string>();
    this.etabsFiltered.forEach(element => {
      sirens.push(element.siren);
    });
    etablissementService
      .downloadEtablissements(sirens, this.$store.state.user.token)
      .then(response => {
        const fileURL = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/csv" })
        );
        const fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", "export.csv");
        document.body.appendChild(fileLink);

        fileLink.click();

        this.isExportLoading = false;
      })
      .catch(err => {
        Logger.error(err.toString());
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        if (err instanceof LicencesNationalesBadRequestApiError) {
          message.texte = err.message;
        } else {
          message.texte = "Impossible d'exécuter l'action : " + err.message;
        }
        message.isSticky = true;

        this.$store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err.toString());
        });

        this.isExportLoading = false;
      });
  }

  allerAAfficherEtab(item: Etablissement): void {
    this.$store.dispatch("closeDisplayedMessage");
    this.$store
      .dispatch("setCurrentEtablissement", item)
      .then(() => {
        this.$router.push({ name: "AfficherEtablissement" });
      })
      .catch(err => {
        Logger.error(err.toString());
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        if (err instanceof LicencesNationalesBadRequestApiError) {
          message.texte = err.message;
        } else {
          message.texte = "Impossible d'exécuter l'action : " + err.message;
        }
        message.isSticky = true;

        this.$store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err.toString());
        });
        // On glisse sur le message d'erreur
        const messageBox = document.getElementById("messageBox");
        if (messageBox) {
          window.scrollTo(0, messageBox.offsetTop);
        }
      });
  }
}
</script>
<style scoped lang="scss">
.search-bar {
  flex: 0 0 20%;
}
</style>
