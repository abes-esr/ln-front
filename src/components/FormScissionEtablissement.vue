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
                  <v-card-title>Scission d'établissement</v-card-title>
                  <v-card width="100%">
                    <v-card-title
                      >Siren de l'établissements à scinder</v-card-title
                    >
                    <v-card-text>
                      <v-text-field
                        outlined
                        label="SIREN"
                        placeholder="SIREN"
                        v-model="sirenEtab"
                        :rules="sirenEtabRules"
                        required
                        @keyup.enter="validate()"
                      ></v-text-field>
                    </v-card-text>
                  </v-card>
                  <form-etab
                    :bus="bus"
                    v-on:formEtab="send"
                    v-for="n in etablissementNumber"
                    :key="n"
                  ></form-etab>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="v-card__actions">
          <v-row>
            <v-col cols="3"></v-col>
            <v-main>Nombre d'établissement : {{ etablissementNumber }}</v-main>
          </v-row>
          <v-row>
            <v-col cols="3"></v-col>
            <v-col>
              <v-btn @click="increaseEtablissementNumber"
                >Ajouter un etablissement
              </v-btn>
            </v-col>
            <v-col>
              <v-btn @click="decreaseEtablissementNumber"
                >Supprimer un etablissement
              </v-btn>
            </v-col>
            <v-col cols="3"></v-col>
          </v-row>
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
import FormEtab from "@/components/FormEtab.vue";
import Vue from "vue";
import { HTTP } from "../utils/http-commons";

export default Vue.extend({
  name: "FormFusionEtablissement",
  components: { FormEtab },
  data() {
    return {
      sirenEtab: "",
      sirenEtabRules: [
        (v: any) => !!v || "SIREN obligatoire",
        (v: any) => /^\d{9}$/.test(v) || "Le SIREN doit contenir 9 chiffres"
      ],
      bus: new Vue(),
      etablissementNumber: 2,
      etablissementDTOS: [],
      buttonLoading: false,
      alert: false,
      alertOK: false,
      retourKo: false,
      message: ""
    };
  },
  methods: {
    triggerChildremForm(): void {
      this.bus.$emit("submit");
    },
    send(payload: never): void {
      this.buttonLoading = true;
      this.etablissementDTOS.push(payload);

      if (this.etablissementDTOS.length == this.etablissementNumber) {
        if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
          console.log({
            ancienSiren: this.sirenEtab,
            etablissementDTOS: this.etablissementDTOS
          });

          this.alert = false;
          this.message = "";
          this.retourKo = false;
          HTTP.post(
            process.env.VUE_APP_ROOT_API + "ln/etablissement/division",
            {
              ancienSiren: this.sirenEtab,
              etablissementDTOS: this.etablissementDTOS
            }
          )
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
        }
      }
    },
    clear(): void {
      this.bus.$emit("clear");
    },
    increaseEtablissementNumber: function() {
      this.etablissementNumber++;
    },
    decreaseEtablissementNumber: function() {
      this.etablissementNumber--;
    }
  }
});
</script>

<style scoped>
.v-card__actions {
  display: block;
}
</style>
