<template>
  <div>
    <v-form ref="formAjouterAcces" lazy-validation>
      <v-row align="center" justify="center">
        <v-col lg="11" md="12" xs="12">
          <v-row>
            <v-card-title
              ><h1>
                Déclarer de nouvelles adresses ou plages IP
              </h1></v-card-title
            >
          </v-row>
          <v-row>
            <v-card-title>
              Choisir le type d'adresse IP à déclarer
            </v-card-title>
          </v-row>
          <v-row>
            <v-col cols="7">
              <v-divider></v-divider>
              <div id="radioIP">
                <v-radio-group v-model="typeIp" mandatory row>
                  <v-radio
                    v-for="n in 2"
                    :key="n"
                    :label="typesIp[n - 1]"
                    :value="typesIp[n - 1]"
                  ></v-radio
                ></v-radio-group>
              </div>
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
              <br />
              <module-segments-ip-plage
                :typeIp="typeIp"
                typeAcces="plage"
                v-on:FormModuleSegmentsIpPlageEvent="validate"
              >
              </module-segments-ip-plage>
            </v-col>
            <v-col>
              <v-alert dense outlined :value="alert" type="error">
                {{ error }}
              </v-alert>
              <h3>Nouvelles IP ou plages IP ajoutées</h3>
              <v-simple-table dense>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th style="width: 20%">Type</th>
                      <th>Adresse</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in arrayAjouterIp" :key="item.ip">
                      <td>{{ item.typeIp }}</td>
                      <td>{{ item.ip }}</td>
                      <td>
                        <v-btn
                          class="ma-0 pa-0 bouton-simple "
                          icon
                          title="Supprimer"
                          @click="supprimerIP"
                        >
                          <font-awesome-icon :icon="['fas', 'trash-alt']"
                        /></v-btn>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>

              <v-row id="fillHeight"></v-row>
              <v-row
                ><v-col cols="6"></v-col
                ><v-col>
                  <a @click="$router.push({ path: '/listeAcces' })"
                    ><font-awesome-icon :icon="['fas', 'reply']" />&nbsp;Revenir
                    à la liste complète des IP</a
                  ></v-col
                ></v-row
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
    <br />
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
  supprimerIP() {
    console.log("suppresion");
  }
}
</script>
<style scoped>
h1 {
  font-size: 30px;
}
#radioIP {
  padding-left: 20px !important;
}
#fillHeight {
  height: 80%;
}
</style>
