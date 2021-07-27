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
import {Component, Vue} from "vue-property-decorator";
import {serviceLn} from "../service/licencesnationales/LicencesNationalesApiService";
import ModuleSegmentsIpPlage from "@/components/ModuleSegmentsIpPlage.vue";
import {GetTypeIpFromModifierAccesEvent, IpChangeEvent, TypeIpChangeEvent} from "@/main";
import {Logger} from "@/utils/Logger";

@Component({
  components: { ModuleSegmentsIpPlage }
})
export default class ModifierAcces extends Vue {
      ipToModify: string = "";
      titleText: string = "";
      alertText: string = "";
      labelIp: string = "";
      id: string ="";
      ip: string ="";
      valide: string = "";
      typeAcces: string = "";
      typeIp: string = "";
      commentaires: string = "";
      jsonResponse: any = {};
      alert: boolean = false;
      error: string = "";
      ipV4Url: string = "/ln/ip/modifIpV4";
      ipV6Url: string = "/ln/ip/modifIpV6";
      plageIpV4Url: string = "/ln/ip/modifPlageIpV4";
      plageIpV6Url: string = "/ln/ip/modifPlageIpV6";
      adminIpV4Url: string = "/ln/ip/adminModifIpV4";
      adminIpV6Url: string = "/ln/ip/adminModifIpV6";
      adminPlageIpV4Url: string = "/ln/ip/adminModifPlageIpV4";
      adminPlageIpV6Url: string = "/ln/ip/adminModifPlageIpV6";
      typesIp: Array<string> = ["IPV4", "IPV6"];
      typeIpRules = [(v: never) => !!v || "Le type d'IP est obligatoire"];
      buttonLoading: boolean = false;

    get sirenEtabSiAdmin() {
      return this.$store.state.sirenEtabSiAdmin;
    }
    get getUserSiren() {
      if (this.isAdmin === "true") return this.$store.state.sirenEtabSiAdmin;
      else return this.$store.state.user.siren;
    }
    get isAdmin() {
      Logger.debug("isAdmin = " + this.$store.state.user.isAdmin);
      return this.$store.state.user.isAdmin;
    }

  mounted() {
    this.id = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1,
      window.location.href.lastIndexOf("&")
    );
    this.typeAcces = window.location.href.substr(
      window.location.href.lastIndexOf("&") + 1
    );
    this.setText();
    Logger.debug("this.id = " + this.id);
    Logger.debug("this.typeAcces = " + this.typeAcces);
    this.fetchIp();

    Logger.debug(this.id);
    const onchangeIpHandler = ip => {
      this.ip = ip;
      console.log(`ip =  ` + ip);
    };
    IpChangeEvent.$on("ipChangeEvent", onchangeIpHandler);
  }
    enclencherAjouterIpModuleSegmentsIpPlage(): void {
      Logger.debug("debut enclencherAjouterAccesModuleIpPlage");
      //AjouterAccesSubmitEvent.$emit("ajouterAccesSubmitEvent");
      //AjouterAccesSubmitEvent.$emit("clear");
    }
    eventReinitialisationIpSegments(): void {
      TypeIpChangeEvent.$emit("eventReinitialisationIpSegments", this.typeIp);
    }

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
    }

    fetchIp(): void {
      Logger.debug("id = " + this.id);
      Logger.debug("siren = " + this.getUserSiren);
      serviceLn
        .getIPInfos(this.$store.state.user.token, {
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
    }
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
    }
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
    }
    submitAcces(): void {
      this.updateJsonObject();
      Logger.debug(JSON.stringify(this.jsonResponse));
      serviceLn
        .addIP(
          this.$store.state.user.token,
          this.getUrl(this.typeIp),
          this.jsonResponse
        )
        .then(response => {
          this.buttonLoading = false;
          Logger.debug("notification = " + response.data);
          this.$store.dispatch('setNotification', response.data).catch((err) => {
            Logger.error(err);
          });
          Logger.debug("notification = " + this.$store.state.notification);
          this.$router.push({ path: "/listeAcces" });
        })
        .catch(err => {
          this.buttonLoading = false;
          this.error = err.response.data;
          this.alert = true;
        });
    }

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
</script>

<style scoped></style>
