<template>
  <div>
    <v-card>
      <v-form ref="formModuleSegmentsIpPlage" lazy-validation>
        <v-card-text>
          <v-row v-if="(modeEditIp = true)">
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
          <v-row v-else></v-row>
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
                @keyup.enter="validate()"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="1" />
            <v-col cols="10">
              <v-text-field
                outlined
                ref="ipPasted"
                label="J'utilise le copier-coller"
                placeholder="Copier-Coller ici votre adresse ip"
                v-model="this.ipPasted"
                @click="clearIpPasted()"
                @paste="onPaste"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="this.typeAcces === 'ip'">
            <v-col cols="1" />
            <v-col cols="10">
              <v-alert outlined>
                <v-alert text dense color="teal" border="left">
                  {{ this.labelIp }}
                </v-alert>
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
                      :placeholder="getLabelSegmentsIpv4(index)"
                      ref="ipv4Segments"
                      v-model="value.value"
                      suffix="."
                      @click="clearIpSegment(index, ipv4Segments)"
                      @input="nextSegment(index, ipv4Segments, 'ipv4Segments')"
                      dense
                      outlined
                      required
                      @paste="onPaste"
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
                      :placeholder="getLabelSegmentsIpv6(index)"
                      ref="ipv6Segments"
                      v-model="value.value"
                      suffix=":"
                      @click="clearIpSegment(index, ipv6Segments)"
                      @input="nextSegment(index, ipv6Segments, 'ipv6Segments')"
                      dense
                      outlined
                      required
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-text-field
                      outlined
                      v-bind:label="this.labelIpResultat"
                      v-model="this.ip"
                      :rules="this.getIpRules()"
                      readonly
                      >Résultat: {{ resultatIp }}</v-text-field
                    >
                  </v-col>
                </v-row>
              </v-alert>
            </v-col>
          </v-row>

          <v-row v-else>
            <v-col cols="1" />
            <v-col cols="10">
              <v-alert outlined>
                <v-alert text dense color="teal" border="left">
                  {{ this.labelIp }}
                </v-alert>
                <v-row> <v-col cols="1"/></v-row>
                <v-row v-if="this.typeIp === 'IPV4'">
                  <v-col
                    cols="2"
                    v-for="(value, index) in ipv4SegmentsPlage"
                    :key="index"
                  >
                    <v-text-field
                      :data-length="value.length"
                      :data-index="index"
                      :rules="ipv4SegmentsRules"
                      :placeholder="getLabelSegmentsIpv4(index)"
                      ref="ipv4SegmentsPlage"
                      v-model="value.value"
                      v-bind:suffix="getSuffix(index)"
                      @click="clearIpSegment(index, ipv4SegmentsPlage)"
                      @input="
                        nextSegment(
                          index,
                          ipv4SegmentsPlage,
                          'ipv4SegmentsPlage'
                        )
                      "
                      dense
                      outlined
                      required
                    >
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row v-else>
                  <v-col
                    cols="1,5"
                    v-for="(value, index) in ipv6SegmentsPlage"
                    :key="index"
                  >
                    <v-text-field
                      :data-length="value.length"
                      :data-index="index"
                      :rules="ipv6SegmentsRules"
                      :placeholder="getLabelSegmentsIpv6(index)"
                      ref="ipv6SegmentsPlage"
                      v-model="value.value"
                      v-bind:suffix="getSuffix(index)"
                      @click="clearIpSegment(index, ipv6SegmentsPlage)"
                      @input="
                        nextSegment(
                          index,
                          ipv6SegmentsPlage,
                          'ipv6SegmentsPlage'
                        )
                      "
                      dense
                      outlined
                      required
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-text-field
                      outlined
                      v-bind:label="this.labelIpResultat"
                      v-model="this.ip"
                      :rules="this.getIpRules()"
                      readonly
                      >{{ resultatPlageIp }}</v-text-field
                    >
                  </v-col>
                </v-row>
              </v-alert>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="1" />
            <v-col cols="10">
              <v-alert border="top" colored-border type="info" elevation="2">
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
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import {
  AjouterAccesSubmitEvent,
  GetTypeIpFromModifierAccesEvent,
  TypeIpChangeEvent
} from "@/main";
import { IpChangeEvent } from "@/main";
import { LicencesNationalesApiService } from "../service/licencesnationales/LicencesNationalesApiService";

