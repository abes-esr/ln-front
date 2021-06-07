<template>
  <div>
    <v-card width="100%">
      <v-form ref="formModifierAcces" lazy-validation>
        <v-row align="center" justify="center">
          <v-col lg="6" md="12" xs="12">
            <v-row>
              <v-col cols="1" />
              <v-col cols="10">
                <v-card-title>{{ titleText }}</v-card-title>
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
                    {{ alertText }}
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
                    v-bind:label="this.labelIp"
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
                  <v-textarea
                    outlined
                    auto-grow
                    label="Commentaires"
                    placeholder="Si certaines des adresses renseignées ne font pas partie du réseau RENATER, merci de nous en préciser la raison."
                    v-model="commentaires"
                  ></v-textarea>
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
      params: "" as any,
      titleText: "" as string,
      alertText: "" as string,
      labelIp: "" as string,
      id: "",
      ip: "" as string,
      valide: "",
      typeAcces: "",
      typeIp: "",
      commentaires: "",
      jsonResponse: {},
      alert: false,
      error: "",
      ipV4Url: "/ln/ip/modifIpV4" as string,
      ipV6Url: "/ln/ip/modifIpV6" as string,
      plageIpV4Url: "/ln/ip/modifPlageIpV4" as string,
      plageIpV6Url: "/ln/ip/modifPlageIpV6" as string,
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
      plageIpV4Rules: [
        (v: any) => !!v || "La plage d'Ips est obligatoire",
        (v: any) =>
          /^(([(\d+)(x+)]){1,3})?\.(([(\d+)(x+)]){1,3})?\.(([(\d+)(x+)]){1,3})(-+([(\d+)(x)]{1,3}))\.(([(\d+)(x+)]){1,3})(-+([(\d+)(x)]{1,3}))$/.test(
            v
          ) || "La plage d'Ips fournie n'est pas valide" //regex qui filtre le texte parasite au cas où : cf https://stackoverflow.com/a/53442371
      ],
      plageIpV6Rules: [
        (v: any) => !!v || "La plage d'Ips est obligatoire",
        (v: any) =>
          /^\s*((([0-9a-fA-F]{1,4}:){6,6}[0-9a-fA-F]{1,4}-[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}-[0-9a-fA-F]{1,4}))s*$/.test(
            v
          ) || "La plage d'Ips fournie n'est pas valide" // cf https://stackoverflow.com/a/17871737
      ],
      buttonLoading: false
    };
  },
  computed: {
    ...mapGetters(["userSiren"])
  },
  mounted() {
    this.id = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1,
      window.location.href.lastIndexOf("&")
    );
    this.typeAcces = window.location.href.substr(
      window.location.href.lastIndexOf("&") + 1
    );
    this.setText();
    console.log("this.id = " + this.id);
    console.log("this.typeAcces = " + this.typeAcces);
    this.fetchIp();
    console.log(this.id);
  },
  methods: {
    ...mapActions({
      setNotification: "setNotification"
    }),
    setText(): void {
      if (this.typeAcces === "ip") {
        this.titleText = "Modifier mon ip";
        this.alertText =
          "Vous pouvez directement insérer une adresse IP en effectuant un copier coller.";
        this.labelIp = "Saisissez votre adresse ip";
      } else {
        this.titleText = "Modifier ma plage d'adresses IP";
        this.alertText =
          "Vous pouvez directement insérer une ou plusieurs adresses IP en effectuant un copier coller.";
        this.labelIp = "Saisissez votre plage d'adresses ip";
      }
    },
    fetchIp(): void {
      console.log("id = " + this.id);
      HTTP.post("/ln/ip/getIpEntity", {
        id: this.id,
        siren: this.userSiren
      })
        .then(result => {
          this.id = result.data.id;
          this.ip = result.data.ip;
          this.valide = result.data.validee;
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
      if (this.typeAcces === "ip") {
        return this.typeIp === "IPV4" ? this.ipV4Rules : this.ipV6Rules;
      } else
        return this.typeIp === "IPV4"
          ? this.plageIpV4Rules
          : this.plageIpV6Rules;
    },
    getUrl(typeIp) {
      if (this.typeAcces === "ip") {
        return typeIp === "IPV4" ? this.ipV4Url : this.ipV6Url;
      } else return typeIp === "IPV4" ? this.plageIpV4Url : this.plageIpV6Url;
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
      HTTP.post(this.getUrl(this.typeIp), this.jsonResponse)
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
      json.typeAcces = this.typeAcces;
      json.typeIp = this.typeIp;
      json.siren = this.userSiren;
      json.commentaires = this.commentaires;
      this.jsonResponse = json;
    }
  }
});
</script>

<style scoped></style>
