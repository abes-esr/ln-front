<template>
  <div>
    <v-card witdh="100%" outlined>
      <v-card-title>Mot de passe oublié</v-card-title>
      <v-card-subtitle
        >Remplissez un des deux champs ci-dessous</v-card-subtitle
      >
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
                  :rules="sirenRules"
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
                  :rules="mailRules"
                  required
                  @keyup.enter="validate()"
                  :disabled="sirenRadio"
                ></v-text-field>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
      </v-radio-group>
      <v-row>
        <v-col cols="1" />
        <v-col cols="10">
          <v-alert v-if="retourKo" dense outlined :value="alert" type="error">
            {{ message }}
          </v-alert>
          <v-alert v-else dense outlined :value="alert" type="success">
            {{ message }}
          </v-alert>
        </v-col>
      </v-row>
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
                >mdi-arrow-right-circle-outline</v-icon
              ></v-btn
            ></v-col
          >
        </v-row>
      </v-card-actions>
    </v-card>
    <br />
  </div>
</template>

<script lang="ts">
import { serviceLn } from "../../service/licencesnationales/LicencesNationalesApiService";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ForgotPassword extends Vue {
  siren: string = "";
  tokenValid: Promise<boolean> = this.$recaptchaLoaded();
  token: string = "";
  sirenRules = [
    (v: string) => !!v || "SIREN obligatoire",
    (v: string) => /^\d{9}$/.test(v) || "Le SIREN doit contenir 9 chiffres"
  ];
  mailRules = [
    (v: string) => !!v || "Adresse mail obligatoire",
    (v: string) =>
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        v
      ) || "Adresse mail invalide"
  ];
  mail: string = "";
  sirenRadio: boolean = true;
  buttonLoading: boolean = false;
  alert: boolean = false;
  alertOK: boolean = false;
  retourKo: boolean = false;
  message: string = "";

  async recaptcha() {
    // (optional) Wait until recaptcha has been loaded.
    await this.$recaptchaLoaded();

    // Execute reCAPTCHA with action "forgotPassword".
    this.token = await this.$recaptcha("forgotPassword");
    console.log("token dans recaptcha() " + this.token);
    // Do stuff with the received token.
    this.validate();
  }

  validate(): void {
    this.alert = false;
    this.message = "";
    this.retourKo = false;
    if (this.sirenRadio) {
      if (
        (this.$refs.formSIREN as Vue & { validate: () => boolean }).validate()
      )
        serviceLn
          .resetPassword({
            siren: this.siren,
            recaptcha: this.token
          })
          .then(response => {
            this.buttonLoading = false;
            this.message = response.data;
            this.alert = true;
          })
          .catch(err => {
            this.buttonLoading = false;
            this.message = err.response.data;
            this.alert = true;
            this.retourKo = true;
          });
    } else {
      if ((this.$refs.formMail as Vue & { validate: () => boolean }).validate())
        serviceLn
          .resetPassword({
            email: this.mail,
            recaptcha: this.token
          })
          .then(response => {
            this.buttonLoading = false;
            this.message = response.data;
            this.alert = true;
          })
          .catch(err => {
            this.buttonLoading = false;
            this.message = err.response.data;
            this.alert = true;
            this.retourKo = true;
          });
    }
  }
}
</script>
