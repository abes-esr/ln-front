<template>
  <div>
    <v-card width="100%">
      <v-form ref="formAjouterAcces" lazy-validation>
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
                    @keyup.enter="buttonAjouterIp()"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-text-field
                    outlined
                    label="?"
                    placeholder="acces"
                    v-model="ip"
                    :rules="this.getIpRules()"
                    required
                    @keyup.enter="buttonAjouterIp()"
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
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-card-actions>
                    <v-btn
                      color="orange"
                      v-model="showButtonAjouterIp"
                      @click="buttonAjouterIp()"
                      >{{ buttonAjouterText }}
                    </v-btn>
                  </v-card-actions>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-card-title v-if="arrayArrays.length > 0">{{
                    title2Text
                  }}</v-card-title>
                  <v-alert
                    v-model="alertIp"
                    border="left"
                    color="yellow accent-1"
                    icon="mdi-school"
                    v-for="(value, index) in arrayArrays"
                    v-bind:key="index"
                  >
                    <v-row align="center">
                      <v-col class="grow">
                        {{ value.typeIp }}
                        {{ value.ip }}
                        {{ value.commentaires.substring(1, 40) }}
                      </v-col>
                      <v-col class="shrink">
                        <v-btn color="red" @click="suppIpFromArrayArrays(index)"
                          >SUPPRIMER</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-alert>
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
                v-if="arrayArrays.length > 0"
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
  name: "AjouterAcces",
  data() {
    return {
      titleText: "" as string,
      alertText: "" as string,
      labelIp: "" as string,
      buttonAjouterText: "" as string,
      title2Text: "" as string,
      id: "",
      ip: "",
      typeAcces: "" as any,
      typeIp: "" as any,
      commentaires: "",
      alertIp: true,
      alert: false,
      showButtonAjouterIp: false,
      error: "",
      arrayAjouterIp: [] as any,
      arrayArrays: [] as any,
      arrayIpNumber: 2,
      ipV4Url: "/ln/ip/ajoutIpV4" as any,
      ipV6Url: "/ln/ip/ajoutIpV6" as any,
      plageIpV4Url: "/ln/ip/ajoutPlageIpV4" as any,
      plageIpV6Url: "/ln/ip/ajoutPlageIpV6" as any,
      typesIp: ["IPV4", "IPV6"],
      typeIpRules: [(v: any) => !!v || "Le type d'IP est obligatoire"],
      ipRules: "" as any,
      ipV4Rules: [
        (v: any) => !!v || "L'IP est obligatoire",
        (v: any) =>
          /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
            v
          ) || "L'IP fournie n'est pas valide" // cf https://stackoverflow.com/a/47959401
      ],
      ipV6Rules: [
        (v: any) => !!v || "L'IP est obligatoire",
        (v: any) =>
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
  mounted() {
    this.typeAcces = window.location.href.substr(
      window.location.href.lastIndexOf("/") + 1
    );
    this.setText();
  },

  computed: {
    ...mapGetters(["userSiren"])
  },

  methods: {
    ...mapActions({
      setNotification: "setNotification"
    }),
    setText(): void {
      if (this.typeAcces === "ip") {
        this.titleText = "Ajout d'adresse IP";
        this.alertText =
          "Vous pouvez directement insérer une adresse IP en effectuant un copier coller.";
        this.labelIp = "Saisissez votre adresse ip";
        this.buttonAjouterText = "Ajouter l'ip saisie";
        this.title2Text = "Ips mémorisées avant envoi";
      } else {
        this.titleText = "Ajout de plage d'adresses IP";
        this.alertText =
          "Vous pouvez directement insérer une ou plusieurs adresses IP en effectuant un copier coller.";
        this.labelIp = "Saisissez votre plage d'adresses ip";
        this.buttonAjouterText = "Ajouter la plage d'ips saisie";
        this.title2Text = "Plages d'ips mémorisées avant envoi";
      }
    },
    ajouterIp(): void {
      this.arrayAjouterIp.userSiren = this.userSiren;
      this.arrayAjouterIp.typeIp = this.typeIp;
      this.arrayAjouterIp.ip = this.ip;
      this.arrayAjouterIp.commentaires = this.commentaires;
      console.log(this.arrayAjouterIp);
      this.arrayArrays.push(this.arrayAjouterIp);
      console.log(this.arrayArrays.toString());
      this.arrayAjouterIp = [];
      this.typeIp = "";
      this.ip = "";
      this.commentaires = "";
      console.log(this.arrayAjouterIp);
      console.log(this.arrayArrays);
    },
    getIpRules() {
      if (this.typeAcces === "ip") {
        return this.typeIp === "IPV4" ? this.ipV4Rules : this.ipV6Rules;
      } else
        return this.typeIp === "IPV4"
          ? this.plageIpV4Rules
          : this.plageIpV6Rules;
    },
    getUrl() {
      if (this.typeAcces === "ip") {
        return this.typeIp === "IPV4" ? this.ipV4Url : this.ipV6Url;
      } else
        return this.typeIp === "IPV4" ? this.plageIpV4Url : this.plageIpV6Url;
    },

    clearIp(): void {
      this.ip = "";
    },
    suppIpFromArrayArrays(index): void {
      this.arrayArrays.splice(index);
      console.log(this.arrayArrays.toString());
      console.log(this.arrayArrays.length);
    },
    buttonAjouterIp(): void {
      this.error = "";
      this.alert = false;
      this.showButtonAjouterIp = false;
      if (
        (this.$refs.formAjouterAcces as Vue & {
          validate: () => boolean;
        }).validate()
      ) {
        this.showButtonAjouterIp = true;
        this.ajouterIp();
      }
    },

    validate(): void {
      this.buttonLoading = true;
      console.log(this.typeIp);
      this.arrayArrays.forEach((value, index) => {
        if (value.typeIp === "IPV4") this.url = "/ln/ip/ajoutIpV4";
        else this.url = "/ln/ip/ajoutIpV6";
        HTTP.post(this.url, {
          siren: this.userSiren,
          ip: value.ip,
          typeAcces: this.typeAcces,
          typeIp: value.typeIp,
          commentaires: value.commentaires
        })
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
      });
    }
  }
});
</script>

/*submitAcces(): void { HTTP.post(this.url, { siren: this.userSiren, ip:
this.ip, typeAcces: this.typeAcces, typeIp: this.typeIp, commentaires:
this.commentaires }) .then(response => { this.buttonLoading = false;
console.log("notification = " + response.data);
this.setNotification(response.data); console.log("notification = " +
this.$store.state.notification); this.$router.push({ path: "/listeAcces" }); })
.catch(err => { this.buttonLoading = false; this.error = err.response.data;
this.alert = true; }); }*/

<style scoped></style>
//repeat a form vuejs
//https://stackoverflow.com/questions/51133782/vuejs-add-the-same-form-multiple-times
