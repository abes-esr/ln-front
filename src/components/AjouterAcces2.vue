<template>
  <div>
    <v-card width="100%" outlined>
      <v-form ref="formAjouterAcces" lazy-validation>
        <v-row>
          <v-col lg="12" md="12" xs="12">
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
            <v-col lg="9" md="12" xs="12">
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-alert border="left" color="grey" dark>
                    {{ alertText }}
                  </v-alert>
                </v-col>
              </v-row>

              <module-ip-plage2
                v-on:formModuleIpSentEvent="validate"
                v-for="n in moduleIpPlageNumber"
                :key="n"
              >
              </module-ip-plage2>

              <v-card-actions class="v-card__actions">
                <v-row>
                  <v-col cols="3"></v-col>
                  <v-main
                    >Nombre d'Ip ou Plage ip: {{ moduleIpPlageNumber }}</v-main
                  >
                </v-row>
                <v-row>
                  <v-col cols="3"></v-col>
                  <v-col>
                    <v-btn @click="increaseModuleIpPlageNumber"
                      >{{ buttonAjouterIpPlage }}
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-btn @click="decreaseModuleIpPlageNumber"
                      >{{ buttonSupprimerIpPlage }}
                    </v-btn>
                  </v-col>
                  <v-col cols="3"></v-col>
                </v-row>
                <v-row>
                  <v-col cols="9"></v-col>
                  <v-col>
                    <v-btn @click="clear()">Annuler </v-btn>
                    <v-btn
                      @click="enclencherAjouterAccesModuleIpPlage()"
                      :loading="buttonLoading"
                      color="success"
                      >Valider
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>

              <!--              <v-card-actions>
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
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
    </v-card>
    <br />
    <v-alert dense outlined :value="alert" type="error">
      {{ error }}
    </v-alert>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { HTTP } from "../utils/http-commons";
import { mapActions, mapGetters } from "vuex";
import { AjouterAccesSubmitEvent, TypeIpChangeEvent } from "@/main";
import { IpChangeEvent } from "@/main";
import ModuleIpPlage2 from "@/components/ModuleIpPlage2.vue";

export default Vue.extend({
  name: "AjouterAcces2",
  components: { ModuleIpPlage2 },
  data() {
    return {
      moduleIpPlageNumber: 2,
      titleText: "" as string,
      alertText: "" as string,
      buttonAjouterText: "" as string,
      title2Text: "" as string,
      buttonAjouterIpPlage: "" as string,
      buttonSupprimerIpPlage: "" as string,
      id: "",
      ip: "",
      typeAcces: "" as string,
      //typeIp: "" as string,
      alertIp: true,
      alert: false,
      alertErrorIp: false,
      errorIp: "" as string,
      //showButtonAjouterIp: false,
      error: "",
      arrayAjouterIp: [] as any,
      arrayArrays: [] as any,
      ipV4Url: "/ln/ip/ajoutIpV4" as string,
      ipV6Url: "/ln/ip/ajoutIpV6" as string,
      plageIpV4Url: "/ln/ip/ajoutPlageIpV4" as string,
      plageIpV6Url: "/ln/ip/ajoutPlageIpV6" as string,
      adminIpV4Url: "/ln/ip/adminAjoutIpV4" as string,
      adminIpV6Url: "/ln/ip/adminAjoutIpV6" as string,
      adminPlageIpV4Url: "/ln/ip/adminAjoutPlageIpV4" as string,
      adminPlageIpV6Url: "/ln/ip/adminAjoutPlageIpV6" as string,
      //typesIp: ["IPV4", "IPV6"],
      //typeIpRules: [(v: any) => !!v || "Le type d'IP est obligatoire"],
      buttonLoading: false
    };
  },
  mounted() {
    this.typeAcces = window.location.href.substr(
      window.location.href.lastIndexOf("/") + 1
    );

    this.setText();
    console.log(this.$refs);

    /*const onchangeIpHandler = ip => {
      this.ip = ip;
      console.log(`ip =  ` + ip);
    };
    IpChangeEvent.$on("ipChangeEvent", onchangeIpHandler);*/
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

    enclencherAjouterAccesModuleIpPlage(): void {
      console.log("debut enclencherAjouterAccesModuleIpPlage");
      AjouterAccesSubmitEvent.$emit("ajouterAccesSubmitEvent");
      AjouterAccesSubmitEvent.$emit("clear");
    },

    setText(): void {
      if (this.typeAcces === "ip") {
        this.titleText = "Ajout d'adresse IP";
        this.alertText =
          "Vous pouvez directement insérer une adresse IP en effectuant un copier coller.";
        this.buttonAjouterIpPlage = "Ajouter une adresse ip";
        this.buttonSupprimerIpPlage = "Supprimer une adresse ip";
      } else {
        this.titleText = "Ajout de plage d'adresses IP";
        this.alertText =
          "Vous pouvez directement insérer une ou plusieurs adresses IP en effectuant un copier coller.";
        this.buttonAjouterIpPlage = "Ajouter une plage d'adresse ip";
        this.buttonSupprimerIpPlage = "Supprimer une adresse ip";
      }
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

    suppIpFromArrayArrays: function(index) {
      this.arrayArrays.splice(index, 1);
      console.log(this.arrayArrays.toString());
      console.log(this.arrayArrays.length);
      this.alertErrorIp = false;
    },

    /*eventReinitialisationIpSegments: function(evt) {
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
        //this.ajouterIp();
        this.typeIp = "IPV4";
        this.eventReinitialisationIpSegments("eventReinitialisationIpSegments");
      }
    },*/

    validate(payloadFromModuleIpPlage): void {
      console.log("debut validate");

      this.buttonLoading = true;
      this.arrayAjouterIp.push(payloadFromModuleIpPlage);
      this.arrayArrays.push(payloadFromModuleIpPlage);
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
    },
    increaseModuleIpPlageNumber: function() {
      this.moduleIpPlageNumber++;
    },
    decreaseModuleIpPlageNumber: function() {
      this.moduleIpPlageNumber--;
      this.moduleIpPlageNumber.pop();
    }
  }
});
</script>

<style scoped>
.v-card__actions {
  display: block;
}
</style>
//repeat a form vuejs
//https://stackoverflow.com/questions/51133782/vuejs-add-the-same-form-multiple-times
