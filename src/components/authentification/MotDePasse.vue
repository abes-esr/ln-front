<template>
  <v-form ref="form" lazy-validation>
    <v-alert border="left" type="info" outlined>
      Votre mot de passe doit contenir au minimum 8 caractères, une
      lettre majuscule, une lettre minuscule, un chiffre et un caractère
      spécial parmis @ $ ! % * ? &
    </v-alert>
    <v-text-field
      v-if="action === Action.MODIFICATION"
      outlined
      label="Ancien mot de passe"
      placeholder="Ancien mot de passe"
      :type="show ? 'text' : 'password'"
      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      v-model="ancienMotDePasse"
      :rules="regleFormulaire.motDePasse.concat(regleConfirmationMotDePasse)"
      required
      @click:append="show = !show"
      autocomplete="new-password"
      @keyup.enter="validate()"
    ></v-text-field>
    <v-text-field
      outlined
      :label="action === Action.CREATION ? 'Mot de passe' : 'Nouveau mot de passe'"
      :placeholder="action === Action.CREATION ? 'Mot de passe' : 'Nouveau mot de passe'"
      :type="show ? 'text' : 'password'"
      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      v-model="nouveauMotDePasse"
      :rules="regleFormulaire.motDePasse.concat(regleMotDePasse)"
      required
      @click:append="show = !show"
      autocomplete="new-password"
      @keyup.enter="validate()"
    ></v-text-field>
    <v-text-field
      outlined
      :label="action === Action.CREATION ? 'Confirmation du mot de passe' : 'Confirmation du nouveau mot de passe'"
      :placeholder="action === Action.CREATION ? 'Confirmation du mot de passe' : 'Confirmation du nouveau mot de passe'"
      :type="show ? 'text' : 'password'"
      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      v-model="confirmationNouveauMotDePasse"
      :rules="regleFormulaire.motDePasse.concat(regleConfirmationMotDePasse)"
      required
      @click:append="show = !show"
      autocomplete="new-password"
      @keyup.enter="validate()"
    ></v-text-field>
  </v-form>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { rulesForms } from "@/core/RulesForm";
import { Action } from "@/core/CommonDefinition";
import {Logger} from "@/utils/Logger";

@Component
export default class MotDePasse extends Vue {
  @Prop() action!: Action;
  Action: any = Action;
  regleFormulaire: any = rulesForms;
  @Prop() ancienMotDePasse!: string;
  @Prop() nouveauMotDePasse!: string;
  confirmationNouveauMotDePasse: string = "";
  show: boolean = false;

  get regleMotDePasse() {
    return () => this.confirmationNouveauMotDePasse === "" ||
      this.nouveauMotDePasse === this.confirmationNouveauMotDePasse ||
      "Le mot de passe ne correspond pas au mot de passe confirmation";
  }

  get regleConfirmationMotDePasse() {
    return () =>
      this.nouveauMotDePasse === this.confirmationNouveauMotDePasse ||
      this.confirmationNouveauMotDePasse === "" ||
      "Le mot de passe de confirmation ne correspond pas au mot de passe";
  }

  @Watch("nouveauMotDePasse")
  motDepasse(value: string): void {
    if (this.confirmationNouveauMotDePasse != "") {
      (this.$refs.form as Vue & { validate: () => boolean }).validate();
    }
  }

  validate(): boolean {
    return (this.$refs.form as Vue & { validate: () => boolean }).validate();
  }

  clear(): void {
    (this.$refs.form as HTMLFormElement).resetValidation();
  }
}
</script>
