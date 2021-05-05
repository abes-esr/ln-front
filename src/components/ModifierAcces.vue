<template>
  <div>
    <v-card width="100%">
      <v-form ref="formModifierAcces" lazy-validation>
        <v-row align="center" justify="center">
          <v-col lg="6" md="12" xs="12">
            <v-row>
              <v-col cols="1" />
              <v-col cols="10">
                <v-card-title>Modifier mon ip</v-card-title>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-card-text>
          <v-row align="center" justify="center">
            <v-col lg="6" md="12" xs="12">
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-alert border="left" color="grey" dark>
                    Vous pouvez directement insérer une adresse IP en effectuant un copier coller.
                  </v-alert>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-select
                      outlined
                      v-model="typeIp"
                      :items="typesIp"
                      label="Type d'IP"
                      :rules="typeIpRules"
                      required
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-text-field
                    outlined
                    label="Saisissez votre adresse ip"
                    placeholder="acces"
                    v-model="ip"
                    :rules="ipRules"
                    required
                    @keyup.enter="validate()"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-alert
                      border="top"
                      colored-border
                      type="info"
                      elevation="2"
                  >
                    Si certaines des adresses renseignées ne font pas partie du réseau RENATER, merci de nous en préciser la raison.
                  </v-alert>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-text-field
                    outlined
                    label="Commentaires"
                    placeholder="Si certaines des adresses renseignées ne font pas partie du réseau RENATER, merci de nous en préciser la raison."
                    v-model="commentaires"
                    :rules="commentairesRules"
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
      typeIp: "",
      ip: "",
      commentaire: "",
      jsonResponse: {},
      alert: false,
      error: "",

      typesIp: [
        "IPV4",
        "IPV6"
      ],
      typeIpRules: [
        (v: never) => !!v || "Le type d'IP' est obligatoire"
      ],
      ipRules: [
        (v: never) => !!v || "L'IP' est obligatoire"
      ],
      buttonLoading: false
    };
  },
  computed: mapGetters(["userSiren"]),
  mounted() {
    this.fetchIp();
  },
  methods: {
    validate(): void {
      this.error = "";
      this.alert = false;
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        this.buttonLoading = true;
        this.submitAcces();
      }
    },
    fetchIp(): void {
      HTTP.get("/ln/ip/" + this.userSiren)
        .then(result => {
          this.typeIp = result.data.typeip;
          this.ip = result.data.contact.ip;
        })
        .catch(err => {
          this.alert = true;
          this.error = err;
        });
    },
    submitAcces(): void {
      this.updateJsonObject();
      console.log(this.jsonResponse);
      HTTP.post("/ln/ip/modification", this.jsonResponse)
        .then(() => {
          this.buttonLoading = false;
          this.$router.push({ name: "Home" });
        })
        .catch(err => {
          this.buttonLoading = false;
          this.alert = true;
          this.error = err;
        });
    },
    updateJsonObject(): void {
      const json: any = {};
      json.adresseContact = this.adresse;
      json.boitePostaleContact = this.bp;
      json.cedexContact = this.cedex;
      json.codePostalContact = this.codePostal;
      json.mailContact = this.mail;
      json.nomContact = this.nomContact;
      json.prenomContact = this.prenomContact;
      json.siren = this.userSiren;
      json.telephoneContact = this.telephone;
      json.villeContact = this.ville;
      this.jsonResponse = json;
    }
  }
});
</script>

<style scoped></style>
