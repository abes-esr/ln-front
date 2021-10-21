<template>
  <div>
    <v-card width="100%" :disabled="disableForm">
      <confirm-popup ref="confirm"></confirm-popup>
      <v-card-title>Gestion des Editeurs</v-card-title>
      <v-card-text>
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
        <v-row class="d-flex justify-space-around">
          <v-alert
            dense
            outlined
            :value="alert"
            type="error"
            width="30vw"
            class="multi-line"
          >
            {{ error }}
          </v-alert>
        </v-row>
        <v-row class="d-flex justify-space-around">
          <v-alert
            dense
            outlined
            :value="notification !== ''"
            type="success"
            width="30vw"
            class="multi-line"
          >
            {{ notification }}
          </v-alert>
        </v-row>
        <v-row class="d-flex justify-space-around ma-0">
          <v-card
            width="60vw"
            outlined
            class="my-6 px-6 justify-center elevation-0"
          >
            <v-data-table
              dense
              :headers="headers"
              :items="editeurs"
              :items-per-page="10"
              class="elevation-0"
              :search="rechercher"
              id="mytable"
            >
              <template v-slot:header.statut="{ header }">
                {{ header.text }}
              </template>
              <template v-slot:top>
                <v-row class="d-flex flex-row-reverse mt-3">
                  <v-text-field
                    v-model="rechercher"
                    label="Chercher dans tous les éditeurs"
                    class="mx-4"
                    prepend-inner-icon="mdi-magnify"
                    outlined
                    dense
                  ></v-text-field>
                  <v-spacer></v-spacer>
                </v-row>
                <v-row class="d-flex mt-1 mb-3">
                  <v-btn
                    @click="downloadEditeurs()"
                    color="grey lighten-3"
                    class="mx-2 text-lowercase btn-2"
                    ><span class="text-uppercase">T</span>élécharger tous les
                    éditeurs
                    <font-awesome-icon :icon="['fas', 'download']" class="mx-2"
                  /></v-btn>
                </v-row>
              </template>
              <template v-slot:item.dateCreation="{ item }">
                <span>{{ item.dateCreation.toLocaleDateString() }}</span>
              </template>
              <template v-slot:[`item.action`]="{ item }">
                <v-btn
                  class="ma-0 pa-0"
                  color="primary"
                  icon
                  @click="modifierEditeur(item)"
                >
                  <font-awesome-icon :icon="['fas', 'edit']" />
                </v-btn>
                <v-btn
                  class="ma-0 pa-0 "
                  color="primary"
                  icon
                  @click="supprimerEditeur(item)"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-row>
      </v-card-text>
    </v-card>
    <br />
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
import ConfirmPopup from "@/components/ConfirmPopup.vue";

@Component({
  components: { ConfirmPopup }
})
export default class ListeEditeurs extends Vue {
  disableForm: boolean = false;
  rechercher: string = "";
  editeurs: Array<Editeur> = [];
  title: string = "";
  id: string = "";
  error: string = "";
  alert: boolean = false;
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
    this.disableForm = false;
    this.$store.dispatch("setNotification", "");

    editeurService
      .getEditeurs(this.$store.getters.getToken())
      .then(res => {
        this.editeurs = res;
      })
      .catch(err => {
        this.alert = true;
        Logger.error(err.toString());
        if (err instanceof LicencesNationalesUnauthorizedApiError) {
          this.disableForm = true;
          this.error = "Vous n'êtes pas autorisé à effectuer cette opération";
          setTimeout(() => {
            this.$router.push({ name: "Home" });
          }, 2000);
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

  async supprimerEditeur(item: Editeur) {
    this.alert = false;

    const confirmed = await (this.$refs.confirm as ConfirmPopup).open(
      "Suppression",
      `Vous êtes sur le point de supprimer le compte de l'éditeur ${item.nom} <br />
                Etes-vous sûr de vouloir continuer ?`
    );
    if (confirmed) {
      editeurService
        .deleteEditeur(item.id, this.$store.getters.getToken())
        .then(response => {
          this.fetchEditeurs();
          this.$store.dispatch("setNotification", `L'éditeur ${ item.nom} a bien été supprimé`);

        })
        .catch(err => {
          Logger.error(err);
          this.error = "Impossible de supprimer cet éditeur : " + err.message;
          this.alert = true;
        });
    }
  }
}
</script>
