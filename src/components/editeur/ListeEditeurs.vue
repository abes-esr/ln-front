<template>
  <v-card flat :disabled="disableForm">
    <h1>Gestion des éditeurs</h1>
    <v-col cols="12" md="6" lg="6" xl="6">
      <MessageBox></MessageBox>
      <ConfirmPopup ref="confirm"></ConfirmPopup>
    </v-col>
    <v-card-title>
      <v-row class="d-flex flex-row-reverse">
        <v-btn @click="scissionEditeur()" class="btn-1 mx-2" :disabled="true"
          >Scission
          <font-awesome-icon :icon="['fas', 'object-ungroup']" class="mx-2"
        /></v-btn>
        <v-btn @click="fusionEditeur()" class="btn-1 mx-2" :disabled="true"
          >Fusion
          <font-awesome-icon :icon="['fas', 'object-group']" class="mx-2"
        /></v-btn>
        <v-btn @click="ajouterEditeur()" class="btn-1 mx-2"
          >Créer un éditeur
          <font-awesome-icon :icon="['fas', 'plus']" class="mx-2"
        /></v-btn>
      </v-row>
    </v-card-title>
    <v-card-text class="mt-3">
      <v-data-table
        dense
        :headers="headers"
        :items="editeurs"
        :items-per-page="25"
        :footer-props="{ 'items-per-page-options': [25, 50, 100, -1] }"
        class="elevation-0 ma-3"
        :search="rechercher"
        id="mytable"
      >
        <template v-slot:header.statut="{ header }">
          {{ header.texte }}
        </template>
        <template v-slot:top>
          <v-row class="d-flex flex-row-reverse mt-3">
            <v-text-field
              v-model="rechercher"
              label="Chercher dans tous les éditeurs"
              class="mx-4 search-bar"
              prepend-inner-icon="mdi-magnify"
              outlined
              dense
            ></v-text-field>
            <v-spacer></v-spacer>
          </v-row>
          <v-row class="d-flex mt-1 mb-3">

            <v-tooltip top max-width="20vw" open-delay="100">
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  @click="downloadEditeurs()"
                  class="mx-2 text-lowercase bouton-simple"
                  v-on="on"
                  ><span class="text-uppercase">T</span>élécharger tous les éditeurs
                  <font-awesome-icon :icon="['fas', 'download']" class="mx-2"
                /></v-btn>
              </template>
              <span>Le téléchargement correspond à la vue filtrée</span>
            </v-tooltip>
          </v-row>
        </template>
        <template v-slot:item.dateCreation="{ item }">
          <span>{{ item.dateCreation.toLocaleDateString() }}</span>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-btn
            class="ma-0 pa-0 bouton-simple"
            icon
            @click="modifierEditeur(item)"
          >
            <font-awesome-icon :icon="['fas', 'edit']" />
          </v-btn>
          <v-btn
            class="ma-0 pa-0 bouton-simple "
            icon
            @click="supprimerEditeur(item)"
          >
            <font-awesome-icon :icon="['fas', 'trash-alt']" />
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Logger } from "@/utils/Logger";
import Editeur from "@/core/Editeur";
import { LicencesNationalesUnauthorizedApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesUnauthorizedApiError";
import { editeurService } from "@/core/service/licencesnationales/EditeurService";
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import MessageBox from "@/components/common/MessageBox.vue";
import { Message, MessageType } from "@/core/CommonDefinition";
import { LicencesNationalesBadRequestApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";

@Component({
  components: { MessageBox, ConfirmPopup }
})
export default class ListeEditeurs extends Vue {
  disableForm: boolean = false;
  rechercher: string = "";
  editeurs: Array<Editeur> = [];
  headers: Array<any> = [
    {
      text: "Date de création du compte éditeur",
      align: "start",
      value: "dateCreation",
      sortable: true
    },
    { text: "Nom de l'éditeur", value: "nom", sortable: true },
    { text: "Action", value: "action", sortable: false }
  ];
  confirmDeleteDialog: any = {};
  isAdmin: boolean = this.$store.getters.isAdmin();

  constructor() {
    super();
    if (!this.isAdmin) {
      const message: Message = new Message();
      message.type = MessageType.ERREUR;
      message.texte =
        "Vous n'êtes pas autorisé à exécuter l'action ListeEditeur";
      message.isSticky = true;
      this.$store.dispatch("openDisplayedMessage", message).catch(err => {
        Logger.error(err.toString());
      });
      this.$router.push({ name: "Home" }).catch(err => {
        Logger.error(err);
      });
    }
    this.fetchEditeurs();
  }

  fetchEditeurs(): void {
    editeurService
      .getEditeurs(this.$store.getters.getToken())
      .then(res => {
        this.editeurs = res;
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
      });
  }

  ajouterEditeur(): void {
    this.$store.dispatch("closeDisplayedMessage");
    this.$store
      .dispatch("setCurrentEditeur", new Editeur())
      .then(() => {
        this.$router.push({ name: "NouvelEditeur" });
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
      });
  }

  modifierEditeur(item: Editeur): void {
    this.$store.dispatch("closeDisplayedMessage");
    this.$store
      .dispatch("setCurrentEditeur", item)
      .then(() => {
        this.$router.push({ name: "ModifierEditeur" });
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
      });
  }

  downloadEditeurs(): void {
    this.$store.dispatch("closeDisplayedMessage");
    this.$store
      .dispatch("downloadEditeurs", this.editeurs)
      .then(response => {
        Logger.debug(response);
        const fileURL = window.URL.createObjectURL(new Blob([response.data],{type: 'application/csv'}));
        const fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", "export.csv");
        document.body.appendChild(fileLink);

        fileLink.click();
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

        Logger.debug("erre" + err.debugMessage);
        this.$store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err.toString());
        });
      });
  }

  async supprimerEditeur(item: Editeur) {
    this.$store.dispatch("closeDisplayedMessage");

    const confirmed = await (this.$refs.confirm as ConfirmPopup).open(
      `Vous êtes sur le point de supprimer le compte de l'éditeur ${item.nom}

                Etes-vous sûr de vouloir continuer ?`
    );
    if (confirmed) {
      editeurService
        .deleteEditeur(item.id, this.$store.getters.getToken())
        .then(() => {
          const message: Message = new Message();
          message.type = MessageType.VALIDATION;
          message.texte = `L'éditeur ${item.nom} a bien été supprimé`;
          message.isSticky = false;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          // On glisse jusqu'au message
          const messageBox = document.getElementById("messageBox");
          if (messageBox) {
            window.scrollTo(0, messageBox.offsetTop);
          }
          this.fetchEditeurs();
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
        });
    }
  }
}
</script>
<style scoped lang="scss">
.search-bar {
  flex: 0 0 20%;
}
</style>
