<template>
  <div>
    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col lg="12" md="12" xs="12">
          <v-row>
            <v-col cols="2" />
            <v-col cols="8">
              <v-card-title>Fusion d'établissements</v-card-title>
              <v-card>
                <v-card-text>
                  <v-card-title
                    >Siren des établissements à fusionner
                  </v-card-title>
                  <v-row>
                    <v-col cols="4" xs="12" v-for="n in sirenNumber" :key="n">
                      <v-text-field
                        outlined
                        label="SIREN"
                        placeholder="SIREN"
                        v-model="sirenEtab[n - 1]"
                        :rules="rulesForms.siren"
                        required
                      ></v-text-field></v-col
                  ></v-row>
                  <v-card-actions>
                    <v-btn @click="increaseSirenNumber"
                      >Ajouter un siren
                    </v-btn>
                    <v-btn @click="decreaseSirenNumber"
                      >Supprimer un siren
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
              <form-etablissement
                :listeSirenFusion="sirenEtab"
                :action="Action.FUSION"
              ></form-etablissement>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FormEtablissement from "@/components/etablissement/FormEtablissement.vue";
import { rulesForms } from "@/core/RulesForm";
import { Action } from "@/core/CommonDefinition";

@Component({
  components: { FormEtablissement }
})
export default class FormFusionEtablissement extends Vue {
  sirenEtab: Array<string> = ["", ""];
  sirenNumber: number = 2;
  rulesForms: any = rulesForms;
  Action: any = Action;

  increaseSirenNumber() {
    this.sirenNumber++;
  }

  decreaseSirenNumber() {
    if (this.sirenNumber > 2) {
      this.sirenNumber--;
      this.sirenEtab.pop();
    }
  }
}
</script>
