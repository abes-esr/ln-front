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
          <v-row
            ><v-col>
              <a @click="$router.push({ path: '/listeAcces' })"
                ><font-awesome-icon :icon="['fas', 'reply']" />&nbsp;Revenir à
                la liste complète des IP</a
              ></v-col
            ></v-row
          >
          <v-row>
            <v-col cols="12" md="7" class="pa-0">
              <v-card-title>
                Choisir le type d'adresse IP à déclarer
              </v-card-title></v-col
            >
            <v-col cols="12" md="3" class="pa-0">
              <v-card-text
                ><font-awesome-icon
                  :icon="['fas', 'info-circle']"
                  size="2x"
                /><a class="pl-3 pb-6"
                  >Tuto de déclaration des IP</a
                ></v-card-text
              >
            </v-col>
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
              <v-alert dense :value="message !== ''" :type="typeAlert">
                {{ message }}
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
                    <tr v-for="(item, index) in arrayAjouterIp" :key="item.ip">
                      <td>{{ item.typeIp }}</td>
                      <td>{{ item.ip }}</td>
                      <td>
                        <v-btn
                          class="ma-0 pa-0 bouton-simple "
                          icon
                          title="Supprimer"
                          @click="supprimerIP(item.id, index)"
                        >
                          <font-awesome-icon :icon="['fas', 'trash-alt']"
                        /></v-btn>
                      </td>
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
  </div>
</template>
<style src="./style.css"></style>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ModuleSegmentsIpPlage from "@/components/ip/ModuleSegmentsIpPlage.vue";
import { iPService } from "@/core/service/licencesnationales/IPService";
import { Logger } from "@/utils/Logger";

@Component({
  components: { ModuleSegmentsIpPlage }
})
export default class AjouterAcces extends Vue {
  id: string = "";
  ip: string = "";
  typeAcces: string = "";
  typesIp: Array<string> = ["IPV4", "IPV6"];
  typeIp: string = "IPV4";
  message: string = "";
  typeAlert: string = "success";
  arrayAjouterIp: Array<string> = [];

  validate(payloadFromModuleSegmentsIpPlage): void {
    this.arrayAjouterIp.push(payloadFromModuleSegmentsIpPlage);
  }
  clear() {
    this.arrayAjouterIp = [];
    this.message = "";
  }
  supprimerIP(idIP: string, index: number) {
    iPService
      .deleteIP(this.$store.getters.getToken(), idIP)
      .then(response => {
        this.typeAlert = "success";
        this.message = response.data.message;
        this.arrayAjouterIp.splice(index, 1);
      })
      .catch(err => {
        Logger.error(err.toString());
        this.typeAlert = "error";
        this.message = err.response.data.message;
      });
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
