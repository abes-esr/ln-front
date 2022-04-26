<template>
  <v-card elevation="0">
    <v-card-title class="pa-3"><h1>S'authentifier</h1></v-card-title>
    <MessageBox></MessageBox>
    <v-card-text class="rounded pa-3 fondGris">
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col cols="1" />
          <v-col cols="10" class="pb-0">
            <v-text-field
              ref="login"
              outlined
              filled
              placeholder="SIREN"
              maxlength="9"
              v-model="siren"
              :rules="rulesForms.siren"
              append-icon="mdi-information"
              required
              @keyup.enter="validate()"
            >
              <template v-slot:append>
                <a
                  class="noUnderlineLink"
                  href="https://annuaire-entreprises.data.gouv.fr/"
                  target="_blank"
                >
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">
                        mdi-information
                      </v-icon>
                    </template>
                    Trouver le numéro SIREN de votre établissement
                  </v-tooltip>
                </a></template
              >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1" />
          <v-col cols="10" class="pt-0">
            <v-text-field
              ref="password"
              outlined
              filled
              placeholder="Mot de passe"
              :type="show ? 'text' : 'password'"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              v-model="password"
              :rules="rulesForms.motDePasse"
              required
              @click:append="show = !show"
              @keyup.enter="validate()"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <a @click="afficherMotDePasseOulie()">Mot de passe oublié ?</a>
          </v-col>
          <v-col>
            <v-btn class="btn-1" :loading="buttonLoading" @click="validate()"
              >Se connecter
              <v-icon>mdi-arrow-right-circle-outline </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { Logger } from "@/utils/Logger";
import { LicencesNationalesBadRequestApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import { rulesForms } from "@/core/RulesForm";
import { Message, MessageType } from "@/core/CommonDefinition";
import MessageBox from "@/components/common/MessageBox.vue";

@Component({ components: { MessageBox } })
export default class FormLogin extends Vue {
  rulesForms: any = rulesForms;
  siren: string = "";
  password: string = "";
  buttonLoading: boolean = false;
  isValid: boolean = false;
  show: boolean = false;
  creationCompteEffectuee: boolean = false;

  validate(): void {
    this.$store.dispatch("closeDisplayedMessage");
    this.isValid = !!(
      (this.$refs.login as Vue & { valid: () => boolean }).valid &&
      (this.$refs.password as Vue & { valid: () => boolean }).valid
    );
    if (this.isValid) {
      this.login();
    }
  }

  login(): void {
    this.buttonLoading = true;
    this.$store.dispatch("closeDisplayedMessage");

    this.$store
      .dispatch("login", { login: this.siren, password: this.password })
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
      })
      .finally(() => {
        this.buttonLoading = false;
      });
  }

  afficherMotDePasseOulie(): void {
    this.$emit("onChange"); // On notifie le composant parent
  }
}
</script>
