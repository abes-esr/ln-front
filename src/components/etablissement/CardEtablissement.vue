<template>
  <v-card flat>
    <h1>Etablissement {{ etablissement.nom }}</h1>
    <v-col cols="12" md="6" lg="6" xl="6">
      <MessageBox></MessageBox>
      <ConfirmPopup ref="confirm"></ConfirmPopup>
    </v-col>
    <v-container class="mx-9 elevation-0">
      <v-col
        cols="12"
        class="d-flex align-content-start justify-space-between flex-wrap mx-0 px-0"
      >
        <v-card-title class="px-0"
          >Information du compte
          <v-tooltip top max-width="20vw" open-delay="100">
            <template v-slot:activator="{ on }">
              <v-btn icon class="bouton-simple" v-on="on">
                <font-awesome-icon
                  :icon="['fas', 'download']"
                  class="mx-2 fa-lg"
                />
              </v-btn>
            </template>
            <span>Télécharger les infos du compte</span>
          </v-tooltip>
        </v-card-title>

        <v-btn class="btn-2 mt-3" @click="allerAIPs()"
          >Voir la liste des IPs
          <v-icon class="ml-2">mdi-ip-network</v-icon></v-btn
        >
      </v-col>
      <span class="d-block"
        >Compte créé le :
        {{ etablissement.dateCreation.toLocaleDateString() }}</span
      >
      <v-btn class="btn-2 mt-3" @click="allerAModifierEtablissement()"
        >Modifier le compte</v-btn
      >
      <v-row class="d-flex justify-space-between flex-wrap">
        <v-col
          cols="12"
          md="6"
          lg="6"
          xl="6"
          class="d-flex align-content-start justify-center flex-wrap"
        >
          <v-card-title class="d-block titre-block"></v-card-title>
          <v-card-text class="d-flex justify-space-between flex-column">
            <div class="d-flex justify-space-between align-center">
              <h2 class="my-3">Etablissement</h2>
              <v-tooltip top max-width="20vw" open-delay="100" v-if="!isAdmin">
                <template v-slot:activator="{ on }">
                  <font-awesome-icon
                    v-on="on"
                    :icon="['fas', 'lock']"
                    class="fa-2x mx-2"
                  />
                </template>
                <span>Non modifiable par l'utilisateur</span>
              </v-tooltip>
            </div>
            <div class="d-flex flex-column justify-start mx-3 my-3 bloc-info">
              <div>
                <h3 class="d-inline">Siren :</h3>
                {{ etablissement.siren }}
              </div>
              <div>
                <h3 class="d-inline">ID Abes :</h3>
                {{ etablissement.idAbes }}
              </div>
              <div>
                <h3 class="d-inline">Nom :</h3>
                {{ etablissement.nom }}
              </div>
              <div>
                <h3 class="d-inline">Type :</h3>
                {{ etablissement.typeEtablissement }}
              </div>
              <div>
                <h3 class="d-inline">Statut :</h3>
                {{ etablissement.statut }}
              </div>
              <div>
                <h3 class="d-inline">Statut des IPs:</h3>
                {{ etablissement.statut }}
              </div>
            </div>
          </v-card-text>
        </v-col>
        <v-col
          cols="12"
          md="6"
          lg="6"
          xl="6"
          class="d-flex align-content-start justify-center flex-wrap"
        >
          <v-card-title class="d-block titre-block"></v-card-title>
          <v-card-text class="d-flex justify-space-between flex-column">
            <div class="d-flex justify-space-between align-center">
              <h2 class="my-3">Contact</h2>
            </div>
            <div class="d-flex flex-column justify-start mx-3 my-3 bloc-info">
              <div>
                <h3 class="d-inline">Nom :</h3>
                {{ etablissement.contact.nom }}
              </div>
              <div>
                <h3 class="d-inline">Prénom :</h3>
                {{ etablissement.contact.prenom }}
              </div>
              <div>
                <h3 class="d-inline">Tél :</h3>
                {{ etablissement.contact.telephone }}
              </div>
              <div>
                <h3 class="d-inline">Email :</h3>
                {{ etablissement.contact.mail }}
              </div>
              <div>
                <h3 class="d-inline">Adresse :</h3>
                {{ etablissement.contact.adresse }}
              </div>
              <div>
                <h3 class="d-inline">BP :</h3>
                {{ etablissement.contact.boitePostale }}
              </div>
              <div>
                <h3 class="d-inline">Code postal :</h3>
                {{ etablissement.contact.codePostal }}
              </div>
              <div>
                <h3 class="d-inline">Ville :</h3>
                {{ etablissement.contact.ville }}
              </div>
              <div>
                <h3 class="d-inline">Cedex :</h3>
                {{ etablissement.contact.cedex }}
              </div>
            </div>
          </v-card-text>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            color="button"
            class="bouton-supprimer"
            :loading="buttonSuppresionLoading"
            @click="supprimerEtablissement()"
            >Supprimer le compte
          </v-btn></v-col
        >
        <v-spacer></v-spacer>
        <v-col
          cols="12"
          md="3"
          lg="3"
          xl="3"
          class="d-flex justify-space-around mr-16 flex-wrap"
        >
          <v-btn @click="clear" class="bouton-annuler"> Annuler</v-btn>
          <v-btn
            color="bouton-valider"
            @click="validerEtablissement()"
            :loading="buttonValidationLoading"
            >Valider
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MessageBox from "@/components/common/MessageBox.vue";
import Etablissement from "@/core/Etablissement";
import { Action, Message, MessageType } from "@/core/CommonDefinition";
import { Logger } from "@/utils/Logger";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";

