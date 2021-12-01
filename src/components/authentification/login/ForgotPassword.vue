<template>
  <div>
    <v-card witdh="100%" outlined>
      <v-card-title>Mot de passe oublié</v-card-title>
      <v-card-subtitle
        >Remplissez un des deux champs ci-dessous
        <MessageBox></MessageBox>
      </v-card-subtitle>
      <v-radio-group v-model="sirenRadio">
        <v-card-text>
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
                  label="SIREN"
                  placeholder="SIREN"
                  v-model="siren"
                  :rules="rulesForms.sirenEtabRules"
                  required
                  @keyup.enter="validate()"
                  :disabled="!sirenRadio"
                ></v-text-field>
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
                  label="Adresse mail de contact"
                  placeholder="Adresse mail de contact"
                  type="mail"
                  v-model="mail"
                  :rules="rulesForms.emailContactRules"
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
    <br />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Logger } from "@/utils/Logger";
import { rulesForms } from "@/core/RulesForm";
import { LicencesNationalesUnauthorizedApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesUnauthorizedApiError";
import { authService } from "@/core/service/licencesnationales/AuthentificationService";
import {Message, MessageType} from "@/core/CommonDefinition";
import {LicencesNationalesBadRequestApiError} from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
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
    // (optional) Wait until recaptcha has been loaded.
    await this.$recaptchaLoaded();

    // Execute reCAPTCHA with action "forgotPassword".
    this.token = await this.$recaptcha("forgotPassword");
    console.log("getToken dans recaptcha() " + this.token);
    // Do stuff with the received getToken.
    this.validate();
  }

  validate(): void {
  this.buttonLoading = true;
  this.$store.dispatch("closeDisplayedMessage");
    if (this.sirenRadio) {
      if (
        (this.$refs.formSIREN as Vue & { validate: () => boolean }).validate()
      )
        authService
          .motDePasseOublieSiren({
            siren: this.siren,
            recaptcha: this.token
          })
          .then(response => {
            const message: Message = new Message();
            message.type = MessageType.INFORMATION;
            message.texte = response.message;
            message.isSticky = true;
            this.$store.dispatch("openDisplayedMessage", message).catch(err => {
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
          }).finally(() => {
          this.buttonLoading = false;
        });
    } else {
      if ((this.$refs.formMail as Vue & { validate: () => boolean }).validate())
        authService
          .motDePasseOublieEmail({
            email: this.mail,
            recaptcha: this.token
          })
          .then(response => {
            const message: Message = new Message();
            message.type = MessageType.INFORMATION;
            message.texte = response.message;
            message.isSticky = true;
            this.$store.dispatch("openDisplayedMessage", message).catch(err => {
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
          });
    }
  }
}
</script>
