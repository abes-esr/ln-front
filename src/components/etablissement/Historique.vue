<template>
  <div>
    <MessageBox></MessageBox>
    <v-card flat>
      <h1>Historique par établissement</h1>
      <br />
      <v-alert :value="message !== ''" dense type="error">
        {{ message }}
      </v-alert>

      <v-form ref="searchForm">
        <v-row>
          <v-col cols="1" class="d-none d-md-flex"></v-col>
          <v-col cols="12" md="10">
            <v-card-text class="fondGris">
              <v-select
                v-model="select"
                :items="etabs"
                item-text="nom"
                item-value="siren"
                label="Etablissement"
                placeholder="Séléctionner un établissement"
                persistent-placeholder
                outlined
                filled
                @change="getHistorique(select)"
              ></v-select
            ></v-card-text> </v-col
        ></v-row>
      </v-form>
      <v-row>
        <v-col cols="1" class="d-none d-md-flex"></v-col>
        <v-col cols="12" md="10">
          <v-tabs>
            <v-tab>Etablissements</v-tab>
            <v-tab>IPs</v-tab>
            <v-tab-item
              ><v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Date
                      </th>
                      <th class="text-left">
                        Action
                      </th>
                      <th class="text-left">
                        Informations
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in etabHisto" :key="item.date">
                      <td>{{ item.date }}</td>
                      <td>{{ item.event }}</td>
                      <td>
                        <span v-for="(value, name) in item" :key="name">
                          <span
                            v-if="
                              value !== null &&
                                name != 'event' &&
                                name != 'date' &&
                                name != 'siren'
                            "
                          >
                            {{ name }} : {{ value }},&nbsp;
                          </span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table></v-tab-item
            >
            <v-tab-item
              ><v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Date
                      </th>
                      <th class="text-left">
                        Action
                      </th>
                      <th class="text-left">
                        Informations
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in ipHisto" :key="item.date">
                      <td>{{ item.date }}</td>
                      <td>{{ item.event }}</td>
                      <td>
                        <span v-for="(value, name) in item" :key="name">
                          <span
                            v-if="
                              value !== null &&
                                name != 'event' &&
                                name != 'date'
                            "
                          >
                            {{ name }} : {{ value }},&nbsp;
                          </span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table></v-tab-item
            >
          </v-tabs>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import { iPService } from "@/core/service/licencesnationales/IPService";
import MessageBox from "@/components/common/MessageBox.vue";
import Etablissement from "@/core/Etablissement";
import { Message, MessageType } from "@/core/CommonDefinition";

@Component({
  components: { MessageBox }
})
export default class Historique extends Vue {
  etabs: Array<Etablissement> = [];
  message: string = "";
  select: string = "";
  etabHisto: Array<any> = [];
  ipHisto: Array<any> = [];

  mounted() {
    this.collecterEtab();
  }

  collecterEtab(): void {
    this.$store.dispatch("closeDisplayedMessage");
    etablissementService
      .getEtablissements(this.$store.getters.getToken())
      .then(response => {
        this.etabs = response;
      })
      .catch(err => {
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        message.texte = "Impossible d'exécuter l'action : " + err.message;
        message.isSticky = true;
        this.$store.dispatch("openDisplayedMessage", message);
      });
  }

  getHistorique(siren: string): void {
    console.log(siren);
    etablissementService
      .getHisto(siren, this.$store.getters.getToken())
      .then(response => {
        this.etabHisto = response.data;
      })
      .catch(err => {
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        message.texte = err.message;
        message.isSticky = true;
        this.$store.dispatch("openDisplayedMessage", message);
      });

    iPService
      .getHisto(siren, this.$store.getters.getToken())
      .then(response => {
        this.ipHisto = response.data;
      })
      .catch(err => {
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        message.texte = err.message;
        message.isSticky = true;
        this.$store.dispatch("openDisplayedMessage", message);
      });
  }
}
</script>
