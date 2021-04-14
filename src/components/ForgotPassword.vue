<template>
  <div>
    <v-card witdh="100%">
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
          <v-col cols="9"></v-col>
          <v-col cols="2">
            <v-btn
              color="success"
              :loading="buttonLoading"
              x-large
              @click="validate()"
              >Envoyer</v-btn
            >
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
    <br />
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from "vue";
import axios from "axios";

export default Vue.extend({
  name: "ForgotPassword",
  data() {
    return {
      siren: "" as string,
      sirenRules: [
        (v: any) => !!v || "SIREN obligatoire",
        (v: any) => /^\d{9}$/.test(v) || "Le SIREN doit contenir 9 chiffres"
      ],
      mailRules: [
        (v: any) => !!v || "Adresse mail obligatoire",
        (v: any) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "Adresse mail invalide"
      ],
      mail: "" as string,
      sirenRadio: true,
      buttonLoading: false,
      alert: false,
      alertOK: false,
      retourKo: false,
      message: ""
    };
  },
  methods: {
    validate(): void {
      this.alert = false;
      this.message = "";
      this.retourKo = false;
      if (this.sirenRadio) {
        if (
          (this.$refs.formSIREN as Vue & { validate: () => boolean }).validate()
        )
          console.log;
        axios
          .post(
            process.env.VUE_APP_ROOT_API +
              "ln/reinitialisationMotDePasse/resetPassword",
            {
              siren: this.siren
            }
          )
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
        if (
          (this.$refs.formMail as Vue & { validate: () => boolean }).validate()
        )
          console.log;
        axios
          .post(
            process.env.VUE_APP_ROOT_API +
              "ln/reinitialisationMotDePasse/resetPassword",
            {
              email: this.mail
            }
          )
          .then(response => {
            this.message = response.data;
            this.alert = true;
          })
          .catch(err => {
            this.buttonLoading = false;
            this.message = err.response.data;
            this.alert = true;
          });
      }
    }
  }
});
</script>
<style scoped></style>
