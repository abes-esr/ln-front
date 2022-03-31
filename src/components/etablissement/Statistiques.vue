<template>
  <div>
    <MessageBox></MessageBox>
    <v-card flat>
      <h1>Statistiques de l'application</h1>
      <br />
      <v-alert :value="message !== ''" dense type="error">
        {{ message }}
      </v-alert>
      <h2>
        Saisissez la période souhaitée pour les statistiques
      </h2>
      <v-form ref="form">
        <v-row>
          <v-col cols="12" sm="4" md="3" lg="2">
            <v-menu
              ref="menuDateDebut"
              v-model="menuDateDebut"
              :close-on-content-click="false"
              :return-value.sync="dateDebut"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  ref="dateDebut"
                  v-model="formattedDateDebut"
                  label="Date de début"
                  prepend-icon="mdi-calendar"
                  :rules="rulesForms.dateRules"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dateDebut"
                :show-current="false"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn text @click="menuDateDebut = false">
                  Annuler
                </v-btn>
                <v-btn text @click="$refs.menuDateDebut.save(dateDebut)">
                  Valider
                </v-btn>
              </v-date-picker>
            </v-menu></v-col
          >

          <v-col cols="12" sm="4" md="3" lg="2">
            <v-menu
              ref="menuDateFin"
              v-model="menuDateFin"
              :close-on-content-click="false"
              :return-value.sync="dateFin"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  ref="dateFin"
                  v-model="formattedDateFin"
                  label="Date de fin"
                  prepend-icon="mdi-calendar"
                  :rules="rulesForms.dateRules"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dateFin"
                :show-current="false"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn text @click="menudateFin = false">
                  Annuler
                </v-btn>
                <v-btn text @click="$refs.menuDateFin.save(dateFin)">
                  Valider
                </v-btn>
              </v-date-picker>
            </v-menu></v-col
          >
          <v-col cols="12" sm="4" md="2">
            <v-btn @click="getStats()">Valider</v-btn>
          </v-col>
        </v-row>
      </v-form>
      <div v-if="etabStats.length > 0">
        <v-row>
          <h3>
            Statistiques entre le {{ formattedDateDebut }} et le
            {{ formattedDateFin }}
          </h3></v-row
        >
        <v-row>
          <v-list subheader>
            <v-subheader>Etablissements</v-subheader>
            <v-list-item v-for="item in etabStats" :key="item.index">
              <div v-for="(value, name) in item" :key="name">
                {{ name }} : {{ value }}
              </div>
            </v-list-item>
            <v-divider></v-divider>
          </v-list>
          <v-list subheader>
            <v-subheader>Adresses et plages IP</v-subheader>
            <v-list-item v-for="item in ipStats" :key="item.index">
              <div v-for="(value, name) in item" :key="name">
                {{ name }} : {{ value }}
              </div>
            </v-list-item>
          </v-list>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import { iPService } from "@/core/service/licencesnationales/IPService";
import MessageBox from "@/components/common/MessageBox.vue";
import { Message, MessageType } from "@/core/CommonDefinition";
import { rulesForms } from "@/core/RulesForm";
import moment from "moment";

@Component({
  components: { MessageBox }
})
export default class Statistiques extends Vue {
  rulesForms: any = rulesForms;
  message: string = "";
  etabStats: Array<any> = [];
  ipStats: Array<any> = [];
  dateDebut: string = "";
  dateFin: string = "";
  menuDateDebut: boolean = false;
  menuDateFin: boolean = false;

  get formattedDateDebut() {
    return this.dateDebut ? moment(this.dateDebut).format("DD-MM-yyyy") : "";
  }

  get formattedDateFin() {
    return this.dateFin ? moment(this.dateFin).format("DD-MM-yyyy") : "";
  }

  getStats(): void {
    if (
      (this.$refs.form as Vue & {
        validate: () => boolean;
      }).validate()
    ) {
      etablissementService
        .getStats(
          this.formattedDateDebut,
          this.formattedDateFin,
          this.$store.getters.getToken()
        )
        .then(response => {
          this.etabStats = response.data.stats;
        })
        .catch(err => {
          const message: Message = new Message();
          message.type = MessageType.ERREUR;
          message.texte = err.message;
          message.isSticky = true;
          this.$store.dispatch("openDisplayedMessage", message);
        });

      iPService
        .getStats(
          this.formattedDateDebut,
          this.formattedDateFin,
          this.$store.getters.getToken()
        )
        .then(response => {
          this.ipStats = response.data.stats;
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
}
</script>

<style>
.theme--light tbody tr:nth-of-type(odd) {
  background-color: white !important;
}

.theme--dark tbody tr:nth-of-type(odd) {
  background-color: #424242 !important;
}

.theme--light .v-picker .v-btn {
  background-color: white !important;
  color: black !important;
}

.theme--dark .v-picker .v-btn {
  background-color: #424242 !important;
  color: white !important;
}
</style>
