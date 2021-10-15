<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col lg="5" md="8" xs="10">
        <div>
          <v-card v-if="tokenValid">
            <v-alert dense outlined type="error">
              La durée de validité de ce lien est dépassée. Mot de passe oublié
              :
              <router-link :to="{ path: 'forgotPassword' }"
                >cliquez ici
              </router-link>
            </v-alert>
          </v-card>
          <v-card witdh="100%" outlined v-else>
            <v-form ref="formReinitialisationPass" lazy-validation>
              <v-card-title
                >Réinitialisation de votre mot de passe
              </v-card-title>
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
                      :disabled="disabled === 1"
                      v-model="passContact"
                      :rules="this.rules.passwordRules"
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
                      :disabled="disabled === 1"
                      v-model="confirmPassContact"
                      :rules="
                        this.rules.confirmPassContactRules.concat(
                          confirmPassContactRule
                        )
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
                  <v-col cols="10"></v-col>
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
                        :disabled="disabled === 1"
                        >Effacer
                      </v-btn>
                    </v-col>
                    <v-col cols="1"></v-col>
                    <v-col cols="4">
                      <v-btn
                        color="success"
                        :loading="buttonLoading"
                        :disabled="disabled === 1"
                        x-large
                        @click="recaptcha()"
                        >Envoyer
                      </v-btn>
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
import { Logger } from "@/utils/Logger";
import { LicencesNationalesUnauthorizedApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesUnauthorizedApiError";
import { authService } from "@/core/service/licencesnationales/AuthentificationService";
import { rulesForm } from "@/service/RulesForm";

@Component
export default class FormReinitialisationPass extends Vue {
  rules = new rulesForm();
  resetToken: string = "";
  disabled: number = 0;
  show1: boolean = false;
  tokenValid: boolean = true;
  tokenrecaptchaValid: Promise<boolean> = this.$recaptchaLoaded();
  tokenrecaptcha: string = "";
  passContact: string = "";
  confirmPassContact: string = "";
  buttonLoading: boolean = false;
  alert: boolean = false;
  retourKo: boolean = false;
  message: string = "";

  mounted() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }

    this.resetToken = window.location.href.substr(
      window.location.href.lastIndexOf("=") + 1
    );

    this.isTokenValid
      .then(result => {
        this.tokenValid = result;
      })
      .catch(() => {
        this.tokenValid = false;
      });
  }

  get confirmPassContactRule() {
    return () =>
      this.confirmPassContact === this.passContact ||
      "Le mot de passe de confirmation n'est pas valide";
  }

  get loggedIn() {
    return this.$store.state.user.isLoggedIn;
  }

  get isTokenValid(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.alert = false;
      authService
        .verifierValiditeToken({
          token: this.resetToken
        })
        .then(response => {
          this.buttonLoading = false;
          resolve(response.estValid);
        })
        .catch(err => {
          this.buttonLoading = false;
          this.alert = true;
          this.retourKo = true;

          if (err instanceof LicencesNationalesUnauthorizedApiError) {
            this.message =
              "Vous n'êtes pas autorisé à effectuer cette opération.: " +
              err.message;
            Logger.error(err.toString());
          } else {
            Logger.error(err.toString());
            this.message = "Impossible d'exécuter l'action : " + err.message;
          }
          reject(false);
        });
    });
  }

  async recaptcha() {
    // (optional) Wait until recaptcha has been loaded.
    await this.$recaptchaLoaded();

    // Execute reCAPTCHA with action "reinitialisationPass".
    this.tokenrecaptcha = await this.$recaptcha("reinitialisationPass");
    Logger.debug("getToken dans recaptcha() " + this.tokenrecaptcha);
    // Do stuff with the received getToken.
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
    this.alert = false;
    authService
      .reinitialiserMotDePasse({
        nouveauMotDePasse: this.passContact,
        recaptcha: this.tokenrecaptcha,
        token: this.resetToken
      })
      .then(response => {
        this.buttonLoading = false;
        this.message = response.message;
        this.alert = true;
        setTimeout(() => {
          this.$router.push({ name: "Login" });
        }, 2000);
      })
      .catch(err => {
        this.buttonLoading = false;
        this.alert = true;
        this.retourKo = true;

        if (err instanceof LicencesNationalesUnauthorizedApiError) {
          this.message =
            "Vous n'êtes pas autorisé à effectuer cette opération.: " +
            err.message;
          Logger.error(err.toString());
        } else {
          Logger.error(err.toString());
          this.message = "Impossible d'exécuter l'action : " + err.message;
        }
      });
  }

  clear() {
    (this.$refs.formReinitialisationPass as HTMLFormElement).reset();
  }
}
</script>
