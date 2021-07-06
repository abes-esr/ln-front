<template>
  <div>
    <v-card>
      <v-form ref="formModuleIpPlage" lazy-validation>
        <v-row>
          <v-col cols="1" />
          <v-col cols="10">
            <v-select
              ref="ipType"
              outlined
              v-model="typeIp"
              :items="typesIp"
              label="Type d'IP"
              :rules="typeIpRules"
              v-on:change="eventReinitialisationIpSegments()"
              @keyup.enter="validate()"
              required
            ></v-select>
          </v-col>
        </v-row>

        <module-segments-ip-plage></module-segments-ip-plage>

        <v-row>
          <v-col cols="1" />
          <v-col cols="10">
            <v-alert border="top" colored-border type="info" elevation="2">
              Si certaines des adresses renseignées ne font pas partie du réseau
              RENATER, merci de nous en préciser la raison.
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
              {{ value.commentaires.substring(0, 40) }}
            </v-col>
            <v-col class="shrink">
              <v-btn color="red" @click="suppIpFromArrayArrays(index)"
                >SUPPRIMER</v-btn
              >
            </v-col>
          </v-row>
          <v-row>
            <v-alert dense outlined :value="alertErrorIp" type="error">
              {{ value.error }}
            </v-alert>
          </v-row>
        </v-alert>

        <!--    <v-card-actions>
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
        </v-card-actions>-->
        <br />
        <v-alert dense outlined :value="alert" type="error">
          {{ error }}
        </v-alert>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { HTTP } from "../utils/http-commons";
import { mapActions, mapGetters } from "vuex";
import { AjouterAccesSubmitEvent, TypeIpChangeEvent } from "@/main";
import { IpChangeEvent } from "@/main";
import ModuleSegmentsIpPlage from "@/components/ModuleSegmentsIpPlage.vue";

export default Vue.extend({
  name: "AjouterAcces2",
  components: { ModuleSegmentsIpPlage },
  data() {
    return {
      moduleIpPlageNumber: 2,
      titleText: "" as string,
      alertText: "" as string,
      buttonAjouterText: "" as string,
      title2Text: "" as string,
      id: "",
      ip: "",
      typeAcces: "" as string,
      typeIp: "" as string,
      commentaires: "" as string,
      alertIp: true,
      alert: false,
      alertErrorIp: false,
      errorIp: "" as string,
      showButtonAjouterIp: false,
      error: "",
      arrayAjouterIp: [] as any,
      arrayArrays: [] as any,
      typesIp: ["IPV4", "IPV6"],
      typeIpRules: [(v: any) => !!v || "Le type d'IP est obligatoire"],
      buttonLoading: false
    };
  },

  mounted() {
    this.typeAcces = window.location.href.substr(
      window.location.href.lastIndexOf("/") + 1
    );
    this.typeIp = "IPV4";
    TypeIpChangeEvent.$emit("eventReinitialisationIpSegments", this.typeIp);
    this.setText();
    console.log(this.$refs);

    const onchangeIpHandler = ip => {
      this.ip = ip;
      console.log(`ip =  ` + ip);
    };
    IpChangeEvent.$on("ipChangeEvent", onchangeIpHandler);

    AjouterAccesSubmitEvent.$on("ajouterAccesSubmitEvent", this.ajouterIp);
    AjouterAccesSubmitEvent.$on("clear", this.clear);
    //this.busIpPlage.$on("clear", this.clear);
  },
  computed: {
    sirenEtabSiAdmin() {
      return this.$store.state.sirenEtabSiAdmin;
    },
    getUserSiren() {
      if (this.isAdmin === "true") return this.$store.state.sirenEtabSiAdmin;
      else return this.$store.state.user.siren;
    },
    isAdmin() {
      console.log("isAdmin = " + this.$store.state.user.isAdmin);
      return this.$store.state.user.isAdmin;
    }
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
        this.buttonAjouterText = "Ajouter l'ip saisie";
        this.title2Text = "Ips mémorisées avant envoi";
      } else {
        this.titleText = "Ajout de plage d'adresses IP";
        this.alertText =
          "Vous pouvez directement insérer une ou plusieurs adresses IP en effectuant un copier coller.";
        this.buttonAjouterText = "Ajouter la plage d'ips saisie";
        this.title2Text = "Plages d'ips mémorisées avant envoi";
      }
    },

    ajouterIp(): void {
      console.log("Validation");
      /*this.arrayAjouterIp.userSiren = this.getUserSiren;
      this.arrayAjouterIp.typeIp = this.typeIp;
      this.arrayAjouterIp.ip = this.ip;
      this.arrayAjouterIp.commentaires = this.commentaires;
      console.log(this.arrayAjouterIp);
      this.arrayArrays.push(this.arrayAjouterIp);
      console.log(this.arrayArrays.toString());*/
      console.log("v - " + this.typeIp);
      console.log("v - " + this.ip);
      console.log("v - " + this.commentaires);
      if (
        (this.$refs.formModuleIpPlage as Vue & {
          validate: () => boolean;
        }).validate()
      ) {
        this.$emit("formModuleIpSentEvent", {
          userSiren: this.getUserSiren,
          typeIp: this.typeIp,
          ip: this.ip,
          commentaires: this.commentaires
        });
      }
    },
    clear() {
      this.arrayAjouterIp = [];
      this.typeIp = "";
      this.ip = "";
      this.commentaires = "";
    },

    /*getUrl(typeIp) {
      if (this.typeAcces === "ip") {
        if (this.isAdmin === "true") {
          return typeIp === "IPV4" ? this.adminIpV4Url : this.adminIpV6Url;
        } else return typeIp === "IPV4" ? this.ipV4Url : this.ipV6Url;
      } else {
        if (this.isAdmin === "true")
          return typeIp === "IPV4"
            ? this.adminPlageIpV4Url
            : this.adminPlageIpV6Url;
        else return typeIp === "IPV4" ? this.plageIpV4Url : this.plageIpV6Url;
      }
    },*/

    suppIpFromArrayArrays: function(index) {
      this.arrayArrays.splice(index, 1);
      console.log(this.arrayArrays.toString());
      console.log(this.arrayArrays.length);
      this.alertErrorIp = false;
    },

    eventReinitialisationIpSegments: function(evt) {
      TypeIpChangeEvent.$emit("eventReinitialisationIpSegments", this.typeIp);
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
        this.typeIp = "IPV4";
        this.eventReinitialisationIpSegments("eventReinitialisationIpSegments");
      }
    }

    /*validate(): void {
      this.buttonLoading = true;
      this.arrayArrays.forEach((value, index) => {
        console.log("this.getUrl() = " + this.getUrl(value.typeIp));
        HTTP.post(this.getUrl(value.typeIp), {
          siren: this.getUserSiren,
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
            console.log("err.response.data " + err.response.data);
            this.errorIp = err.response.data;
            value.error = err.response.data;
            this.alertErrorIp = true;
          });
      });
    }*/
  }
});
</script>

<style scoped></style>
//repeat a form vuejs
//https://stackoverflow.com/questions/51133782/vuejs-add-the-same-form-multiple-times
