<template>
  <v-card elevation="0">
    <v-card-title class="pb-0 pl-0 pa-3"
      ><h1 class="pb-1">Mot de passe oublié</h1></v-card-title
    >
    <v-card-title class="pa-1">
      Choisir une option de réinitialisation <MessageBox></MessageBox>
    </v-card-title>
    <v-radio-group id="radio" v-model="sirenRadio">
      <v-card-text class="fondGris">
        <v-row>
          <v-col cols="1" />
          <v-col cols="10">
            <v-radio
              label="Je connais le SIREN de mon établissement"
              :value="true"
            />
            <v-form ref="formSIREN" lazy-validation>
              <v-text-field
                outlined
                filled
                label="SIREN"
                placeholder="SIREN"
                v-model="siren"
                maxlength="9"
                :rules="rulesForms.siren"
                required
                @keyup.enter="validate()"
                :disabled="!sirenRadio"
              ></v-text-field>
              <v-icon> mdi-information </v-icon
              ><a
                href="https://annuaire-entreprises.data.gouv.fr/"
                target="_blank"
                style="font-size: 1.1rem"
                >Trouver le SIREN de votre établissement</a
              >
            </v-form>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1" />
          <v-col cols="10">
            <v-radio
              label="Je connais l'adresse de contact de mon établissement :"
              :value="false"
            />
            <v-form ref="formMail" lazy-validation>
              <v-text-field
                outlined
                filled
                label="Adresse mail de contact"
                placeholder="Adresse mail de contact"
                type="mail"
                v-model="mail"
                :rules="rulesForms.email"
                required
                @keyup.enter="validate()"
                :disabled="sirenRadio"
              ></v-text-field>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>
    </v-radio-group>
    <v-card-actions>
      <v-row>
        <v-col>
          <v-btn
            color="button"
            style="float: right;"
            :loading="buttonLoading"
            @click="recaptcha()"
            >Envoyer
            <v-icon style="padding-left: 5px;"
              >mdi-arrow-right-circle-outline
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Logger } from "@/utils/Logger";
import { rulesForms } from "@/core/RulesForm";
import { authService } from "@/core/service/licencesnationales/AuthentificationService";
import { Message, MessageType } from "@/core/CommonDefinition";
import { LicencesNationalesBadRequestApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import MessageBox from "@/components/common/MessageBox.vue";

@Component({ components: { MessageBox } })
export default class ForgotPassword extends Vue {
  rulesForms: any = rulesForms;
  siren: string = "";
  isTokenValid: Promise<boolean> = this.$recaptchaLoaded();
  token: string = "";
  mail: string = "";
  sirenRadio: boolean = true;
  buttonLoading: boolean = false;

  async recaptcha() {
    await this.$recaptchaLoaded();
    this.token = await this.$recaptcha("forgotPassword");
    this.validate();
  }

  validate(): void {
    if (this.sirenRadio) {
      if (
        (this.$refs.formSIREN as Vue & { validate: () => boolean }).validate()
      ) {
        this.buttonLoading = true;
        this.$store.dispatch("closeDisplayedMessage");
        authService
          .motDePasseOublieSiren({
            siren: this.siren,
            recaptcha: this.token
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
    } else {
      if (
        (this.$refs.formMail as Vue & { validate: () => boolean }).validate()
      ) {
        this.buttonLoading = true;
        this.$store.dispatch("closeDisplayedMessage");
        authService
          .motDePasseOublieEmail({
            email: this.mail,
            recaptcha: this.token
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
          })
          .catch(err => {
            Logger.error(err.toString());
            const message: Message = new Message();
            message.type = MessageType.ERREUR;
            if (err instanceof LicencesNationalesBadRequestApiError) {
              message.type = MessageType.VALIDATION;
              message.texte =
                "Si l'adresse e-mail est reconnue, vous recevrez un lien de réinitialisation du mot de passe";
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
    }
  }
}
</script>

<style scoped>
h1 {
  padding-bottom: 30px;
}
.v-input--radio-group {
  padding-top: 0;
  margin-top: 0;
}
</style>
