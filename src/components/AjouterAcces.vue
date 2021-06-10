<template>
  <div>
    <v-card width="100%">
      <v-form ref="formAjouterAcces" lazy-validation>
        <v-row align="left" justify="left">
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
              <!--              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-text-field
                    outlined
                    v-bind:label="this.labelIp"
                    v-bind:placeholder="acces"
                    v-model="ip"
                    :rules="this.getIpRules()"
                    required
                    @keyup.enter="buttonAjouterIp()"
                  ></v-text-field>
                </v-col>
              </v-row>-->

              <v-row>
                <v-col cols="1" />
                <v-alert
                  v-for="(value, index) in ipSegments2"
                  v-bind:key="index"
                >
                  <v-row>
                    <v-col cols="9">
                      <v-text-field
                        minlenght="3"
                        maxlenght="3"
                        :rules="ipSegmentRules"
                        v-bind:label="value"
                        v-bind:placeholder="value"
                        @input="handleActivationInput($event)"
                        filled
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-alert>
              </v-row>

              <v-row>
                <v-col cols="1" />
                <v-text-field
                  v-for="(value, index) in ipSegments2"
                  :key="index"
                  :data-length="value.length"
                  :data-index="index"
                  :rules="ipSegmentRules"
                  :ref="`ipSegmentsRef[${index}]`"
                  :label="getLabelSegmentsIp(index)"
                  :placeholder="getLabelSegmentsIp(index)"
                  v-model="value.value"
                  :v-if="ipSegmentMaxLengthOk(value.value)"
                  :v-else="moveToNextIpSegment(index)"
                  @click="clearIpSegment(index)"
                  filled
                  required
                >
                </v-text-field>
              </v-row>
              <div class="activationkey">
                Activation Key: {{ activationKey }}
              </div>

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
            </v-col>
            <v-col lg="6" md="12" xs="12">
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
                        {{ value.commentaires.substring(0, 40) }}
                      </v-col>
                      <v-col class="shrink">
                        <v-btn color="red" @click="suppIpFromArrayArrays(index)"
                          >SUPPRIMER</v-btn
                        >
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-alert
                        dense
                        outlined
                        :value="alertErrorIp"
                        type="error"
                      >
                        {{ value.error }}
                      </v-alert>
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
      ipSegments2: [
        { length: 3, value: "19" },
        { length: 4, value: ".12" },
        { length: 4, value: ".13" },
        { length: 4, value: ".14" }
      ],
      ipSeparator: ["****", "****", ".", ""] as any,
      ipSegments: ["192", "168", "122", "130"] as any,
      ipSegment: "" as any,
      valid: false,
      active: false,
      titleText: "" as string,
      alertText: "" as string,
      labelIp: "" as string,
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
      arrayIpNumber: 2,
      ipV4Url: "/ln/ip/ajoutIpV4" as string,
      ipV6Url: "/ln/ip/ajoutIpV6" as string,
      plageIpV4Url: "/ln/ip/ajoutPlageIpV4" as string,
      plageIpV6Url: "/ln/ip/ajoutPlageIpV6" as string,
      typesIp: ["IPV4", "IPV6"],
      typeIpRules: [(v: any) => !!v || "Le type d'IP est obligatoire"],
      ipRules: "" as any,
      ipSegmentRules: [
        (v: any) => !!v || "Le segment d'IP est obligatoire",
        (v: any) =>
          /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]))$/.test(v) ||
          "Le segment d'IP fourni n'est pas valide" // cf https://stackoverflow.com/a/47959401
      ],
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
    /*this.ipSegments[0] = "192";
    this.ipSegments[1] = "168";
    this.ipSegments[2] = "152";
    this.ipSegments[3] = "130";
    console.log(this.ipSegments);*/
  },

  computed: {
    ...mapGetters(["userSiren"]),
    activationKey() {
      let value = "";
      for (const field of this.ipSegments2) {
        value += field.value;
      }
      return value;
    }
  },

  methods: {
    ...mapActions({
      setNotification: "setNotification"
    }),
    ipSegmentMaxLengthOk(value) {
      console.log("length = " + value.length);
      return value.length <= 3;
    },
    getLabelSegmentsIp(index) {
      switch (index) {
        case 0:
          return "192";
        case 1:
          return ".168";
        case 2:
          return ".136";
        case 3:
          return ".120";
      }
    },
    moveToNextIpSegment(index) {
      console.log("moveToNextIpSegment index =" + index);
      console.log(this.$refs);

      switch (index) {
        case 0:
          this.ipSegment = "ipSegmentsRef[1]";
          break;
        case 1:
          this.ipSegment = "ipSegmentsRef[2]";
          break;
        case 2:
          this.ipSegment = "ipSegmentsRef[3]";
          break;
      }

      //this.$refs["ipSegmentsRef"].focus(); //focus on string not possible
      //(this.ipSegments2[index + 1] as HTMLElement).focus();
      setTimeout(() => this.$refs[this.ipSegment].$refs.input.focus(), 100);
      //this.$refs["ipSegmentsRef[2]"].$refs.input.focus();
    },

    focusNext(index) {
      console.log("index =" + index);
      document.getElementById("ipSegments2");
      (this.ipSegments2[index + 1] as HTMLElement).focus();
    },
    handleActivationInput(e) {
      // Grab input's value
      const value: any = e.target.value;
      // Grab data-index value
      const index = parseInt(e.target.dataset.index);
      // Grab data-length value
      const maxlength = e.target.dataset.length;

      if (this.ipSegments2[index].value.length > maxlength) {
        e.preventDefault();
        this.ipSegments2[index].value = value.slice(0, 3);
        try {
          this.$refs[`ipSegments2-${parseInt(index + 1)}`][0].focus();
        } catch (e) {
          console.log(e);
        }
        return;
      }

      // Shift focus to next input field if max length reached
      if (value.length >= maxlength) {
        if (typeof this.ipSegments2[index + 1] == "undefined") {
          e.preventDefault();
          return;
        }
        this.$refs[`ipSegments2-${parseInt(index + 1)}`][0].focus();
        e.preventDefault();
      }
    },

    /*assertMaxChars: function(index, $event) {
      if (this.ipSegments[index].length >= 3) {
        $event.target.nextElementSibling.focus();
      }
    },*/

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
    /*testIp(index): void {
      HTTP.post("/ln/ip/checkDoublonIp", {
        siren: this.userSiren,
        ip: this.ip,
        typeAcces: this.typeAcces,
        typeIp: this.typeIp,
        commentaires: this.commentaires
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
    },*/
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
    getUrl(typeIp) {
      if (this.typeAcces === "ip") {
        return typeIp === "IPV4" ? this.ipV4Url : this.ipV6Url;
      } else return typeIp === "IPV4" ? this.plageIpV4Url : this.plageIpV6Url;
    },

    clearIpSegment(index): void {
      if (index === 0) this.ipSegments2[index].value = "";
      else this.ipSegments2[index].value = ".";
    },

    suppIpFromArrayArrays: function(index) {
      this.arrayArrays.splice(index, 1);
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
      this.arrayArrays.forEach((value, index) => {
        console.log("this.getUrl() = " + this.getUrl(value.typeIp));
        HTTP.post(this.getUrl(value.typeIp), {
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
            console.log("err.response.data " + err.response.data);
            this.errorIp = err.response.data;
            value.error = err.response.data;
            this.alertErrorIp = true;
          });
      });
    }
  }
});
</script>

<style scoped>
input[type="text"] {
  padding: 10px;
  margin-right: 7px;
  max-width: 120px;
}

.activationkey {
  padding: 10px;
  border: 1px dashed #45673a;
  font-weight: bold;
  color: darken(#45673a, 50%);
  margin-top: 20px;
}
</style>
//repeat a form vuejs
//https://stackoverflow.com/questions/51133782/vuejs-add-the-same-form-multiple-times
