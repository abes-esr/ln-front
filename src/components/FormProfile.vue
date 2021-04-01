<template>
  <div>
    <v-card width="100%">
      <v-form ref="form" lazy-validation>
        <v-card-title>Modifier mes informations</v-card-title>
        <v-card-text>
          <v-row>
            <v-col lg="6" md="12" xs="12">
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-text-field
                    outlined
                    label="Mail de contact"
                    placeholder="Mail de contact"
                    v-model="mail"
                    :rules="mailRules"
                    required
                    @keyup.enter="validate()"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-text-field
                    outlined
                    label="Nom"
                    placeholder="Nom"
                    v-model="nomContact"
                    :rules="nomRules"
                    required
                    @keyup.enter="validate()"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-text-field
                    outlined
                    label="Prénom"
                    placeholder="Prénom"
                    v-model="prenomContact"
                    :rules="nomRules"
                    required
                    @keyup.enter="validate()"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col lg="6" md="12" xs="12">
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-text-field
                    outlined
                    label="Adresse"
                    placeholder="Adresse"
                    v-model="adresse"
                    :rules="adrRules"
                    required
                    @keyup.enter="validate()"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-text-field
                    outlined
                    label="Code Postal"
                    placeholder="Code Postal"
                    v-model="codePostal"
                    :rules="cpRules"
                    required
                    @keyup.enter="validate()"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-text-field
                    outlined
                    label="Ville"
                    placeholder="Ville"
                    v-model="ville"
                    :rules="villeRules"
                    required
                    @keyup.enter="validate()"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-text-field
                    outlined
                    label="CEDEX"
                    placeholder="CEDEX"
                    v-model="cedex"
                    required
                    @keyup.enter="validate()"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-text-field
                    outlined
                    label="Boite Postal"
                    placeholder="Boite Postal"
                    v-model="bp"
                    required
                    @keyup.enter="validate()"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col cols="10"></v-col>
            <v-col>
              <v-btn
                color="success"
                :loading="buttonLoading"
                x-large
                @click="validate()"
                >Envoyer</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions></v-form
      >
    </v-card>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from "vue";
import { HTTP } from "../utils/http-commons";

export default Vue.extend({
  name: "FormProfile",
  data() {
    return {
      adresse: "",
      codePostal: "",
      ville: "",
      bp: "",
      cedex: "",
      mail: "",
      nomContact: "",
      prenomContact: "",

      nomRules: [(v: any) => !!v || "Champ obligatoire"],
      adrRules: [
        (v: any) => !!v || "Champ obligatoire",
        (v: any) => (v && v.length >= 10) || "Adresse trop courte"
      ],
      villeRules: [
        (v: any) => !!v || "Champ obligatoire",
        (v: any) => (v && v.length >= 2) || "Ville trop courte"
      ],
      mailRules: [
        (v: any) => !!v || "Champ obligatoire",
        (v: any) => /.+@.+\..+/.test(v) || "Adresse mail non valide"
      ],
      cpRules: [
        (v: any) => !!v || "Champ obligatoire",
        (v: any) =>
          /[\d]{5}/.test(v) || "Le code postal doit être composé de 5 chiffres"
      ],

      buttonLoading: false
    };
  },
  mounted() {
    this.fetchEtab();
  },
  methods: {
    validate(): void {
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        this.buttonLoading = true;
        HTTP.post("/Etablissement/modification")
          .then(result => {
            this.buttonLoading = false;
            console.log(result);
          })
          .catch(err => {
            this.buttonLoading = false;
            console.log(err);
          });
      }
    },
    fetchEtab(): void {
      HTTP.get("/Etablissement/")
        .then(result => {
          console.log(result);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
});
</script>

<style scoped></style>
