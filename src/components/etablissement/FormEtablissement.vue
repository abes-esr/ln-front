<template>
  <v-card class="elevation-0">
    <v-form
      ref="formCreationCompte"
      lazy-validation
      class="elevation-0"
      :disabled="isDisableForm"
    >
      <v-card-title v-if="action === Action.CREATION" class="pl-3">
        Créer le compte de votre établissement
      </v-card-title>
      <h1 v-if="action === Action.MODIFICATION" class="pl-3">
        Etablissement {{ etablissement.nom }}
      </h1>
      <v-card-subtitle
        v-if="action === Action.CREATION"
        @click="allerAConnexion"
      >
        Votre établissement a déjà un compte ?
        <v-btn class="bouton-simple elevation-0"
          >S'authentifier
          <v-icon>mdi-arrow-right-circle-outline </v-icon></v-btn
        >
      </v-card-subtitle>
      <v-card-text>
        <v-col cols="12" md="6" lg="6" xl="6"><MessageBox></MessageBox> </v-col>
        <v-col cols="12" md="6" lg="6" xl="6" v-if="returnLink">
          <v-alert outlined>
            <div>
              <a @click="allerPageAccueil()"
                ><font-awesome-icon :icon="['fas', 'reply']" /> Revenir à la
                page d'accueil</a
              >
            </div>
          </v-alert>
        </v-col>
        <v-col cols="12" md="6" lg="6" xl="6"> </v-col>
        <v-row v-if="action === Action.CREATION">
          <v-col cols="12" md="6" lg="6" xl="6">
            <v-alert dense outlined>
              <font-awesome-icon
                :icon="['fas', 'exclamation-triangle']"
                class="mx-2 icone-attention"
              />
              <h4 class="mb-1">
                Avant de créer cotre compte, vérifier l'éligibilité de votre
                établissement
              </h4>
              <p>
                <strong>Attention : </strong>L'accès aux corpus sous licences
                nationales est reservé aux établissements bénéficiaires selon
                les conditions spécifiques négociées avec chaque éditeur. Pour
                permettre la déclaration des adresses IP autorisées, l'Abes met
                à la disposition des professionnels de la documentation cette
                application dédiée à la gestion des accès.
                <a
                  href="http://documentation.abes.fr/aidelicencesnationales/index.html#Beneficiaires"
                  target="_blank"
                  >Vérifier l'éligibilité de votre établissement.</a
                >
              </p>
              <v-checkbox
                required
                :rules="rulesForms.checkboxRules"
                label="Je confirme que mon établissement est éligible"
              ></v-checkbox>
            </v-alert>
          </v-col>
        </v-row>
        <div
          class="mx-9"
          v-if="
            (action === Action.MODIFICATION && isAdmin) ||
              action === Action.CREATION
          "
        >
          <v-row>
            <v-card-title>Informations de l'établissement</v-card-title>
          </v-row>
          <v-divider class="mb-4"></v-divider>
          <div class="mx-9">
            <v-row>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  outlined
                  label="Nom de l'établissement"
                  placeholder="Nom de l'établissement"
                  v-model="etablissement.nom"
                  :rules="rulesForms.nomEtabRules"
                  required
                  @keyup.enter="validate()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-select
                  outlined
                  v-model="etablissement.typeEtablissement"
                  :items="typesEtab"
                  label="Type de l'établissement"
                  :rules="rulesForms.typeEtabRules"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  outlined
                  label="SIREN"
                  placeholder="SIREN"
                  maxlength="9"
                  v-model="etablissement.siren"
                  :rules="rulesForms.siren"
                  required
                  @input="checkSiren()"
                  @keyup.enter="validate()"
                  :readonly="action == Action.MODIFICATION"
                ></v-text-field>
                <v-chip
                  class="ma-2"
                  :class="checkSirenColor"
                  label
                  v-if="action == Action.CREATION"
                  >SIREN : {{ checkSirenAPI }}
                </v-chip>
              </v-col>
              <v-col
                cols="12"
                md="6"
                lg="6"
                xl="6"
                v-if="action == Action.CREATION"
              >
                <v-alert outlined>
                  <font-awesome-icon
                    :icon="['fas', 'info-circle']"
                    class="fa-2x mr-5 mb-1 icone-information"
                  />
                  <a
                    class="noUnderlineLink"
                    href="https://www.sirene.fr/sirene/public/static/recherche"
                    target="_blank"
                    >Trouver le SIREN de votre établissement</a
                  >
                </v-alert>
              </v-col>
              <v-col
                cols="12"
                md="6"
                lg="6"
                xl="6"
                v-if="action == Action.MODIFICATION"
              >
                <v-text-field
                  outlined
                  label="ID Abes"
                  placeholder="ID Abes"
                  v-model="etablissement.idAbes"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
        </div>
        <div class="mx-9">
          <v-card-title>
            Information Contact
          </v-card-title>
          <v-divider class="mb-4"></v-divider>
          <contact
            ref="formContact"
            :action="action"
            :contact="etablissement.contact"
            :isDisableForm="isDisableForm"
            class="mx-9"
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer class="hidden-sm-and-down"></v-spacer>
        <v-col
          cols="12"
          md="3"
          lg="3"
          xl="3"
          class="d-flex justify-space-around mr-16 flex-wrap"
        >
          <v-btn
            x-large
            @click="clear"
            class="bouton-annuler"
            :disabled="isDisableForm"
          >
            Annuler</v-btn
          >
          <v-btn
            color="button"
            :loading="buttonLoading"
            :disabled="isDisableForm"
            x-large
            @click="validate()"
            >Enregistrer
            <v-icon class="pl-1">mdi-arrow-right-circle-outline</v-icon>
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Logger } from "@/utils/Logger";
import { serviceGouv } from "@/core/service/data.gouv/DataGouvApiService";
import { SirenNotFoundError } from "@/core/service/data.gouv/exception/SirenNotFoundError";
import { DataGouvApiError } from "@/core/service/data.gouv/exception/DataGouvApiError";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import { rulesForms } from "@/core/RulesForm";
import Etablissement from "@/core/Etablissement";
import { Action, Message, MessageType } from "@/core/CommonDefinition";
import Contact from "@/components/etablissement/Contact.vue";
import { LicencesNationalesApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesApiError";
import MessageBox from "@/components/common/MessageBox.vue";

@Component({
  components: { MessageBox, Contact }
})
export default class FormEtablissement extends Vue {
  etablissement: Etablissement;
  @Prop() action!: Action;
  Action: any = Action;
  rulesForms: any = rulesForms;
  isAdmin: boolean = this.$store.getters.isAdmin();
  tokenrecaptcha: string = "";
  typesEtab: Array<string> = [];
  checkSirenAPI: string = "En attente de vérification";
  checkSirenColor: string = "grey";
  buttonLoading: boolean = false;
  alert: boolean = false;
  error: string = "";
  dialog: boolean = false;
  dialogAvailable: boolean = false;
  isDisableForm: boolean = false;
  returnLink: boolean = false;

  constructor() {
    super();
    this.etablissement = this.getCurrentEtablissement;
    this.fetchListeType();
    window.scrollTo(0, 0);
  }

  get getCurrentEtablissement(): Etablissement {
    return this.$store.getters.getCurrentEtablissement();
  }

  async fetchListeType() {
    this.$store.dispatch("closeDisplayedMessage");
    await etablissementService
      .listeType()
      .then(result => {
        this.isDisableForm = false;
        this.typesEtab = result;
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

  allerAConnexion(): void {
    this.$store.dispatch("closeDisplayedMessage");
    this.$router.push({ name: "Login" }).catch(err => {
      Logger.error(err);
    });
  }

  allerPageAccueil(): void {
    this.$router.push({ name: "Login" }).catch(err => {
      Logger.error(err);
    });
  }

  /**
   * Récupère le token Google
   * */
  async recaptcha() {
    await this.$recaptchaLoaded();
    this.tokenrecaptcha = await this.$recaptcha("creationCompte");
  }

  async validate() {
    this.buttonLoading = true;
    this.$store.dispatch("closeDisplayedMessage");

    await this.recaptcha();

    const isFormValide = (this.$refs.formCreationCompte as Vue & {
      validate: () => boolean;
    }).validate();

    const isSubFormValide = (this.$refs.formContact as Contact).validate();

    if (this.tokenrecaptcha != null) {
      if (isFormValide && isSubFormValide) {
        this.send();
      } else {
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        message.texte = "Des champs ne remplissent pas les conditions";
        message.isSticky = true;
        this.$store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err.toString());
        });
        // On glisse sur le message d'erreur
        const messageBox = document.getElementById("messageBox");
        if (messageBox) {
          window.scrollTo(0, messageBox.offsetTop);
        }
      }
    }
    this.buttonLoading = false;
  }

  send(): void {
    this.buttonLoading = true;
    this.$store.dispatch("closeDisplayedMessage");

    if (this.action == Action.CREATION) {
      etablissementService
        .creerEtablissement(this.etablissement, this.tokenrecaptcha)
        .then(() => {
          const message: Message = new Message();
          message.type = MessageType.VALIDATION;
          message.texte = "Votre compte a bien été créé";
          message.isSticky = true;
          this.returnLink = true;
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
          this.buttonLoading = false;
        });
    } else if (this.action == Action.MODIFICATION) {
      etablissementService
        .updateEtablissement(
          this.etablissement,
          this.$store.getters.getToken(),
          this.$store.getters.isAdmin()
        )
        .then(() => {
          const message: Message = new Message();
          message.type = MessageType.VALIDATION;
          message.texte = "Votre compte a bien été modifié";
          message.isSticky = true;
          this.returnLink = true;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          // On glisse sur le message d'erreur
          const messageBox = document.getElementById("messageBox");
          if (messageBox) {
            window.scrollTo(0, messageBox.offsetTop);
          }
          if (
            this.etablissement.siren ==
            this.$store.getters.getEtablissementConnecte().siren
          ) {
            this.$store.dispatch(
              "setEtablissementConnecté",
              this.etablissement
            );
          }
        })
        .catch(err => {
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
          this.buttonLoading = false;
        });
    }
  }

  /**
   * Fonction de vérification du numéro SIREN
   */
  checkSiren(): void {
    this.$store.dispatch("closeDisplayedMessage");
    if (this.etablissement.siren) {
      this.checkSirenAPI = "Vérification du SIREN en cours...";
      this.checkSirenColor = "siren-default";
      if (this.etablissement.siren.length === 9) {
        this.dialogAvailable = true;
        serviceGouv
          .checkSiren(this.etablissement.siren)
          .then(() => {
            this.checkSirenAPI = "valide";
            this.checkSirenColor = "siren-ok";
          })
          .catch(err => {
            Logger.error(err);
            if (err instanceof SirenNotFoundError) {
              this.checkSirenAPI = "inconnu";
              this.checkSirenColor = "siren-erreur";
            } else if (err instanceof DataGouvApiError) {
              this.checkSirenAPI =
                "Impossible de contacter le service de vérification du numéro SIREN";
              this.checkSirenColor = "siren-erreur";
            } else {
              this.checkSirenAPI = "Erreur interne : " + err.message;
              this.checkSirenColor = "red";
            }
          });
      } else {
        this.dialogAvailable = false;
      }
      this.checkSirenAPI = "En attente de vérification";
    }
  }
  clear() {
    this.$store.dispatch("closeDisplayedMessage");
    (this.$refs.formCreationCompte as HTMLFormElement).resetValidation();
    (this.$refs.formContact as Contact).clear();

    if (this.action != Action.CREATION) {
      this.$store.dispatch("setCurrentEtablissement", this.etablissement);
      this.$store.dispatch("closeDisplayedMessage");
      this.$router.push({ name: "Home" }).catch(err => {
        Logger.error(err);
      });
    } else {
      this.etablissement.reset();
      window.scrollTo(0, 0);
    }
  }
}
</script>
<style scoped lang="scss">
.v-card__text {
  border: 0;
}

.v-card__title {
  width: 100%;
}

.icone-attention {
  float: left;
}
</style>
