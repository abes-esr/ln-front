<template>
  <v-card class="elevation-0">
    <v-form ref="form" lazy-validation>
      <v-card-title>Modifier mon mot de passe</v-card-title>
      <MessageBox></MessageBox>
      <v-card-text>
        <v-row>
          <v-col lg="12" md="12" xs="12">
            <v-row>
              <v-col cols="1" />
              <v-col cols="8">
                <MotDePasse
                  ref="motDePasse"
                  :action="Action.MODIFICATION"
                  :ancien-mot-de-passe="this.newPassword"
                  :nouveau-mot-de-passe="this.newPassword"
                ></MotDePasse>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-row>
          <v-col cols="10"></v-col>
          <v-col>
            <v-btn
              color="success"
              :loading="buttonLoading"
              x-large
              @click="validate()"
              >Envoyer
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Logger } from "@/utils/Logger";
import { LicencesNationalesUnauthorizedApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesUnauthorizedApiError";
import { authService } from "@/core/service/licencesnationales/AuthentificationService";
import { rulesForms } from "@/core/RulesForm";
import MotDePasse from "@/components/authentification/MotDePasse.vue";
import {Action, Message, MessageType} from "@/core/CommonDefinition";
import {LicencesNationalesBadRequestApiError} from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import MessageBox from "@/components/common/MessageBox.vue";
@Component({
  components: {MessageBox, MotDePasse }
})
export default class ChangePassword extends Vue {
  Action: any = Action;
  rulesForms: any = rulesForms;
  alert: boolean = false;
  show: boolean = false;
  message: string = "";
  buttonLoading: boolean = false;
  oldPassword: string = "";
  newPassword: string = "";
  validate(): void {
    this.alert = false;
    this.message = "";
    if (
      (this.$refs.form as Vue & { validate: () => boolean }).validate() &&
      (this.$refs.motDePasse as Vue & { validate: () => boolean }).validate()
    )
      this.submit();
  }

  submit(): void {
    this.buttonLoading = true;
    authService
      .changePassword(
        {
          ancienMotDePasse: this.oldPassword,
          nouveauMotDePasse: this.newPassword
        },
        this.$store.getters.getToken
      )
      .then(response => {
        const message: Message = new Message();
        message.type = MessageType.VALIDATION;
        message.texte = response.message;
        message.isSticky = true;
        this.$store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err);
        });

        setTimeout(() => {
          this.$router.push({ name: "Home" });
        }, 2000);
      })
      .catch(err => {
        Logger.error(err.toString());
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        if (err instanceof LicencesNationalesBadRequestApiError) {
          message.texte = err.message;
        } else {
          message.texte = "Impossible d'exécuter l'action : " + err.message;
        }
        message.isSticky = true;

        this.$store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err.toString());
        });
      }) .finally(() => {
      this.buttonLoading = false;
    });;
  }
}
</script>
