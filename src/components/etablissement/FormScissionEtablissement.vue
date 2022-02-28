<template>
  <div>
    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col lg="12" md="12" xs="12">
          <v-row>
            <v-col cols="2" xs="0" />
            <v-col cols="8" xs="12">
              <v-card-title>Scission d'établissements</v-card-title>
              <v-card>
                <v-card-text>
                  <v-row>
                    <v-card-title
                      >Siren de l'établissements à scinder</v-card-title
                    >
                    <v-col cols="3">
                      <v-text-field
                        outlined
                        label="SIREN"
                        placeholder="SIREN"
                        v-model="sirenEtab"
                        :rules="rulesForms.siren"
                        class="pt-6"
                        required
                        @keyup.enter="validate()"
                      ></v-text-field></v-col
                  ></v-row>

                  <v-card-actions>
                    <h3>Nombre d'établissements : {{ etablissementNumber }}</h3>
                    <v-btn @click="increaseEtablissementNumber"
                      >Ajouter un etablissement
                    </v-btn>
                    <v-btn @click="decreaseEtablissementNumber"
                      >Supprimer un etablissement
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
              <form-etablissement
                :action="Action.SCISSION"
                :triggerScission="triggerScission"
                v-on:send="send"
                v-for="n in etablissementNumber"
                :key="n"
              ></form-etablissement>
              <v-card-actions class="v-card__actions">
                <v-row>
                  <v-spacer class="hidden-sm-and-down"></v-spacer>
                  <v-col
                    cols="12"
                    md="3"
                    lg="3"
                    xl="3"
                    class="d-flex justify-space-around mr-16 flex-wrap"
                  >
                    <v-btn
                      @click="triggerChildremForm()"
                      :loading="buttonLoading"
                      x-large
                      color="button"
                      >Enregistrer
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
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
import FormEtablissement from "@/components/etablissement/FormEtablissement.vue";
import { Logger } from "@/utils/Logger";
import { Component, Vue } from "vue-property-decorator";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import { rulesForms } from "@/core/RulesForm";
import { Action, Message, MessageType } from "@/core/CommonDefinition";

@Component({
  components: { FormEtablissement }
})
export default class FormScissionEtablissement extends Vue {
  sirenEtab: string = "";
  etablissementNumber: number = 2;
  etablissementDTOS: Array<string> = [];
  buttonLoading: boolean = false;
  rulesForms: any = rulesForms;
  Action: any = Action;
  triggerScission: boolean = false;

  triggerChildremForm(): void {
    this.triggerScission = true;
  }

  send(payload): void {
    this.buttonLoading = true;
    this.etablissementDTOS.push(payload);
    if (this.etablissementDTOS.length === this.etablissementNumber) {
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        etablissementService
          .scission(this.$store.getters.getToken(), {
            sirenScinde: "this.sirenEtab",
            nouveauxEtabs: this.etablissementDTOS
          })
          .then(() => {
            const message: Message = new Message();
            message.type = MessageType.VALIDATION;
            message.texte = "Scission effectuée.";
            message.isSticky = true;
            this.$store.dispatch("openDisplayedMessage", message).catch(err => {
              Logger.error(err.toString());
            });
            this.$router.push({ name: "ListeEtab" }).catch(err => {
              Logger.error(err);
            });
          })
          .catch(err => {
            const message: Message = new Message();
            message.type = MessageType.ERREUR;
            message.texte = err.response.data.message;
            message.isSticky = true;
            this.$store.dispatch("openDisplayedMessage", message).catch(err => {
              Logger.error(err.toString());
            });
            // On glisse sur le message d'erreur
            const messageBox = document.getElementById("messageBox");
            if (messageBox) {
              window.scrollTo(0, messageBox.offsetTop);
            }
          })
          .finally(() => {
            this.buttonLoading = false;
            this.triggerScission = false;
            this.etablissementDTOS = [];
          });
      } else {
        this.buttonLoading = false;
        this.etablissementDTOS = [];
      }
    }
  }

  increaseEtablissementNumber() {
    this.etablissementNumber++;
  }

  decreaseEtablissementNumber() {
    if (this.etablissementNumber > 2) this.etablissementNumber--;
  }
}
</script>
