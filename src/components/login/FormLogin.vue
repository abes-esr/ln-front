<template>
  <div>
    <v-card witdh="100%" outlined>
      <v-form ref="form" lazy-validation>
        <v-card-title>Connexion</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="1" />
            <v-col cols="10">
              <v-text-field
                ref="login"
                outlined
                label="SIREN"
                placeholder="SIREN"
                v-model="siren"
                :rules="loginRules"
                required
                @keyup="validate()"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="1" />
            <v-col cols="10">
              <v-text-field
                ref="password"
                outlined
                label="Mot de passe"
                placeholder="Mot de passe"
                :type="show ? 'text' : 'password'"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                v-model="password"
                :rules="passwordRules"
                required
                @click:append="show = !show"
                @keyup="validate()"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col cols="9"></v-col>
            <v-col cols="2">
              <v-btn
                color="success"
                :loading="buttonLoading"
                :disabled="!isValid"
                x-large
                @click="login()"
                >Envoyer</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-form>
    </v-card>
    <br />
    <v-alert dense outlined :value="alert" type="error">
      {{ error }}
    </v-alert>
    <v-alert dense outlined :value="creationCompteEffectuee" type="success">
      {{ notification }}
    </v-alert>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {HttpRequestError} from "@/exception/HttpRequestError";
import {Logger} from "@/utils/Logger";

@Component
export default class FormLogin extends Vue {
  siren: string = "";
  loginRules = [
    (v: string) => !!v || "SIREN obligatoire",
    (v: string) => /^\d{9}$/.test(v) || "Le SIREN doit contenir 9 chiffres"
  ];
  passwordRules = [(v: string) => !!v || "Mot de passe obligatoire"];
  password: string = "";
  buttonLoading: boolean = false;
  isValid: boolean = false;
  alert: boolean = false;
  error: string = "";
  notification: string = "";
  show: boolean = false;
  creationCompteEffectuee: boolean = false;

  validate(): void {
    this.alert = false;
    this.error = "";

    if (
      (this.$refs.login as Vue & { valid: () => boolean }).valid &&
      (this.$refs.password as Vue & { valid: () => boolean }).valid
    ) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }

  login(): void {
    this.buttonLoading = true;

    this.$store
      .dispatch("login", {
        login: this.siren,
        password: this.password
      })
      .then(() => {
        this.$router.push({ name: "Home" });
      })
      .catch(err => {
        Logger.error(err.message);
        if (err instanceof HttpRequestError) {
          Logger.debug("Erreur API : " + err.debugMessage);
        }
        this.buttonLoading = false;
        this.error = err.message;
        this.alert = true;
      });
  }
}
</script>
