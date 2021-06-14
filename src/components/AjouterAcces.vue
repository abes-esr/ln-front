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
                <v-col cols="10">
                  <v-alert outlined v-bind:label="this.labelIp">
                    <v-row> <v-col cols="1"/></v-row>
                    <v-row v-if="this.typeIp === 'IPV4'">
                      <v-col
                        cols="3"
                        v-for="(value, index) in ipv4Segments"
                        :key="index"
                      >
                        <v-text-field
                          :data-length="value.length"
                          :data-index="index"
                          :rules="ipv4SegmentsRules"
                          ref="ipv4Segments"
                          :label="getLabelSegmentsIpv4(index)"
                          :placeholder="getLabelSegmentsIpv4(index)"
                          v-model="value.value"
                          suffix="."
                          @click="clearIpSegment(index, ipv4Segments)"
                          @input="nextIpv4Segment(index)"
                          dense
                          required
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row v-else>
                      <v-col
                        cols="1,5"
                        v-for="(value, index) in ipv6Segments"
                        :key="index"
                      >
                        <v-text-field
                          :data-length="value.length"
                          :data-index="index"
                          :rules="ipv6SegmentsRules"
                          ref="ipv6Segments"
                          :label="getLabelSegmentsIpv6(index)"
                          :placeholder="getLabelSegmentsIpv6(index)"
                          v-model="value.value"
                          suffix=":"
                          @click="clearIpSegment(index, ipv6Segments)"
                          @input="nextIpv6Segment(index)"
                          dense
                          required
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-alert>Résultat: {{ resultatIp }}</v-alert>
                  </v-alert>
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
      ipv4Segments: [
        { length: 4, value: "192" },
        { length: 4, value: "168" },
        { length: 4, value: "136" },
        { length: 4, value: "120" }
      ],
      ipv6Segments: [
        { length: 5, value: "1924" },
        { length: 5, value: "1685" },
        { length: 5, value: "1368" },
        { length: 5, value: "1200" },
        { length: 5, value: "1924" },
        { length: 5, value: "1685" },
        { length: 5, value: "1368" },
        { length: 5, value: "1200" }
      ],

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
      ipv4SegmentsRules: [
        (v: any) => !!v || "Le segment d'IP est obligatoire",
        (v: any) =>
          /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.)$/.test(v) ||
          /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]))$/.test(v) ||
          "Le segment d'IP fourni n'est pas valide" // cf https://stackoverflow.com/a/47959401
      ],
      ipv6SegmentsRule: [
        { length: 3, value: "192." },
        { length: 4, value: "168." },
        { length: 4, value: "136." },
        { length: 4, value: "120" }
      ],
      ipv6SegmentsRules: [
        (v: any) => !!v || "Le segment d'IP est obligatoire",
        (v: any) =>
          /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.)$/.test(v) ||
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
    this.typeIp = "IPV4";
    this.setText();
    console.log(this.$refs);
  },

  computed: {
    ...mapGetters(["userSiren"]),

    resultatIp() {
      let value = "";
      if (this.typeIp === "IPV4") {
        for (const field of this.ipv4Segments) {
          value += field.value + ".";
        }
      } else {
        for (const field of this.ipv6Segments) {
          value += field.value + ":";
        }
      }
      return value.substr(0, value.lastIndexOf("."));
    }
  },

  methods: {
    ...mapActions({
      setNotification: "setNotification"
    }),
    nextIpv4Segment(index) {
      (this as any).$refs["ipv4Segments"].forEach((value, index) => {
        console.log("ipv4Segments = " + index);
        console.log(
          "ipv4Segments[0] = " +
            (this as any).$refs["ipv4Segments"][index].value
        );
        console.log(
          "ipv4Segments[" +
            index +
            "] = " +
            (this as any).$refs["ipv4Segments"][index].value.length
        );
        console.log(
          "ipv4Segments[" +
            index +
            "] = " +
            this.ipv4Segments[index].value.length
        );
      });
      /*if ((this as any).$refs["ipv4Segments"][index].value.length >= 3) {
        (this as any).$refs["ipv4Segments"][index + 1].focus();
      }*/
      if (this.ipv4Segments[index].value.length > 2) {
        //if (index !== 3) this.ipv4Segments[index].value += ".";
        this.clearIpSegment(index + 1, this.ipv4Segments);
        (this as any).$refs["ipv4Segments"][index + 1].focus();
      }
    },
    nextIpv6Segment(index) {
      if (this.ipv6Segments[index].value.length >= 4) {
        //if (index !== 7) this.ipv6Segments[index].value += ":";
        this.clearIpSegment(index + 1, this.ipv6Segments);
        (this as any).$refs["ipv6Segments"][index + 1].focus();
      }
    },
    clearIpSegment(index, array): void {
      array[index].value = "";
    },
    clearIpv6Segment(index): void {
      this.ipv6Segments[index].value = "";
    },
    containsPoint(index) {
      console.log(
        "this.ipv4Segments[index - 1].value.toString().includes(.) = " +
          this.ipv4Segments[index - 1].value.toString().includes(".")
      );
      return this.ipv4Segments[index - 1].value.toString().includes(".");
    },
    getLabelSegmentsIpv4(index) {
      switch (index) {
        case 0:
          return "192.";
        case 1:
          return "168.";
        case 2:
          return "136.";
        case 3:
          return "120";
      }
    },
    getLabelSegmentsIpv6(index) {
      switch (index) {
        case 0:
          return "1924:";
        case 1:
          return "1685:";
        case 2:
          return "1368:";
        case 3:
          return "1200:";
        case 4:
          return "1924:";
        case 5:
          return "1685:";
        case 6:
          return "1368:";
        case 7:
          return "1200";
      }
    },

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