export default Vue.extend({
  name: "ModuleSegmentsIpPlage",

  data() {
    return {
      id: "",
      ipToModify: "" as string,
      valide: "",
      typeIpTemp: "" as string,
      modeEditIp: false,
      suffix: "" as string,
      ipPasted: "" as string,
      ipPastedTemp: "" as string,
      ipPastedArray: ["", "", "", "", "", "", "", "", "", ""],
      ipv4Segments: [
        { length: 3, value: "" },
        { length: 3, value: "" },
        { length: 3, value: "" },
        { length: 3, value: "" }
      ],
      ipv6Segments: [
        { length: 5, value: "" },
        { length: 5, value: "" },
        { length: 5, value: "" },
        { length: 5, value: "" },
        { length: 5, value: "" },
        { length: 5, value: "" },
        { length: 5, value: "" },
        { length: 5, value: "" }
      ],
      ipv4SegmentsPlage: [
        { length: 3, value: "" },
        { length: 3, value: "" },
        { length: 3, value: "" },
        { length: 3, value: "" },
        { length: 3, value: "" },
        { length: 3, value: "" }
      ],
      ipv6SegmentsPlage: [
        { length: 5, value: "" },
        { length: 5, value: "" },
        { length: 5, value: "" },
        { length: 5, value: "" },
        { length: 5, value: "" },
        { length: 5, value: "" },
        { length: 5, value: "" },
        { length: 5, value: "" },
        { length: 5, value: "" },
        { length: 5, value: "" }
      ],
      resultatPlage: "" as string,
      labelIp: "" as string,
      labelIpResultat: "" as string,
      ip: "",
      typeAcces: "" as string,
      typeIp: "" as string,
      alert: false,
      error: "",
      typesIp: ["IPV4", "IPV6"],
      typeIpRules: [(v: any) => !!v || "Le type d'IP est obligatoire"],
      ipv4SegmentsRules: [
        (v: any) => !!v || "Le segment d'IP est obligatoire",
        (v: any) =>
          /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]))$/.test(v) ||
          "Le segment d'IP fourni n'est pas valide" // cf https://stackoverflow.com/a/47959401
      ],
      ipv6SegmentsRules: [
        (v: any) => !!v || "Le segment d'IP est obligatoire",
        (v: any) =>
          /^\s*([0-9a-fA-F]{1,4})$/.test(v) ||
          "Le segment d'IP fourni n'est pas valide"
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
      commentaires: "" as string
    };
  },
  mounted() {
    console.log("debut mounted ModuleSegmentsIpPlage");

    this.typeAcces = window.location.href.substr(
      window.location.href.lastIndexOf("/") + 1
    );
    console.log("1 - this.typeAcces = " + this.typeAcces);

    //code pour ModifierAcces/////////////////
    if (this.typeAcces.includes("&")) {
      this.modeEditIp = true;
      this.typeAcces = window.location.href.substr(
        window.location.href.lastIndexOf("&") + 1
      );
      console.log("2 - this.typeAcces pour la modifIp= " + this.typeAcces);
    }
    if (this.typeIp === "" && window.location.href.includes("&")) {
      const getTypeIpHandler = typeIp => {
        this.typeIp = typeIp;
        console.log("3 - this.typeIp pour la modifIp= " + this.typeIp);
        //this.reinitialisationIpSegments();
      };
      GetTypeIpFromModifierAccesEvent.$on(
        "getTypeIpFromModifierAccesEvent",
        getTypeIpHandler
      );
      console.log(
        "4 - this.typeIp pour la modifIp après event= " + this.typeIp
      );
      this.id = window.location.href.substring(
        window.location.href.lastIndexOf("/") + 1,
        window.location.href.lastIndexOf("&")
      );
      this.typeAcces = window.location.href.substr(
        window.location.href.lastIndexOf("&") + 1
      );
      this.fetchIp();
    } //else this.typeIp = "IPV4";
    //////////////////////////////////////////////
    this.setText();
    console.log(this.$refs);

    const onchangeTypeIpHandler = typeIp => {
      this.typeIp = typeIp;
      console.log("5 - mounted typeIp =  " + typeIp);
      //this.reinitialisationIpSegments();
    };
    TypeIpChangeEvent.$on(
      "eventReinitialisationIpSegments",
      onchangeTypeIpHandler
    );
    AjouterAccesSubmitEvent.$on("ajouterAccesSubmitEvent", this.ajouterIp);
    AjouterAccesSubmitEvent.$on("clear", this.clear);
  },

  computed: {
    //...mapGetters(["userSiren"]),
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
    },
    resultatIp() {
      let value = "";
      console.log("this.typeIp =" + this.typeIp);
      if (this.typeIp === "IPV4") {
        for (const field of this.ipv4Segments) {
          value += field.value + ".";
        }
        value = value.substr(0, value.lastIndexOf("."));
      } else {
        console.log("dans le else");
        //this.reinitialisationIpSegments();
        for (const field of this.ipv6Segments) {
          value += field.value + ":";
        }
        value = value.substr(0, value.lastIndexOf(":"));
      }
      (this as any).ip = value;
      console.log("this.ip = " + this.ip);
      IpChangeEvent.$emit("ipChangeEvent", this.ip);
      return value;
    },
    resultatPlageIp() {
      let valeur = "";
      console.log("this.typeIp =" + this.typeIp);
      if (this.typeIp === "IPV4") {
        this.ipv4SegmentsPlage.forEach((value, index) => {
          console.log("value.value = " + value.value);
          if (index === 2 || index === 4) valeur += value.value + "-";
          else valeur += value.value + ".";
        });
        valeur = valeur.substr(0, valeur.lastIndexOf("."));
      } else {
        console.log("dans le else");
        this.ipv6SegmentsPlage.forEach((value, index) => {
          if (index === 6 || index === 8) valeur += value.value + "-";
          else valeur += value.value + ":";
        });
        valeur = valeur.substr(0, valeur.lastIndexOf(":"));
      }
      (this as any).ip = valeur;
      console.log("this.ip = " + this.ip);
      IpChangeEvent.$emit("ipChangeEvent", this.ip);
      return valeur;
    }
  },
  watch: {},

  methods: {
    ...mapActions({
      setNotification: "setNotification"
    }),
    /////////////////////pour la modification)
    fetchIp(): void {
      console.log("id = " + this.id);
      console.log("siren = " + this.getUserSiren);
      LicencesNationalesApiService.getIPInfos({
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

    getSuffix(index) {
      console.log("getSuffix");
      if (this.typeIp === "IPV4") {
        console.log("IPV4 index = " + index);
        if (index === 2 || index === 4) return "-";
        else return ".";
      } else {
        console.log("IPV6 index = " + index);
        if (index === 6 || index === 8) return "-";
        else return ":";
      }
    },

    onPaste(evt) {
      this.ipPasted = evt.clipboardData.getData("text");
      this.ipPastedTemp = this.ipPasted;
      console.log("this.pasted = " + this.ipPasted);
      this.ipPastedTemp = this.ipPastedTemp.replaceAll(/[: . -]/g, "+");
      console.log("this.pasted = " + this.ipPasted);
      this.ipPastedArray = this.ipPastedTemp.split("+");
      if (this.typeAcces === "ip") {
        if (this.typeIp === "IPV4")
          this.pasteSegment(this.ipPastedArray, this.ipv4Segments);
        else this.pasteSegment(this.ipPastedArray, this.ipv6Segments);
      } else {
        if (this.typeIp === "IPV4")
          this.pasteSegment(this.ipPastedArray, this.ipv4SegmentsPlage);
        else this.pasteSegment(this.ipPastedArray, this.ipv6SegmentsPlage);
      }
    },
    pasteSegment(ipPastedArray, array) {
      array.forEach((value, index) => {
        this.clearIpSegment(index, array);
      });
      ipPastedArray.forEach((value, index) => {
        array[index].value = ipPastedArray[index].valueOf();
        console.log(
          "ipPastedArray[index].valueOf() = " + ipPastedArray[index].valueOf()
        );
      });
    },
    /*reinitialisationIpSegments() {
      if (this.typeAcces === "ip") {
        this.ipv4Segments = [
          { length: 4, value: "192" },
          { length: 4, value: "168" },
          { length: 4, value: "136" },
          { length: 4, value: "120" }
        ];
        this.ipv6Segments = [
          { length: 5, value: "5800" },
          { length: 5, value: "10C3" },
          { length: 5, value: "E3C3" },
          { length: 5, value: "F1AA" },
          { length: 5, value: "48E3" },
          { length: 5, value: "D923" },
          { length: 5, value: "D494" },
          { length: 5, value: "AAFF" }
        ];
      } else {
        this.ipv4SegmentsPlage = [
          { length: 4, value: "192" },
          { length: 4, value: "168" },
          { length: 4, value: "136" },
          { length: 4, value: "120" },
          { length: 4, value: "136" },
          { length: 4, value: "120" }
        ];
        this.ipv6SegmentsPlage = [
          { length: 5, value: "5800" },
          { length: 5, value: "10C3" },
          { length: 5, value: "E3C3" },
          { length: 5, value: "F1AA" },
          { length: 5, value: "48E3" },
          { length: 5, value: "D923" },
          { length: 5, value: "D494" },
          { length: 5, value: "AAFF" },
          { length: 5, value: "D494" },
          { length: 5, value: "AAFF" }
        ];
      }
      this.clearIpPasted();
    },*/
    nextSegment(index, array, refArray) {
      if (this.typeIp === "IPV4") {
        if (array[index].value.length > 2) {
          this.clearIpSegment(index + 1, array);
          (this as any).$refs[refArray][index + 1].focus();
        }
      } else {
        if (array[index].value.length >= 4) {
          this.clearIpSegment(index + 1, array);
          (this as any).$refs[refArray][index + 1].focus();
        }
      }
    },
    clearIpPasted(): void {
      this.ipPasted = "";
    },
    clearIpSegment(index, array): void {
      console.log("clear = ");
      array[index].value = "";
      console.log("array[index].value = " + array[index].value);
    },

    getLabelSegmentsIpv4(index) {
      switch (index) {
        case 0:
          return "192.";
        case 1:
          return "168.";
        case 2:
          if (this.typeAcces === "ip") return "136.";
          else return "136-";
        case 3:
          return "120.";
        case 4:
          if (this.typeAcces === "ip") return "136.";
          else return "136-";
        case 5:
          return "120";
      }
    },
    getLabelSegmentsIpv6(index) {
      switch (index) {
        case 0:
          return "5800:";
        case 1:
          return "10C3:";
        case 2:
          return "E3C3:";
        case 3:
          return "F1AA:";
        case 4:
          return "48E3:";
        case 5:
          return "D923:";
        case 6:
          if (this.typeAcces === "ip") return "D494:";
          else return "D494-";
        case 7:
          return "AAFF:";
        case 8:
          if (this.typeAcces === "ip") return "D494:";
          else return "D494-";
        case 9:
          return "AAFF";
      }
    },

    setText(): void {
      if (this.typeAcces === "ip") {
        this.labelIp = "Saisissez votre adresse ip.";
        this.labelIpResultat = "Ip fournie";
      } else {
        this.labelIp = "Saisissez votre plage d'adresse ip.";
        this.labelIpResultat = "Plage d'adresses ip fournie";
      }
    },

    getIpRules() {
      if (this.typeAcces === "ip") {
        return this.typeIp === "IPV4" ? this.ipV4Rules : this.ipV6Rules;
      } else
        return this.typeIp === "IPV4"
          ? this.plageIpV4Rules
          : this.plageIpV6Rules;
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
        (this.$refs.formModuleSegmentsIpPlage as Vue & {
          validate: () => boolean;
        }).validate()
      ) {
        this.$emit("FormModuleSegmentsIpPlageEvent", {
          //userSiren: this.getUserSiren,
          typeIp: this.typeIp,
          ip: this.ip,
          commentaires: this.commentaires
        });
      }
    },
    clear() {
      this.typeIp = "";
      this.ip = "";
      this.commentaires = "";
    }
  }
});
</script>

<style scoped></style>
//repeat a form vuejs
//https://stackoverflow.com/questions/51133782/vuejs-add-the-same-form-multiple-times
