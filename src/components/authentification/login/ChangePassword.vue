<template>
  <v-container fill-height class="d-flex justify-center">
    <v-col cols="8">
      <v-row align="center" justify="center">
        <v-card flat>
          <v-form ref="form" lazy-validation>
            <h1 class="pb-4">Modifier mon mot de passe</h1>
            <MessageBox></MessageBox>
            <v-card-text class="fondGris">
              <div class="pt-4 px-4">
                <MotDePasse
                  ref="motDePasse"
                  :action="Action.MODIFICATION"
                  :ancien-mot-de-passe="this.oldPassword"
                  :nouveau-mot-de-passe="this.newPassword"
                  :linkIsExpired="false"
                  @update:ancienMotDePasse="updateAncienMotDePasse"
                  @update:nouveauMotDePasse="updateNouveauMotDePasse"
                  :isDisableForm="isDisableForm"
                ></MotDePasse>
              </div>
              <v-spacer class="hidden-sm-and-down"></v-spacer>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn :loading="buttonLoading" x-large @click="validate()"
                  >Valider
                  <v-icon class="pl-2"
                    >mdi-arrow-right-circle-outline
                  </v-icon></v-btn
                >
              </v-col>
            </v-card-text>
          </v-form>
        </v-card></v-row
      ></v-col
    ></v-container
  >
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Logger } from "@/utils/Logger";
import { authService } from "@/core/service/licencesnationales/AuthentificationService";
import { rulesForms } from "@/core/RulesForm";
import MotDePasse from "@/components/authentification/MotDePasse.vue";
import { Action, Message, MessageType } from "@/core/CommonDefinition";
import { LicencesNationalesBadRequestApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import MessageBox from "@/components/common/MessageBox.vue";

@Component({
  components: { MessageBox, MotDePasse }
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
  isDisableForm: boolean = false;

  constructor() {
    super();
    window.scrollTo(0, 0);
  }

  updateAncienMotDePasse(value: string) {
    this.oldPassword = value;
  }

  updateNouveauMotDePasse(value: string) {
    this.newPassword = value;
  }

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
    this.$store.dispatch("closeDisplayedMessage");
    authService
      .changePassword(
        this.oldPassword,
        this.newPassword,
        this.$store.getters.getToken()
      )
      .then(() => {
        const message: Message = new Message();
        message.type = MessageType.VALIDATION;
        message.texte = "Le mot de passe a été mis à jour";
        message.isSticky = true;
        this.$store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err);
        });
        // On glisse sur le message d'erreur
        const messageBox = document.getElementById("messageBox");
        if (messageBox) {
          window.scrollTo(0, messageBox.offsetTop);
        }

        setTimeout(() => {
          this.$store.dispatch("closeDisplayedMessage");
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
        // On glisse sur le message d'erreur
        const messageBox = document.getElementById("messageBox");
        if (messageBox) {
          window.scrollTo(0, messageBox.offsetTop);
        }
      })
      .finally(() => {
        this.buttonLoading = false;
      });
  }

  clear() {
    this.$store.dispatch("closeDisplayedMessage");
    this.$router.push({ name: "Home" }).catch(err => {
      Logger.error(err);
    });
  }
}
</script>
