<template>
  <div>
    <v-alert border="left" type="info" dense outlined>
      <h4>
        Application réservée aux établissements bénéficiaires
      </h4>
      <br />
      <p id="WarningLogin">
        <strong>Important : </strong>L'accès aux corpus sous licences nationales
        est reservé aux établissements bénéficiaires selon les conditions
        spécifiques négociées avec chaque éditeur. Pour permettre la déclaration
        des adresses IP autorisées, l'Abes met à la disposition des
        professionnels de la documentation cette application dédiée à la gestion
        des accès.
      </p>
    </v-alert>
    <v-card witdh="100%" outlined>
      <v-form ref="form" lazy-validation>
        <v-card-title>S'authentifier</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="1" />
            <v-col cols="10">
              <v-text-field
                ref="login"
                outlined
                label="SIREN"
                placeholder="SIREN"
                maxlength="9"
                v-model="siren"
                :rules="loginRules"
                append-icon="mdi-information"
                required
                @keyup="validate()"
              >
                <template v-slot:append>
                  <a
                    class="noUnderlineLink"
                    href="https://www.sirene.fr/sirene/public/static/recherche"
                    target="_blank"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on">
                          mdi-information
                        </v-icon>
                      </template>
                      Trouver le numéro SIREN de votre établissement
                    </v-tooltip>
                  </a></template
                >
              </v-text-field>
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
            <v-col>
              <v-btn
                color="button"
                style="float: right;"
                :loading="buttonLoading"
                :disabled="!isValid"
                @click="login()"
                >Se connecter
                <v-icon style="padding-left: 5px;"
                  >mdi-arrow-right-circle-outline
                </v-icon>
              </v-btn>
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
import { Component, Vue } from "vue-property-decorator";
import { HttpRequestError } from "@/exception/HttpRequestError";
import { Logger } from "@/utils/Logger";

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
        this.buttonLoading = false;
        this.alert = true;

        if (err instanceof HttpRequestError) {
          Logger.error(
            "Erreur HTTP : " + err.error + " sur la route " + err.path
          );
          this.error = "Erreur de requête : " + err.error;
        } else {
          Logger.error(err.message);
          this.error = err.message;
        }
      });
  }
}
</script>
<style src="./style.css"></style>
