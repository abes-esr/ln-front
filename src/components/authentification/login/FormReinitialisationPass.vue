<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col lg="5" md="8" xs="10">
        <div>
          <v-card class="elevation-0">
            <v-form
              ref="formReinitialisationPass"
              lazy-validation
              class="elevation-0"
              :disabled="tokenValid"
            >
              <v-card-title class="pa-3"
                ><h1>Réinitialiser le mot de passe</h1>
              </v-card-title>
              <MessageBox></MessageBox>
              <v-card-text>
                <MotDePasse
                  ref="motDePasse"
                  :action="Action.CREATION"
                  :nouveau-mot-de-passe="this.newPassword"
                  @update:nouveauMotDePasse="updateMotDePasse"
                  class="ma-3"
                  :link-is-expired="true"
                ></MotDePasse>
              </v-card-text>
              <v-card-actions>
                <v-spacer class="hidden-sm-and-down"></v-spacer>
                <v-col
                  cols="12"
                  md="8"
                  lg="8"
                  xl="8"
                  class="d-flex justify-space-around"
                >
                  <v-btn
                    v-if="linkExpired === false"
                    x-large
                    @click="clear"
                    class="bouton-annuler"
                    :disabled="isDisableForm"
                  >
                    Annuler</v-btn
                  >
                  <v-btn
                    v-if="linkExpired === false"
                    :loading="buttonLoading"
                    :disabled="isDisableForm"
                    x-large
                    @click="recaptcha()"
                    >Enregistrer
                    <v-icon class="pl-1">mdi-arrow-right-circle-outline</v-icon>
                  </v-btn>
                </v-col>
              </v-card-actions>
              <v-card-actions>
                <v-col cols="8"> </v-col>
                <a @click="revenirPageAccueil()"
                  ><font-awesome-icon :icon="['fas', 'reply']" />&nbsp;Revenir à
                  la page d'accueil</a
                >
              </v-card-actions>
            </v-form>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Logger } from "@/utils/Logger";
import { authService } from "@/core/service/licencesnationales/AuthentificationService";
import { Message, MessageType } from "@/core/CommonDefinition";
import { LicencesNationalesBadRequestApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import MessageBox from "@/components/common/MessageBox.vue";
import { Action } from "@/core/CommonDefinition";
import MotDePasse from "@/components/authentification/MotDePasse.vue";
@Component({
  components: { MotDePasse, MessageBox }
})
export default class FormReinitialisationPass extends Vue {
  Action: any = Action;
  resetToken: string = "";
  isDisableForm: boolean = false;
  tokenValid: boolean = true;
  tokenrecaptchaValid: Promise<boolean> = this.$recaptchaLoaded();
  tokenrecaptcha: string = "";
  newPassword: string = "";
  buttonLoading: boolean = false;
  linkExpired: boolean = false;

  mounted() {
    this.$store.dispatch("closeDisplayedMessage");

    this.resetToken = window.location.href.substr(
      window.location.href.lastIndexOf("=") + 1
    );

    this.isTokenValid
      .then(result => {
        this.tokenValid = result;
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
        this.tokenValid = false;
      })
      .finally(() => {
        if (!this.tokenValid) {
          const message: Message = new Message();
          message.type = MessageType.ERREUR;
          message.texte = "La durée de validité de ce lien est dépassée.";
          message.isSticky = true;
          this.linkExpired = true;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
        }
      });
  }

  get loggedIn() {
    return this.$store.state.user.isLoggedIn;
  }

  get isTokenValid(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      authService
        .verifierValiditeToken(this.resetToken)
        .then(response => {
          resolve(response);
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
          reject(false);
        })
        .finally(() => {
          this.buttonLoading = false;
        });
    });
  }

  updateMotDePasse(value: string) {
    this.newPassword = value;
  }

  async recaptcha() {
    await this.$recaptchaLoaded();
    this.tokenrecaptcha = await this.$recaptcha("reinitialisationPass");
    if (this.validate()) {
      this.reinitialisationPass();
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

  validate(): boolean {
    const isFormValide = (this.$refs.formReinitialisationPass as Vue & {
      validate: () => boolean;
    }).validate();
    const isMotDePasseValide = (this.$refs.motDePasse as Vue & {
      validate: () => boolean;
    }).validate();

    return isFormValide && isMotDePasseValide;
  }

  reinitialisationPass(): void {
    this.buttonLoading = true;
    this.$store.dispatch("closeDisplayedMessage");

    authService
      .reinitialiserMotDePasse({
        nouveauMotDePasse: this.newPassword,
        recaptcha: this.tokenrecaptcha,
        token: this.resetToken
      })
      .then(response => {
        const message: Message = new Message();
        message.type = MessageType.VALIDATION;
        message.texte = response.message;
        message.isSticky = true;
        this.$store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err);
        });
        // On glisse sur le message d'erreur
        const messageBox = document.getElementById("messageBox");
        if (messageBox) {
          window.scrollTo(0, messageBox.offsetTop);
        }
        setTimeout(() => {
          this.$router.push({ name: "Login" });
        }, 4000);
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
      })
      .finally(() => {
        this.buttonLoading = false;
      });
  }

  revenirPageAccueil(): void {
    this.$router.push({ name: "Login" }).catch(err => {
      Logger.error(err);
    });
  }

  allerPageMotDePasseOublie(): void {
    this.$router.push({ name: "ReinitialisationPass" }).catch(err => {
      Logger.error(err);
    });
  }

  afficherMotDePasseOulie(): void {
    this.$emit("onChange"); // On notifie le composant parent
  }

  clear() {
    (this.$refs.motDePasse as MotDePasse).clear();
    (this.$refs.formReinitialisationPass as HTMLFormElement).resetValidation();
    this.newPassword = "";
  }
}
</script>

<style scoped lang="scss">
h1 {
  font-size: 40px;
  font-weight: 500;
}
</style>
