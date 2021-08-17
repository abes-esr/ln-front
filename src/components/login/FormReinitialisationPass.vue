<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col lg="5" md="8" xs="10">
        <div>
          <v-card v-if="this.tokenExpired === 'true'">
            <v-alert dense outlined type="error">
              La durée de validité de ce lien est dépassée. Mot de passe oublié
              :
              <router-link :to="{ path: 'forgotPassword' }"
                >cliquez ici</router-link
              >
            </v-alert>
          </v-card>
          <v-card witdh="100%" outlined v-else>
            <v-form ref="formReinitialisationPass" lazy-validation>
              <v-card-title
                >Réinitialisation de votre mot de passe</v-card-title
              >
              <v-card-text>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-alert border="left" color="grey" dark>
                      Votre mot de passe doit contenir au minimum 8 caractères
                      dont une lettre majuscule, une lettre minuscule, un
                      chiffre et un caractère spécial parmis @ $ ! % * ? &
                    </v-alert>
                    <v-text-field
                      outlined
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      label="Créez votre nouveau mot de passe"
                      placeholder="Mot de passe"
                      :disabled="disabled == 1"
                      v-model="passContact"
                      :rules="passContactRules"
                      :type="show1 ? 'text' : 'password'"
                      required
                      @keyup.enter="validate()"
                      @click:append="show1 = !show1"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-text-field
                      outlined
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      label="Confirmez votre nouveau mot de passe [contrôle de conformité]"
                      placeholder="Confirmation"
                      :disabled="disabled == 1"
                      v-model="confirmPassContact"
                      :rules="
                        confirmPassContactRules.concat(confirmPassContactRule)
                      "
                      :type="show1 ? 'text' : 'password'"
                      required
                      @keyup.enter="validate()"
                      @click:append="show1 = !show1"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10"> </v-col>
                </v-row>
              </v-card-text>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-alert
                    v-if="retourKo"
                    dense
                    outlined
                    :value="alert"
                    type="error"
                  >
                    {{ message }}
                  </v-alert>
                  <v-alert v-else dense outlined :value="alert" type="success">
                    {{ message }}
                  </v-alert>
                </v-col>
              </v-row>
              <v-card-actions>
                <v-col cols="5"></v-col>
                <v-col cols="5">
                  <v-row justify="space-between">
                    <v-col>
                      <v-btn
                        x-large
                        color="grey"
                        @click="clear"
                        :disabled="disabled == 1"
                        >Effacer</v-btn
                      >
                    </v-col>
                    <v-col cols="1"></v-col>
                    <v-col cols="4">
                      <v-btn
                        color="success"
                        :loading="buttonLoading"
                        :disabled="disabled == 1"
                        x-large
                        @click="recaptcha()"
                        >Envoyer</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-col>
              </v-card-actions>
            </v-form>
          </v-card>
          <br />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { serviceLn } from "../../service/licencesnationales/LicencesNationalesApiService";
import { Logger } from "@/utils/Logger";

@Component
export default class FormReinitialisationPass extends Vue {
  jwtToken: string = "";
  disabled: number = 0;
  show1: boolean = false;
  token: string = "";
  tokenExpired: string = "initialisation";
  tokenrecaptchaValid: Promise<boolean> = this.$recaptchaLoaded();
  tokenrecaptcha: string = "";
  passContact: string = "";
  passContactRules = [
    (v: string) => !!v || "Le mot de passe du contact est obligatoire",
    (v: string) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        v
      ) || "Le mot de passe fourni n'est pas valide"
  ];
  confirmPassContact: string = "";
  confirmPassContactRules = [
    (v: string) => !!v || "Vous devez confirmer le mot de passe du contact"
  ];
  buttonLoading: boolean = false;
  alert: boolean = false;
  retourKo: boolean = false;
  message: string = "";

  get confirmPassContactRule() {
    return () =>
      this.confirmPassContact === this.passContact ||
      "Le mot de passe de confirmation n'est pas valide";
  }
  get loggedIn() {
    return this.$store.state.user.isLoggedIn;
  }

  mounted() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
    //this.token = this.$route.query.token;
    Logger.debug(JSON.stringify(this.token));
    this.jwtToken = window.location.href.substr(
      window.location.href.lastIndexOf("=") + 1
    );
    Logger.debug(JSON.stringify(this.jwtToken));
    this.tokenInvalide();
    //if (this.message === "Token invalide")
    //this.$router.push("/invalideTokenReinitialisationPass");
  }

  tokenInvalide() {
    serviceLn
      .checkToken({
        jwtToken: this.jwtToken
      })
      .then(() => {
        this.buttonLoading = false;
      })
      .catch(() => {
        this.tokenExpired = "true";
      });
    return this.tokenExpired;
  }

  async recaptcha() {
    // (optional) Wait until recaptcha has been loaded.
    await this.$recaptchaLoaded();

    // Execute reCAPTCHA with action "reinitialisationPass".
    this.tokenrecaptcha = await this.$recaptcha("reinitialisationPass");
    Logger.debug("token dans recaptcha() " + this.tokenrecaptcha);
    // Do stuff with the received token.
    this.validate();
  }

  validate(): void {
    this.alert = false;
    this.message = "";
    this.retourKo = false;

    if (this.tokenrecaptcha != null) {
      if (
        (this.$refs.formReinitialisationPass as Vue & {
          validate: () => boolean;
        }).validate()
      ) {
        this.reinitialisationPass();
      }
    }
  }

  reinitialisationPass(): void {
    this.buttonLoading = true;
    serviceLn
      .saveNewPassword({
        motDePasse: this.passContact,
        recaptcha: this.tokenrecaptcha,
        token: this.token
      })
      .then(response => {
        this.buttonLoading = false;
        this.message = response.data;
        this.alert = true;
        //this.$router.push({ name: "Home" });
      })
      .catch(err => {
        this.buttonLoading = false;
        this.message = err.response.data;
        this.alert = true;
        this.retourKo = true;
      });
  }

  clear() {
    (this.$refs.formReinitialisationPass as HTMLFormElement).reset();
  }
}
</script>
