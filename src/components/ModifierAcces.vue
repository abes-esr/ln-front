<template>
  <div>
    <v-card width="100%" outlined>
      <v-form ref="formModifierAcces" lazy-validation>
        <v-row align="center" justify="center">
          <v-col lg="12" md="12" xs="12">
            <v-row>
              <v-col cols="1" />
              <v-col cols="10">
                <v-card-title>{{ titleText }}</v-card-title>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row align="center" justify="center">
          <v-col lg="9" md="12" xs="12">
            <v-row>
              <v-col cols="1" />
              <v-col cols="10">
                <v-alert border="left" color="grey" dark>
                  {{ alertText }}
                </v-alert>
              </v-col>
            </v-row>
            <!--              <v-row>
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
                    required
                  ></v-select>
                </v-col>
              </v-row>-->
            <v-row>
              <v-col cols="1" />
              <v-col cols="10">
                <v-text-field
                  outlined
                  v-bind:label="this.labelIp"
                  placeholder="acces"
                  v-model="ipToModify"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>

            <module-segments-ip-plage
              v-on:formModuleSegmentsIpPlageEvent="validate"
            >
            </module-segments-ip-plage>

            <!--              <v-row>
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
              </v-row>-->
          </v-col>
        </v-row>

        <v-card-actions>
          <v-row>
            <v-col cols="10"></v-col>
            <v-col>
              <v-btn
                color="success"
                :loading="buttonLoading"
                x-large
                @click="enclencherAjouterIpModuleSegmentsIpPlage()"
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
import Vue from "vue";
import { AxiosApi } from "../utils/AxiosApi";
import { mapActions } from "vuex";
import ModuleSegmentsIpPlage from "@/components/ModuleSegmentsIpPlage.vue";
import {
  AjouterAccesSubmitEvent,
  GetTypeIpFromModifierAccesEvent,
  IpChangeEvent,
  TypeIpChangeEvent
} from "@/main";

export default Vue.extend({
  name: "ModifierAcces",
  components: { ModuleSegmentsIpPlage },
  data() {
    return {
      ipToModify: "" as string,
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
      adminIpV4Url: "/ln/ip/adminModifIpV4" as string,
      adminIpV6Url: "/ln/ip/adminModifIpV6" as string,
      adminPlageIpV4Url: "/ln/ip/adminModifPlageIpV4" as string,
      adminPlageIpV6Url: "/ln/ip/adminModifPlageIpV6" as string,
      typesIp: ["IPV4", "IPV6"],
      typeIpRules: [(v: never) => !!v || "Le type d'IP est obligatoire"],
      buttonLoading: false
    };
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
    const onchangeIpHandler = ip => {
      this.ip = ip;
      console.log(`ip =  ` + ip);
    };
    IpChangeEvent.$on("ipChangeEvent", onchangeIpHandler);
  },
  methods: {
    ...mapActions({
      setNotification: "setNotification"
    }),
    enclencherAjouterIpModuleSegmentsIpPlage(): void {
      console.log("debut enclencherAjouterAccesModuleIpPlage");
      AjouterAccesSubmitEvent.$emit("ajouterAccesSubmitEvent");
      AjouterAccesSubmitEvent.$emit("clear");
    },
    eventReinitialisationIpSegments: function() {
      TypeIpChangeEvent.$emit("eventReinitialisationIpSegments", this.typeIp);
    },
    setText(): void {
      if (this.typeAcces === "ip") {
        this.titleText = "Modifier mon ip";
        this.alertText =
          "Vous pouvez directement insérer une adresse IP en effectuant un copier coller.";
        this.labelIp = "Adresse ip que vous souhaitez modifier";
      } else {
        this.titleText = "Modifier ma plage d'adresses IP";
        this.alertText =
          "Vous pouvez directement insérer une ou plusieurs adresses IP en effectuant un copier coller.";
        this.labelIp = "Plage d'adresses ip que vous souhaitez modifier";
      }
    },
    fetchIp(): void {
      console.log("id = " + this.id);
      console.log("siren = " + this.getUserSiren);
      AxiosApi.getIPInfos({
        id: this.id,
        siren: this.$store.state.user.siren
      })
        .then(result => {
          this.id = result.data.id;
          this.ipToModify = result.data.ip;
          this.valide = result.data.validee;
          this.typeAcces = result.data.typeAcces;
          this.typeIp = result.data.typeIp;
          this.commentaires = result.data.commentaires;
          GetTypeIpFromModifierAccesEvent.$emit(
            "getTypeIpFromModifierAccesEvent",
            this.typeIp
          );
        })
        .catch(err => {
          this.alert = true;
          this.error = err;
        });
    },
    getUrl(typeIp) {
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
      AxiosApi.addIP(this.getUrl(this.typeIp), this.jsonResponse)
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
      json.siren = this.getUserSiren;
      json.commentaires = this.commentaires;
      this.jsonResponse = json;
    }
  }
});
</script>

<style scoped></style>
