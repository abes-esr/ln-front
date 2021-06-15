<template>
  <div>
    <v-expansion-panels v-if="isPlage">
      <v-expansion-panel>
        <v-expansion-panel-header>
          Adresse de début
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Adresse de fin
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels v-else>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Adresse IP :
          <b v-if="isRenater(whoIsResult1)"> Fait partie de RENATER</b>
          <b v-else> Ne fait pas partie de RENATER</b>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <span v-html="whoIsResult1"></span>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { HTTP } from "../utils/http-commons";

export default Vue.extend({
  name: "WhoIs",
  data() {
    return {
      message: "",
      whoIsResult1: "",
      whoIsResult2: ""
    };
  },
  props: {
    ip: String,
    isPlage: Boolean
  },
  methods: {
    fetchWhoIs(ip: string): Promise<string> {
      return HTTP.get("/ln/ip/whoIs/" + ip)
        .then(result => {
          console.log(result.data);
          return result.data;
        })
        .catch(error => {
          console.log(error);
          return "Erreur lors du WHOIS";
        });
    },
    async getDataAndAssign() {
      if (this.isPlage) {
        const ips: string[] = this.splitRange(this.ip);
        this.whoIsResult1 = await this.fetchWhoIs(ips[0]);
        this.whoIsResult2 = await this.fetchWhoIs(ips[1]);
      } else {
        this.whoIsResult1 = await this.fetchWhoIs(this.ip);
      }
    },
    isRenater(whoIs: string): boolean {
      if (whoIs.toLowerCase().includes("renater")) {
        return true;
      }
      return false;
    },
    splitRange(rangeIP: string): string[] {
      let lowIP: string;
      let highIP: string;
      if (rangeIP.includes(":")) {
        const ipSplit: string[] = rangeIP.split(":");
        const range1: string[] = ipSplit[6].split("-");
        const range2: string[] = ipSplit[7].split("-");
        lowIP =
          ipSplit[0] +
          ":" +
          ipSplit[1] +
          ":" +
          ipSplit[2] +
          ":" +
          ipSplit[3] +
          ":" +
          ipSplit[4] +
          ":" +
          ipSplit[5] +
          ":" +
          range1[0] +
          ":" +
          range2[0];
        highIP =
          ipSplit[0] +
          ":" +
          ipSplit[1] +
          ":" +
          ipSplit[2] +
          ":" +
          ipSplit[3] +
          ":" +
          ipSplit[4] +
          ":" +
          ipSplit[5] +
          ":" +
          range1[1] +
          ":" +
          range2[1];
      } else {
        const ipSplit: string[] = rangeIP.split(".");
        const range1: string[] = ipSplit[2].split("-");
        const range2: string[] = ipSplit[3].split("-");
        lowIP =
          ipSplit[0] + "." + ipSplit[1] + "." + range1[0] + "." + range2[0];
        highIP =
          ipSplit[0] + "." + ipSplit[1] + "." + range1[1] + "." + range2[1];
      }
      return [lowIP, highIP];
    }
  },
  mounted() {
    this.getDataAndAssign();
  }
});
</script>

<style scoped></style>
