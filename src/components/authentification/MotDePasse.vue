<template>
  <v-form ref="form" lazy-validation :disabled="isDisableForm">
    <v-alert outlined class="pa-3" v-if="linkIsExpired === false">
      <font-awesome-icon
        :icon="['fas', 'info-circle']"
        class="fa-2x mr-5 mb-1 mt-2 icone-information"
      />
      Le mot de passe doit contenir au moins 8 caractères, dont au moins un
      chiffre, une lettre majuscule, une lettre minuscule et un des caractères
      spéciaux suivants : @ $ ! % * ? &
    </v-alert>
    <v-alert outlined class="pa-3" v-if="linkIsExpired === true">
      <font-awesome-icon
        :icon="['fas', 'info-circle']"
        class="fa-2x mr-5 mb-1 mt-2 icone-information"
      />
      Ce lien n'est plus valide (expiration après 24 heures). Pour réinitialiser
      votre mot de passe : <a @click="allerPasswordReset()">cliquez ici.</a>
    </v-alert>
    <v-text-field
      v-if="action === Action.MODIFICATION && linkIsExpired === false"
      outlined
      label="Ancien mot de passe"
      placeholder="Ancien mot de passe"
      :type="show ? 'text' : 'password'"
      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      v-model="AncienMotDePasse"
      :rules="regleFormulaire.motDePasse.concat(regleConfirmationMotDePasse)"
      required
      @click:append="show = !show"
      autocomplete="new-password"
      @keyup.enter="validate()"
    ></v-text-field>
    <v-text-field
      v-if="linkIsExpired === false"
      outlined
      :label="
        action === Action.CREATION ? 'Mot de passe' : 'Nouveau mot de passe'
      "
      :placeholder="
        action === Action.CREATION ? 'Mot de passe' : 'Nouveau mot de passe'
      "
      :type="show ? 'text' : 'password'"
      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      v-model="NouveauMotDePasse"
      :rules="regleFormulaire.motDePasse.concat(regleMotDePasse)"
      required
      @click:append="show = !show"
      autocomplete="new-password"
      @keyup.enter="validate()"
    ></v-text-field>
    <v-text-field
      v-if="linkIsExpired === false"
      outlined
      :label="
        action === Action.CREATION
          ? 'Confirmation du mot de passe'
          : 'Confirmation du nouveau mot de passe'
      "
      :placeholder="
        action === Action.CREATION
          ? 'Confirmation du mot de passe'
          : 'Confirmation du nouveau mot de passe'
      "
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

@Component
export default class MotDePasse extends Vue {
  @Prop() action!: Action;
  Action: any = Action;
  regleFormulaire: any = rulesForms;
  @Prop() ancienMotDePasse!: string;
  @Prop() nouveauMotDePasse!: string;
  confirmationNouveauMotDePasse: string = "";
  show: boolean = false;
  @Prop() isDisableForm!: boolean;
  @Prop() linkIsExpired: boolean | undefined;

  get AncienMotDePasse() {
    return this.ancienMotDePasse;
  }
  set AncienMotDePasse(value: string) {
    this.$emit("update:ancienMotDePasse", value);
  }

  get NouveauMotDePasse() {
    return this.nouveauMotDePasse;
  }
  set NouveauMotDePasse(value: string) {
    this.$emit("update:nouveauMotDePasse", value);
  }

  get regleMotDePasse() {
    return () =>
      this.confirmationNouveauMotDePasse === "" ||
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
  motDepasse(): void {
    if (this.confirmationNouveauMotDePasse != "") {
      (this.$refs.form as Vue & { validate: () => boolean }).validate();
    }
  }

  validate(): boolean {
    return (this.$refs.form as Vue & { validate: () => boolean }).validate();
  }

  clear(): void {
    (this.$refs.form as HTMLFormElement).resetValidation();
    this.confirmationNouveauMotDePasse = "";
  }

  allerPasswordReset(): void {
    this.$router.push({ name: "ReinitialisationPass" });
  }
}
</script>
