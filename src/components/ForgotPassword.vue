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
      buttonLoading: false
    };
  },
  methods: {
    validate(): void {
      if (this.sirenRadio) {
        if (
          (this.$refs.formSIREN as Vue & { validate: () => boolean }).validate()
        )
          console.log;
        axios
            .post(process.env.VUE_APP_ROOT_API + "/ln/reinitialisationMotDePasse/resetPasswordBySiren", {
              siren: this.siren
            })
            .then(() => {
              this.$router.push({ name: "home" });
            })
            .catch(err => {
              this.buttonLoading = false;
            });
      } else {
        if (
          (this.$refs.formMail as Vue & { validate: () => boolean }).validate()
        )
          console.log;
        axios
            .post(process.env.VUE_APP_ROOT_API + "/ln/reinitialisationMotDePasse/resetPasswordByMail", {
              email: this.mail
            })
            .then(() => {
              this.$router.push({ name: "home" });
            })
            .catch(err => {
              this.buttonLoading = false;
            });
        }
    }
  }
});
</script>
<style scoped></style>