@Component({
  components: { ConfirmPopup, MessageBox }
})
export default class CardEtablissement extends Vue {
  etablissement: Etablissement;
  Action: any = Action;
  isAdmin: boolean = this.$store.getters.isAdmin();
  buttonValidationLoading: boolean = false;
  buttonSuppresionLoading: boolean = false;

  constructor() {
    super();
    this.etablissement = this.getEtablissement;

    if (!this.isAdmin) {
      const message: Message = new Message();
      message.type = MessageType.ERREUR;
      message.texte =
        "Vous n'êtes pas autorisé à exécuter l'action AfficherEtablissemnt";
      message.isSticky = true;
      this.$store.dispatch("openDisplayedMessage", message).catch(err => {
        Logger.error(err.toString());
      });
      this.$router.push({ name: "Home" }).catch(err => {
        Logger.error(err);
      });
    }
  }

  get getEtablissement(): Etablissement {
    return this.$store.getters.getCurrentEtablissement();
  }

  allerAModifierEtablissement(): void {
    this.$store.dispatch("closeDisplayedMessage");
    this.$router.push({ name: "ModifierEtablissement" });
  }

  allerAIPs(): void {
    this.$store.dispatch("closeDisplayedMessage");
    this.$router.push({ name: "ListeIP" });
  }

  async supprimerEtablissement() {
    this.buttonSuppresionLoading = true;
    this.$store.dispatch("closeDisplayedMessage");

    const confirmed = await (this.$refs.confirm as ConfirmPopup).open(
      `ATTENTION : Vous êtes sur le point de supprimer définitivement le compte de l'établissement ${this.etablissement.nom} avec toutes les informations associés (les des IPs,...)


      Etes-vous sûr de vouloir effectuer cette ation ?`
    );
    if (confirmed) {
      etablissementService
        .deleteEtab(this.etablissement.siren, this.$store.getters.getToken())
        .then(() => {
          const message: Message = new Message();
          message.type = MessageType.VALIDATION;
          message.texte = "Le compte a bien été créé supprimé";
          message.isSticky = true;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          // On glisse sur le message d'erreur
          const messageBox = document.getElementById("messageBox");
          if (messageBox) {
            window.scrollTo(0, messageBox.offsetTop);
          }
          setTimeout(() => {
            this.$store.dispatch("closeDisplayedMessage");
            this.$router.push({ name: "ListeEtab" }).catch(err => {
              Logger.error(err.toString());
            });
          }, 4000);
        })
        .catch(err => {
          Logger.error(err.toString());
          const message: Message = new Message();
          message.type = MessageType.ERREUR;
          message.texte = err.message;
          message.isSticky = true;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          // On glisse sur le message d'erreur
          const messageBox = document.getElementById("messageBox");
          if (messageBox) {
            window.scrollTo(0, messageBox.offsetTop);
          }
        })
        .finally(() => {
          this.buttonSuppresionLoading = false;
        });
    } else {
      this.buttonSuppresionLoading = false;
    }
  }

  async validerEtablissement() {
    this.buttonValidationLoading = true;
    this.$store.dispatch("closeDisplayedMessage");

    const confirmed = await (this.$refs.confirm as ConfirmPopup).open(
      `Vous êtes sur le point de valider le compte de l'établissement ${this.etablissement.nom}

      Etes-vous sûr de vouloir effectuer cette ation ?`
    );
    if (confirmed) {
      etablissementService
        .validerEtablissement(
          this.etablissement.siren,
          this.$store.getters.getToken()
        )
        .then(() => {
          const message: Message = new Message();
          message.type = MessageType.VALIDATION;
          message.texte = "Votre compte a bien été créé";
          message.isSticky = true;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          // On glisse sur le message d'erreur
          const messageBox = document.getElementById("messageBox");
          if (messageBox) {
            window.scrollTo(0, messageBox.offsetTop);
          }
        })
        .catch(err => {
          Logger.error(err.toString());
          const message: Message = new Message();
          message.type = MessageType.ERREUR;
          message.texte = err.message;
          message.isSticky = true;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          // On glisse sur le message d'erreur
          const messageBox = document.getElementById("messageBox");
          if (messageBox) {
            window.scrollTo(0, messageBox.offsetTop);
          }
        })
        .finally(() => {
          this.buttonValidationLoading = false;
        });
    } else {
      this.buttonValidationLoading = false;
    }
  }

  clear() {
    this.$store.dispatch("closeDisplayedMessage");

    this.$router.push({ name: "ListeEtab" }).catch(err => {
      Logger.error(err);
    });
  }
}
</script>
<style scoped lang="scss">
.container {
  width: auto !important;
}

.block-content {
  height: 100%;
}

.bloc-info div {
  margin-top: 1rem;
}

.titre-block {
  width: 100%;
  min-height: 60px;
}

.multi-line span {
  min-height: 1rem;
  word-break: break-all;
}
</style>
