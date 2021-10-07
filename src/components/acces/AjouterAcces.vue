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

              <module-segments-ip-plage
                v-on:FormModuleSegmentsIpPlageEvent="validate"
                v-for="n in moduleSegmentsIpPlageNumber"
                :key="n"
              >
              </module-segments-ip-plage>

              <v-card-actions class="v-card__actions">
                <v-row>
                  <v-col cols="3"></v-col>
                  <v-main
                    >Nombre d'Ip ou Plage ip:
                    {{ moduleSegmentsIpPlageNumber }}</v-main
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
                      @click="enclencherAjouterIpModuleSegmentsIpPlage()"
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
<style src="./style.css"></style>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ModuleSegmentsIpPlage from "@/components/acces/ModuleSegmentsIpPlage.vue";
import { Logger } from "@/utils/Logger";

@Component({
  components: { ModuleSegmentsIpPlage }
})
export default class AjouterAcces extends Vue {
  moduleSegmentsIpPlageNumber: number = 2;
  titleText: string = "";
  alertText: string = "";
  buttonAjouterText: string = "";
  title2Text: string = "";
  buttonAjouterIpPlage: string = "";
  buttonSupprimerIpPlage: string = "";
  id: string = "";
  ip: string = "";
  typeAcces: string = "";
  //typeIp: "" as string,
  alertIp: boolean = true;
  alert: boolean = false;
  alertErrorIp: boolean = false;
  errorIp: string = "";
  //showButtonAjouterIp: false,
  error: string = "";
  arrayAjouterIp: Array<string> = [];
  arrayArrays: Array<string> = [];
  ipV4Url: string = "/ln/ip/ajoutIpV4";
  ipV6Url: string = "/ln/ip/ajoutIpV6";
  plageIpV4Url: string = "/ln/ip/ajoutPlageIpV4";
  plageIpV6Url: string = "/ln/ip/ajoutPlageIpV6";
  adminIpV4Url: string = "/ln/ip/adminAjoutIpV4";
  adminIpV6Url: string = "/ln/ip/adminAjoutIpV6";
  adminPlageIpV4Url: string = "/ln/ip/adminAjoutPlageIpV4";
  adminPlageIpV6Url: string = "/ln/ip/adminAjoutPlageIpV6";
  //typesIp: ["IPV4", "IPV6"],
  //typeIpRules: [(v: any) => !!v || "Le type d'IP est obligatoire"],
  buttonLoading: boolean = false;

  mounted() {
    this.typeAcces = window.location.href.substr(
      window.location.href.lastIndexOf("/") + 1
    );

    this.setText();
    Logger.info(JSON.stringify(this.$refs));

    /*const onchangeIpHandler = ip => {
      this.ip = ip;
      console.log(`ip =  ` + ip);
    };
    IpChangeEvent.$on("ipChangeEvent", onchangeIpHandler);*/
  }
  get sirenEtabSiAdmin() {
    return this.$store.getters.sirenEtabSiAdmin();
  }
  get getUserSiren() {
    if (this.isAdmin === "true") return this.$store.getters.sirenEtabSiAdmin();
    else return this.$store.state.user.siren;
  }
  get isAdmin() {
    Logger.debug("isAdmin = " + this.$store.getters.isAdmin());
    return this.$store.getters.isAdmin();
  }

  enclencherAjouterIpModuleSegmentsIpPlage(): void {
    Logger.debug("debut enclencherAjouterAccesModuleIpPlage");
    //AjouterAccesSubmitEvent.$emit("ajouterAccesSubmitEvent");
    //AjouterAccesSubmitEvent.$emit("clear");
  }

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

  suppIpFromArrayArrays(index) {
    this.arrayArrays.splice(index, 1);
    Logger.debug(this.arrayArrays.toString());
    Logger.debug("" + this.arrayArrays.length);
    this.alertErrorIp = false;
  }

  /* validate(payloadFromModuleSegmentsIpPlage): void {
      Logger.debug("debut validate");

      this.buttonLoading = true;
      this.arrayAjouterIp.push(payloadFromModuleSegmentsIpPlage);
      this.arrayArrays.push(payloadFromModuleSegmentsIpPlage);
      this.arrayArrays.forEach((value, index) => {
        Logger.debug("this.getUrl() = " + this.getUrl(value.typeIp));
        serviceLn
          .ajouterAcces(
            this.$store.state.user.getToken,
            this.getUrl(value.typeIp),
            {
              siren: this.getUserSiren,
              ip: value.ip,
              typeAcces: this.typeAcces,
              typeIp: value.typeIp,
              commentaires: value.commentaires
            }
          )
          .then(response => {
            this.buttonLoading = false;
            Logger.debug("notification = " + response.data);
            this.setNotification(response.data);
            Logger.debug("notification = " + this.$store.state.notification);
            this.$router.push({ path: "/listeAcces" });
          })
          .catch(err => {
            this.buttonLoading = false;
            this.error = err.response.data;
            Logger.debug("err.response.data " + err.response.data);
            this.errorIp = err.response.data;
            value.error = err.response.data;
            this.alertErrorIp = true;
          });
      });
    }*/

  increaseModuleIpPlageNumber() {
    this.moduleSegmentsIpPlageNumber++;
  }

  decreaseModuleIpPlageNumber() {
    this.moduleSegmentsIpPlageNumber--;
    //this.moduleIpPlageNumber.pop();
  }
  clear() {
    this.arrayAjouterIp = [];
  }
}
</script>
