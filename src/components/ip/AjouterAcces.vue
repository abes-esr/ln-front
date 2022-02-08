<template>
  <div>
    <v-form ref="formAjouterAcces" lazy-validation>
      <v-row>
        <v-col lg="12" md="12" xs="12">
          <v-row>
            <v-col cols="10">
              <v-card-title>{{ titleText }}</v-card-title>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col lg="11" md="12" xs="12">
          <v-row>
            <v-col cols="7">
              <v-radio-group v-model="typeIp" mandatory row>
                <v-radio
                  v-for="n in 2"
                  :key="n"
                  :label="typesIp[n - 1]"
                  :value="typesIp[n - 1]"
                ></v-radio
              ></v-radio-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="7">
              <module-segments-ip-plage
                :typeIp="typeIp"
                typeAcces="ip"
                v-on:FormModuleSegmentsIpPlageEvent="validate"
              >
              </module-segments-ip-plage>

              <module-segments-ip-plage
                :typeIp="typeIp"
                typeAcces="plage"
                v-on:FormModuleSegmentsIpPlageEvent="validate"
              >
              </module-segments-ip-plage>
            </v-col>
            <v-col>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    Nouvelles IP ou plages IP ajoutées
                    <tr>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in arrayAjouterIp" :key="item.ip">
                      <td>{{ item.typeIp }}</td>
                      <td>{{ item.ip }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
    <br />
    <v-alert dense outlined :value="alert" type="error">
      {{ error }}
    </v-alert>
  </div>
</template>
<style src="./style.css"></style>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ModuleSegmentsIpPlage from "@/components/ip/ModuleSegmentsIpPlage.vue";

@Component({
  components: { ModuleSegmentsIpPlage }
})
export default class AjouterAcces extends Vue {
  titleText: string = "";
  buttonAjouterText: string = "";
  title2Text: string = "";
  buttonAjouterIpPlage: string = "";
  buttonSupprimerIpPlage: string = "";
  id: string = "";
  ip: string = "";
  typeAcces: string = "";
  typesIp: Array<string> = ["IPV4", "IPV6"];
  typeIp: string = "IPV4";
  alertIp: boolean = true;
  alert: boolean = false;
  alertErrorIp: boolean = false;
  errorIp: string = "";
  //showButtonAjouterIp: false,
  error: string = "";
  arrayAjouterIp: Array<string> = [];

  validate(payloadFromModuleSegmentsIpPlage): void {
    this.arrayAjouterIp.push(payloadFromModuleSegmentsIpPlage);
  }
  clear() {
    this.arrayAjouterIp = [];
  }
}
</script>
