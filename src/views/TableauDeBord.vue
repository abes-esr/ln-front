<template>
  <v-card flat class="mx-9">
    <h1>
      Tableau de bord <span v-if="!isAdmin">{{ etablissement.nom }}</span>
    </h1>
    <MessageBox></MessageBox>
    <ConfirmPopup ref="confirm"></ConfirmPopup>
    <v-container
      class="pt-0 elevation-0"
      :class="[$vuetify.breakpoint.mdAndDown ? 'large-container' : '']"
    >
      <v-card-text class="fondGris pa-0 px-6 pb-6">
        <v-card-title class="px-0 pb-0"
          >Information du compte
          <v-tooltip top max-width="20vw" open-delay="100">
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                class="bouton-simple"
                @click="downloadEtablissement()"
                v-on="on"
                :loading="isExportLoading"
              >
                <font-awesome-icon
                  :icon="['fas', 'download']"
                  class="mx-2 fa-lg"
                />
              </v-btn>
            </template>
            <span>Exporter les infos du compte</span>
          </v-tooltip>
        </v-card-title>
        <span
          >Compte créé le :
          {{ etablissement.dateCreation.toLocaleDateString() }}</span
        >
        <v-row class="d-flex justify-space-between flex-wrap pt-3">
          <v-col cols="12" md="3" lg="3" xl="3" v-if="!isAdmin">
            <div
              style="height: 100%; position:relative;"
              class="borderCol fondBlanc"
              :class="[$vuetify.breakpoint.mdAndDown ? 'compact-form' : '']"
            >
              <div class="d-flex">
                <h2 class="my-3 pl-4 mb-0">Etablissement</h2>
                <v-tooltip
                  top
                  max-width="20vw"
                  open-delay="100"
                  v-if="!isAdmin"
                >
                  <template v-slot:activator="{ on }">
                    <font-awesome-icon
                      v-on="on"
                      :icon="['fas', 'lock']"
                      class="fa-2x mx-2"
                      style="margin-top: 10px; position: absolute; right: 0;"
                    />
                  </template>
                  <span>Non modifiable par l'utilisateur</span>
                </v-tooltip>
              </div>
              <v-card-text
                class="d-flex align-content-start flex-wrap pt-0 no-border"
              >
                <div
                  class="d-flex flex-column justify-start mx-3  mb-3 mt-0 bloc-info"
                >
                  <div class="mt-2">
                    <h3 class="d-inline">Siren :</h3>
                    {{ etablissement.siren }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">ID Abes :</h3>
                    {{ etablissement.idAbes }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">Nom :</h3>
                    {{ etablissement.nom }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">Type :</h3>
                    {{ etablissement.typeEtablissement }}
                  </div>
                </div>
              </v-card-text>
              <v-alert
                outlined
                class="ma-2 pt-1 pb-0"
                style="position: absolute; bottom: 0; font-size: 14px;"
              >
                <font-awesome-icon
                  :icon="['fas', 'info-circle']"
                  class="fa-2x mr-5 mb-1 icone-information"
                  style="height: 100%"
                />
                <p class="mb-0">
                  Pour toute demande de modification des infos de
                  l'établissement, nous contacter via le guichet d'assistance
                  <v-btn
                    class="bouton-simple elevation-0 pa-0"
                    href="https://stp.abes.fr/node/3?origine=LicencesNationales"
                    target="_blank"
                    >ABESstp
                  </v-btn>
                </p>
              </v-alert>
            </div>
          </v-col>
          <v-col cols="12" md="3" lg="3" xl="3" v-if="!isAdmin">
            <div style="height: 100%" class="borderCol fondBlanc">
              <div class="d-flex justify-space-between align-center">
                <h2 class="my-3 pl-4 mb-0">
                  Contact
                </h2>
              </div>
              <v-card-text
                class="d-flex align-content-start flex-wrap pt-0 no-border"
              >
                <div
                  class="d-flex flex-column justify-start mx-3 mb-3 mt-0 bloc-info"
                >
                  <div class="mt-2">
                    <h3 class="d-inline">Nom :</h3>
                    {{ etablissement.contact.nom }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">Prénom :</h3>
                    {{ etablissement.contact.prenom }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">Tél :</h3>
                    {{ etablissement.contact.telephone }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">Email :</h3>
                    {{ etablissement.contact.mail }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">Adresse :</h3>
                    {{ etablissement.contact.adresse }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">BP :</h3>
                    {{ etablissement.contact.boitePostale }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">Code postal :</h3>
                    {{ etablissement.contact.codePostal }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">Ville :</h3>
                    {{ etablissement.contact.ville }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">Cedex :</h3>
                    {{ etablissement.contact.cedex }}
                  </div>
                </div>
                <v-row class="text-right">
                  <v-col cols="12">
                    <v-btn class="btn-2 " @click="allerAMonProfil()"
                      >Modifier contact</v-btn
                    ></v-col
                  >
                  <v-col cols="12">
                    <v-btn class="btn-2" @click="allerAModifierMotDePasse()"
                      >Modifier mot de passe</v-btn
                    ></v-col
                  >
                </v-row>
              </v-card-text>
            </div>
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            <div style="height: 100%" class="borderCol fondBlanc">
              <v-card-title
                class="d-block titre-block"
                style="margin-bottom:-4px;"
              >
                <font-awesome-icon
                  :icon="['fas', 'bell']"
                  class="fa-lg mx-2 icone-standard"
                />
                <span v-if="isAdmin">Dernières actions des utilisateurs</span>
                <span v-else>Notifications</span>
              </v-card-title>
              <v-card-text
                class="d-flex align-content-start flex-wrap notifs no-border"
              >
                <div
                  class="d-flex flex-column justify-start mx-3 my-3  bloc-info"
                >
                  <div v-if="notifsLoading">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </div>
                  <ul>
                    <li
                      style="margin-bottom: 1em"
                      v-for="item in this.notificationsAdmin"
                      :key="item.index"
                    >
                      Siren: {{ item.siren }}<br />Nom établissement:
                      <a @click="allerPageEtablissement(item.siren)">{{
                        item.nomEtab
                      }}</a
                      ><br />Evenement: {{ item.typeNotif }}<br />Date:
                      {{ dateFormatted(item.dateEvent) }}
                    </li>
                    <li
                      style="margin-bottom: 1em"
                      v-for="item in this.notificationsUser"
                      :key="item.index"
                    >
                      <span class="notifUserMsg" v-html="item.message"></span>
                      <br />
                      <span
                        class="notifUserDesc"
                        v-html="item.description"
                      ></span>
                    </li>
                    <span
                      v-if="!isAdmin && this.notificationsUser.length === 0"
                      class="notifUserMsg"
                      >Toutes les adresses IP déclarées ont été validées</span
                    >
                  </ul>
                </div>
              </v-card-text>
            </div>
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6" v-if="isAdmin">
            <div
              class="borderCol fondBlanc"
              style="height: 100%; position: relative;"
            >
              <v-card-title
                class="d-block titre-block"
                style="margin-bottom:-4px;"
              >
                <font-awesome-icon
                  :icon="['fas', 'paper-plane']"
                  class="fa-lg mx-2"
                />
                Envoi aux éditeurs
              </v-card-title>
              <v-card-text class="no-border">
                <div
                  class="d-flex flex-column justify-start mx-3 my-3  bloc-info"
                >
                  <div v-if="datesLoading">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </div>
                  <ul>
                    <li
                      style="margin-bottom: 0.5em"
                      v-for="item in this.datesEnvoi"
                      :key="item.index"
                    >
                      <span v-html="item"></span>
                    </li>
                  </ul>
                </div>
                <v-btn @click="envoiEditeurs()" class="bottom ma-4"
                  >Envoi aux éditeurs</v-btn
                >
              </v-card-text>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MessageBox from "@/components/common/MessageBox.vue";
import Etablissement from "@/core/Etablissement";
import { Action, Message, MessageType } from "@/core/CommonDefinition";
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import { Logger } from "@/utils/Logger";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import { Notification } from "@/core/Notification";
import { LicencesNationalesBadRequestApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import { LicencesNationalesUnauthorizedApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesUnauthorizedApiError";
import moment from "moment/moment";
import NotificationUser from "@/core/service/NotificationUser";
import { editeurService } from "@/core/service/licencesnationales/EditeurService";

@Component({
  components: { MessageBox, ConfirmPopup }
})
export default class Home extends Vue {
  etablissement: Etablissement;
  Action: any = Action;
  isAdmin: boolean = this.$store.getters.isAdmin();
  isExportLoading: boolean = false;
  notificationsAdmin: Array<Notification> = [];
  notificationsUser: Array<NotificationUser> = [];
  datesEnvoi: Array<string> = [];
  buttonLoading: boolean = false;
  notifsLoading: boolean = true;
  datesLoading: boolean = true;

  constructor() {
    super();
    moment.locale("fr");
    this.etablissement = this.getEtablissement;
    this.$store.dispatch("setCurrentEtablissement", this.etablissement);
    this.collecterNotifs();
    this.collecterDates();
  }

  get getEtablissement(): Etablissement {
    return this.$store.getters.getEtablissementConnecte();
  }

  dateFormatted(d: Date): string {
    return moment(d).format("DD/MM/YYYY");
  }

  allerAMonProfil(): void {
    this.$router.push({ name: "Profil" });
  }

  allerAModifierMotDePasse(): void {
    this.$router.push({ name: "Password" }).catch(err => {
      Logger.error(err);
    });
  }

  downloadEtablissement(): void {
    this.isExportLoading = true;
    this.$store.dispatch("closeDisplayedMessage");
    const siren = new Array<string>();
    siren.push(this.$store.state.user.siren);
    etablissementService
      .downloadEtablissements(siren, this.$store.state.user.token)
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

  allerPageEtablissement(siren: string): void {
    const etablissementCible = new Etablissement();
    etablissementCible.siren = siren;
    etablissementCible.id = 0;
    this.allerAAfficherEtab(etablissementCible);
  }

  collecterDates(): void {
    if (this.$store.getters.isAdmin()) {
      editeurService
        .getDatesEnvoiEditeurs(this.$store.getters.getToken())
        .then(result => {
          result.data.forEach(element => {
            this.datesEnvoi.push(
              "<strong>Envoyé le " +
                moment(element).format("DD/MM/YYYY HH:MM") +
                "</strong> - " +
                moment(element).fromNow()
            );
          });
        })
        .catch(err => {
          Logger.error(err.toString());
          const message: Message = new Message();
          message.type = MessageType.ERREUR;
          message.texte =
            "Impossible d'exécuter l'action : " + err.response.data.message;

          message.isSticky = true;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
        })
        .finally(() => {
          this.datesLoading = false;
        });
    }
  }

  collecterNotifs(): void {
    if (this.$store.getters.isAdmin()) {
      etablissementService
        .getNotificationsAdmin(this.$store.getters.getToken())
        .then(response => {
          this.notificationsAdmin = response;
        })
        .catch(err => {
          Logger.error(err.toString());
          const message: Message = new Message();
          message.type = MessageType.ERREUR;
          if (err instanceof LicencesNationalesBadRequestApiError) {
            message.texte = err.message;
          } else if (err instanceof LicencesNationalesUnauthorizedApiError) {
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
          this.notifsLoading = false;
        });
    } else {
      etablissementService
        .getNotificationsEtab(
          this.$store.getters.userSiren(),
          this.$store.getters.getToken()
        )
        .then(response => {
          this.notificationsUser = response;
        })
        .catch(err => {
          Logger.error(err.toString());
          const message: Message = new Message();
          message.type = MessageType.ERREUR;
          if (err instanceof LicencesNationalesBadRequestApiError) {
            message.texte = err.message;
          } else if (err instanceof LicencesNationalesUnauthorizedApiError) {
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
          this.notifsLoading = false;
        });
    }
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

  async envoiEditeurs() {
    const confirmed = await (this.$refs.confirm as ConfirmPopup).open(
      `Vous êtes sur le point de lancer le traitement d'envoi aux éditeurs.

                Etes-vous sûr de vouloir continuer ?`
    );
    if (confirmed) {
      this.buttonLoading = true;
      editeurService
        .envoiEditeurs(this.$store.getters.getToken())
        .then(response => {
          const message: Message = new Message();
          message.type = MessageType.VALIDATION;
          message.texte = response.data.message;

          message.isSticky = true;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          const messageBox = document.getElementById("messageBox");
          if (messageBox) {
            window.scrollTo(0, messageBox.offsetTop);
          }
        })
        .catch(err => {
          Logger.error(err.toString());
          const message: Message = new Message();
          message.type = MessageType.ERREUR;
          if (err instanceof LicencesNationalesBadRequestApiError) {
            message.texte = err.message;
          } else {
            message.texte =
              "Impossible d'exécuter l'action : " + err.response.data.message;
          }
          message.isSticky = true;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          const messageBox = document.getElementById("messageBox");
          if (messageBox) {
            window.scrollTo(0, messageBox.offsetTop);
          }
        })
        .finally(() => {
          this.buttonLoading = false;
        });
    }
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
}

.notifUserMsg {
  font-size: 16px;
  font-weight: 400;
}

.notifUserDesc {
  font-size: 14px;
  font-weight: 400;
}

ul {
  list-style: none; /* Remove default bullets */
}

ul li::before {
  content: "\2022"; /* Add content: \2022 is the CSS Code/unicode for a bullet */
  color: #cf491f; /* Change the color */
  font-weight: bolder; /* If you want it to be bold */
  display: inline-block; /* Needed to add space between the bullet and the text */
  width: 1em; /* Also needed for space (tweak if needed) */
  margin-left: -1em; /* Also needed for space (tweak if needed) */
}

.borderCol {
  border: 1px solid #b8b8b9;
  border-radius: 5px;
  padding-top: 5px;
}

.v-card__text .no-border {
  border: none !important;
}

.bottom {
  position: absolute;
  bottom: 0;
  right: 0;
}

.notifs {
  max-height: 500px;
  overflow: auto;
}

.container {
  margin-left: 0;
  margin-right: 0;
}

.large-container {
  max-width: 1200px !important;
}

@media (min-resolution: 120dpi) {
  #main {
    zoom: 0.75;
  }
}
</style>
