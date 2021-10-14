<template>
  <div>
    <v-card width="100%" outlined>
      <v-form ref="form" lazy-validation>
        <v-card-text>
          <v-row>
            <v-col lg="12" md="12" xs="12">
              <v-row>
                <v-col cols="2" />
                <v-col cols="8">
                  <v-card-title>Fusion d'établissements</v-card-title>
                  <v-card width="100%">
                    <v-card-title
                      >Siren des établissements à fusionner
                    </v-card-title>
                    <v-card-text>
                      <v-text-field
                        outlined
                        label="SIREN"
                        placeholder="SIREN"
                        v-model="sirenEtab[n - 1]"
                        :rules="sirenEtabRules"
                        required
                        @keyup.enter="validate()"
                        v-for="n in sirenNumber"
                        :key="n"
                      ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn @click="increaseSirenNumber"
                        >Ajouter un siren
                      </v-btn>
                      <v-btn @click="decreaseSirenNumber"
                        >Supprimer un siren
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                  <form-etab :bus="bus" v-on:formEtab="send"></form-etab>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col cols="9"></v-col>
            <v-col>
              <v-btn @click="clear()">Annuler </v-btn>
              <v-btn
                @click="triggerChildremForm()"
                :loading="buttonLoading"
                color="success"
                >Valider
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-form>
    </v-card>
    <br />
    <v-alert v-if="retourKo" dense outlined :value="alert" type="error">
      {{ message }}
    </v-alert>
    <v-alert v-else dense outlined :value="alert" type="success">
      {{ message }}
    </v-alert>
  </div>
</template>

<script lang="ts">
import FormEtab from "@/components/etablissement/FormEtab.vue";
import { Component, Vue } from "vue-property-decorator";
import { Logger } from "@/utils/Logger";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";

@Component({
  components: { FormEtab }
})
export default class FormFusionEtablissement extends Vue {
  sirenEtab: Array<string> = [];
  sirenEtabRules = [
    (v: string) => !!v || "SIREN obligatoire",
    (v: string) => /^\d{9}$/.test(v) || "Le SIREN doit contenir 9 chiffres"
  ];
  bus: Vue = new Vue();
  sirenNumber: number = 2;
  buttonLoading: boolean = false;
  alert: boolean = false;
  alertOK: boolean = false;
  retourKo: boolean = false;
  message: string = "";

  triggerChildremForm(): void {
    this.bus.$emit("submit");
  }

  send(payload: object): void {
    this.buttonLoading = true;
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      Logger.debug(
        JSON.stringify({
          nouveauEtab: payload,
          sirenFusionnes: this.sirenEtab
        })
      );
      etablissementService
        .fusion(this.$store.getters.getToken(), {
          etablissementDTO: payload,
          sirenFusionnes: this.sirenEtab
        })
        .then(response => {
          this.alert = true;
          this.buttonLoading = false;
          this.message = response.data;
          this.alert = true;
          this.clear();
        })
        .catch(err => {
          this.buttonLoading = false;
          this.message = err.response.data;
          this.alert = true;
          this.retourKo = true;
        });
    } else {
      this.buttonLoading = false;
    }
  }

  clear(): void {
    this.bus.$emit("clear");
  }

  increaseSirenNumber() {
    this.sirenNumber++;
  }

  decreaseSirenNumber() {
    this.sirenNumber--;
    this.sirenEtab.pop();
  }
}
</script>
