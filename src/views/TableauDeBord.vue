<template>
  <v-card flat>
    <h1>Tableau de bord {{ etablissement.nom }}</h1>
    <MessageBox></MessageBox>
    <v-container class="mx-9 elevation-0">
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
      <span
        >Compte créé le :
        {{ etablissement.dateCreation.toLocaleDateString() }}</span
      >
      <v-row class="d-flex justify-space-between flex-wrap">
        <v-col
          cols="12"
          md="3"
          lg="3"
          xl="3"
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
            </div>
            <v-alert outlined>
              <font-awesome-icon
                :icon="['fas', 'info-circle']"
                class="fa-2x mr-5 mb-1 icone-information"
              />
              Pour toute demande de modification des infos de l'établissement,
              nous contacter via le guichet d'assistance
              <v-btn
                class="bouton-simple elevation-0 pa-0"
                href="http://documentation.abes.fr/aidelicencesnationales/index.html#Beneficiaires"
                target="_blank"
                >ABESstp
              </v-btn>
            </v-alert>
          </v-card-text>
        </v-col>
        <v-col
          cols="12"
          md="3"
          lg="3"
          xl="3"
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
            <v-row class="text-right">
              <v-col cols="12">
                <v-btn class="btn-2 " @click="allerAMonProfil()"
                  >Modifier mon contact</v-btn
                ></v-col
              >
              <v-col cols="12">
                <v-btn class="btn-2" @click="allerAModifierMotDePasse()"
                  >Modifier mon mot de passe</v-btn
                ></v-col
              >
            </v-row>
          </v-card-text>
        </v-col>
        <v-col
          cols="12"
          md="6"
          lg="6"
          xl="6"
          class="d-flex align-content-start justify-center flex-wrap"
        >
          <v-card-title class="d-block titre-block" style="margin-bottom:-4px;">
            <font-awesome-icon
              :icon="['fas', 'bell']"
              class="fa-lg mx-2 icone-standard"
            />
            Notifications</v-card-title
          >
          <v-card-text class="d-flex justify-space-between flex-column">
            <div class="d-flex flex-column justify-start mx-3 my-3  bloc-info">
              <h3 style="margin-bottom: 1em">Liste des établissements</h3>
              <li style="margin-bottom: 1em" v-for="item in this.notifications" :key="item.index">Siren: {{ item.siren }}<br>Nom établissement: {{ item.nomEtab }}<br>Evenement: {{ item.typeNotif }}<br>Date: {{ dateFormatted(item.dateEvent) }}</li>
              <!--TODO créer une fonction @click qui va à partir du numéro d'établissement, utiliser la fonction setcurrentetablissement pour changer l'établissement en cours dans le store, puisdans la fonction utilisé par @click, utiliser la fonction
              allerAAfficherEtab qui passe en paramètre létablissement mis à jour à partir du store -->
            </div>
          </v-card-text>
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
import { Notification } from "@/core/Notification";
import { LicencesNationalesBadRequestApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import { LicencesNationalesUnauthorizedApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesUnauthorizedApiError";
import moment from "moment/moment";

@Component({
  components: { MessageBox }
})
export default class Home extends Vue {
  etablissement: Etablissement;
  Action: any = Action;
  isAdmin: boolean = this.$store.getters.isAdmin();
  notifications: Array<Notification> = [];

  constructor() {
    super();
    this.etablissement = this.getEtablissement;
    this.$store.dispatch("setCurrentEtablissement", this.etablissement);
    this.collecterNotifs();
    console.log(this.notifications);
  }

  get getEtablissement(): Etablissement {
    return this.$store.getters.getEtablissementConnecte();
  }

  dateFormatted(d: Date): string {
    return moment(d).format('YYYY-MM-DD');
  }

  allerAMonProfil(): void {
    this.$router.push({ name: "Profil" });
  }

  allerAModifierMotDePasse(): void {
    this.$router.push({ name: "Password" }).catch(err => {
      Logger.error(err);
    });
  }

  collecterNotifs(): void {
    etablissementService
      .getNotificationsAdmin(this.$store.getters.getToken())
      .then(response => {
        this.notifications = response;
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
      });
  }

  //TODO appeler cette fonction pour afficher l'établissement au clic
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
