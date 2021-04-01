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
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-text-field
                    outlined
                    label="Téléphone"
                    placeholder="Téléphone"
                    v-model="telephone"
                    :rules="telRules"
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
    <br />
    <v-alert dense outlined :value="alert" type="error">
      {{ error }}
    </v-alert>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from "vue";
import { HTTP } from "../utils/http-commons";
import { mapGetters } from "vuex";

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
      telephone: "",
      jsonResponse: {},
      idContact: "",
      idAbes: "",
      alert: false,
      error: "",

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
      telRules: [
        (v: any) => !!v || "Champ obligatoire",
        (v: any) =>
          /^[\d]*$/.test(v) ||
          "Le téléphone doit être composé de chiffres uniquement"
      ],
      buttonLoading: false
    };
  },
  computed: mapGetters(["userSiren"]),
  mounted() {
    this.fetchEtab();
  },
  methods: {
    validate(): void {
      this.error = "";
      this.alert = false;
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        this.buttonLoading = true;
        this.submitProfil();
      }
    },
    fetchEtab(): void {
      HTTP.get("/ln/etablissement/" + this.userSiren)
        .then(result => {
          this.idAbes = result.data.idAbes;
          this.idContact = result.data.contact.id;
          this.mail = result.data.contact.mail;
          this.nomContact = result.data.contact.nom;
          this.prenomContact = result.data.contact.prenom;
          this.adresse = result.data.contact.adresse;
          this.bp = result.data.contact.boitePostal;
          this.codePostal = result.data.contact.codePostal;
          this.cedex = result.data.contact.cedex;
          this.ville = result.data.contact.ville;
          this.telephone = result.data.contact.telephone;
        })
        .catch(err => {
          this.alert = true;
          this.error = err;
        });
    },
    submitProfil(): void {
      this.updateJsonObject();
      console.log(this.jsonResponse);
      HTTP.post("/ln/etablissement/modification", this.jsonResponse)
        .then(() => {
          this.buttonLoading = false;
          this.$router.push({ name: "home" });
        })
        .catch(err => {
          this.buttonLoading = false;
          this.alert = true;
          this.error = err;
        });
    },
    updateJsonObject(): void {
      /*this.jsonResponse.mailContact = this.mail;
      this.jsonResponse.nomContact = this.nomContact;
      this.jsonResponse.prenomContact = this.prenomContact;
      this.jsonResponse.adresseContact = this.adresse;
      this.jsonResponse.boitePostaleContact = this.bp;
      this.jsonResponse.codePostalContact = this.codePostal;
      this.jsonResponse.cedexContact = this.cedex;
      this.jsonResponse.villeContact = this.ville;
      this.jsonResponse.telephoneContact = this.telephone;
      this.jsonResponse.idContact = this.idContact;
      this.jsonResponse.idAbes = this.idAbes;*/
    }
  }
});
</script>

<style scoped></style>
