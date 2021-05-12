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
                    Vous pouvez directement insérer une adresse IP en effectuant
                    un copier coller.
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
                    v-on:change="clearIp()"
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
                    :rules="this.getIpRules()"
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
                    Si certaines des adresses renseignées ne font pas partie du
                    réseau RENATER, merci de nous en préciser la raison.
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
import { mapActions, mapGetters } from "vuex";
import moment from "moment";

export default Vue.extend({
  name: "ModifierAcces",
  data() {
    return {
      id: "",
      ip: "" as string,
      valide: "",
      dateCreation: "",
      dateModification: "",
      typeAcces: "",
      typeIp: "",
      commentaires: "",
      jsonResponse: {},
      alert: false,
      error: "",

      typesIp: ["IPV4", "IPV6"],
      typeIpRules: [(v: never) => !!v || "Le type d'IP est obligatoire"],
      ipRules: "" as any,
      ipV4Rules: [
        (v: never) => !!v || "L'IP est obligatoire",
        (v: never) =>
          /\b((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\.)){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\b/.test(
            v
          ) || "L'IP fournie n'est pas valide" //regex qui filtre le texte parasite au cas où : cf https://stackoverflow.com/a/53442371
      ],
      ipV6Rules: [
        (v: never) => !!v || "L'IP est obligatoire",
        (v: never) =>
          /^\s*(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\s*$/.test(
            v
          ) || "L'IP fournie n'est pas valide" // cf https://stackoverflow.com/a/17871737
      ],
      buttonLoading: false
    };
  },
  computed: {
    ...mapGetters(["userSiren"])
  },
  mounted() {
    //this.ip=this.getIp(id);
    moment.locale("fr");
    this.dateModification = moment().format("L");
    this.dateModification += " " + moment().format("LTS,MS");
    console.log("dateModification = " + this.dateModification);
    this.id = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    console.log("lastindex = " + window.location.href.substr(window.location.href.lastIndexOf('/') + 1));
    this.fetchIp();
    console.log(this.id);
  },
  methods: {
    ...mapActions({
      setNotification: "setNotification"
    }),
    fetchIp(): void {
      HTTP.post("/ln/ip/getIpEntity", {
        id: this.id,
        siren: this.userSiren
      })
        .then(result => {
          this.id = result.data.id;
          this.ip = result.data.ip;
          this.valide = result.data.validee;
          this.dateCreation = result.data.dateCreation;
          this.dateModification = result.data.dateModification;
          this.typeAcces = result.data.typeAcces;
          this.typeIp = result.data.typeIp;
          this.commentaires = result.data.commentaires;
        })
        .catch(err => {
          this.alert = true;
          this.error = err;
        });
    },
    getIpRules() {
      if (this.typeIp === "IPV4") {
        console.log(this.ipV4Rules);
        return this.ipV4Rules;
      } else {
        console.log(this.ipV6Rules);
        return this.ipV6Rules;
      }
    },
    clearIp(): void {
      this.ip = "";
    },
    validate(): void {
      this.error = "";
      this.alert = false;
      if (
        (this.$refs.formModifierAcces as Vue & {
          validate: () => boolean;
        }).validate()
      ) {
        this.buttonLoading = true;
        this.submitAcces();
      }
    },
    submitAcces(): void {
      this.updateJsonObject();
      console.log(this.jsonResponse);
      HTTP.post("/ln/ip/modification", this.jsonResponse)
        .then(response => {
          this.buttonLoading = false;
          console.log("notification = " + response.data);
          this.setNotification(response.data);
          console.log("notification = " + this.$store.state.notification);
          this.$router.push({ path: "/listeAcces" });
        })
        .catch(err => {
          this.buttonLoading = false;
          this.error = err.response.data;
          this.alert = true;
        });
    },

    updateJsonObject(): void {
      const json: any = {};
      json.id = this.id;
      json.ip = this.ip;
      json.validee = 0;
      json.dateCreation = this.dateCreation;
      //json.dateModification = this.setDateModification();
      json.typeAcces = this.typeAcces;
      json.typeIp = this.typeIp;
      json.siren = this.userSiren;
      json.commentaires = this.commentaires;
      this.jsonResponse = json;
    },

    getIp(id) {
      return HTTP.get(`/ln/ip/${id}`);
    },
    setDateModification() {
      moment.locale("fr");
      this.dateModification = moment().format("L");
      this.dateModification += " " + moment().format("LTS,MS");
      console.log("dateModification = " + this.dateModification);
    }
  }
});
</script>

<style scoped></style>
