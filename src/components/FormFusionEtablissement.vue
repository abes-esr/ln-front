<template>
  <div>
    <v-card width="100%">
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
              <v-btn @click="triggerChildremForm()" color="success"
                >Valider
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-form>
    </v-card>
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
      sirenEtab: [],
      sirenEtabRules: [
        (v: any) => !!v || "SIREN obligatoire",
        (v: any) => /^\d{9}$/.test(v) || "Le SIREN doit contenir 9 chiffres"
      ],
      bus: new Vue(),
      sirenNumber: 2
    };
  },
  methods: {
    triggerChildremForm(): void {
      this.bus.$emit("submit");
    },
    send(payload: object): void {
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        console.log({
          etablissementDTO: payload,
          sirenFusionnes: this.sirenEtab
        });
        HTTP.post(process.env.VUE_APP_ROOT_API + "ln/etablissement/fusion", {
          etablissementDTO: payload,
          sirenFusionnes: this.sirenEtab
        })
          .then(res => {
            res.status;
          })
          .catch(err => {
            err.data();
          });
      }
    },
    increaseSirenNumber: function() {
      this.sirenNumber++;
    },
    decreaseSirenNumber: function() {
      this.sirenNumber--;
      this.sirenEtab.pop();
    }
  }
});
</script>

<style scoped></style>
