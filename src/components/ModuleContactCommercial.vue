<template>
  <div>
    <v-form ref="formModuleCC" lazy-validation>
      <v-card-title>Contact commercial</v-card-title>

      <v-text-field
        outlined
        label="Nom"
        placeholder="Nom"
        v-model="nomContactCommercial"
        :rules="nomContactCommercialRules"
        required
        @keyup.enter="validate()"
      ></v-text-field>
      <v-text-field
        outlined
        label="Prénom"
        placeholder="Prénom"
        v-model="prenomContactCommercial"
        :rules="prenomContactCommercialRules"
        required
        @keyup.enter="validate()"
      ></v-text-field>
      <v-text-field
        outlined
        label="Adresse e-mail"
        placeholder="Adresse e-mail"
        v-model="emailContactCommercial"
        :rules="emailContactCommercialRules"
        required
        @keyup.enter="validate()"
      ></v-text-field>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Logger } from "@/utils/Logger";
import { AjouterContactsCommerciauxEditeurEvent } from "@/main";
import { ModifierContactsCommerciauxEditeurEvent } from "@/main";

@Component
export default class ModuleContactCommercial extends Vue {
  nomContactCommercial: string = "";
  nomContactCommercialRules = [
    (v: string) => !!v || "Le nom du contact est obligatoire",
    (v: string) =>
      /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/.test(
        v
      ) || "Le nom fourni n'est pas valide"
  ];
  prenomContactCommercial: string = "";
  prenomContactCommercialRules = [
    (v: any) => !!v || "Le prénom du contact est obligatoire",
    (v: any) =>
      /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/.test(
        v
      ) || "Le prénom fourni n'est pas valide"
  ];
  emailContactCommercial: string = "";
  emailContactCommercialRules = [
    (v: any) => !!v || "L'adresse mail du contact est obligatoire",
    (v: any) =>
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v) ||
      "L'adresse mail fournie n'est pas valide"
  ];

  //la méthode validate est neccesaire parceque elle permet dès le mounted de détecter si un module est remplit ou pas du tout
  //donc au moment de valider le form NouvelEditeur, elle permet de rappeler à l'utilisateur que les champs sont vides
  //et de le pousser intuitivement à supprimer le module inutilisé
  //cette action est necessaire pour que le compteur CC et CT soit correct
  validate(): void {
    if (
      (this.$refs.formModuleCC as Vue & {
        validate: () => boolean;
      }).validate()
    ) {
      this.validAndSend();
    }
  }

  validAndSend(): void {
    Logger.debug("Validation CC");
    this.$emit("FormModuleContactCommercialEvent", {
      nomContactCommercial: this.nomContactCommercial,
      prenomContactCommercial: this.prenomContactCommercial,
      mailContactCommercial: this.emailContactCommercial
    });
  }

  clear(): void {
    //(this.$refs.form as HTMLFormElement).reset();
  }

  mounted() {
    AjouterContactsCommerciauxEditeurEvent.$on(
      "AjouterContactsCommerciauxEditeurEvent",
      this.validate
    );
    AjouterContactsCommerciauxEditeurEvent.$on("clear", this.clear);
    ModifierContactsCommerciauxEditeurEvent.$on(
      "ModifierContactsCommerciauxEditeurEvent",
      this.validate
    );
    AjouterContactsCommerciauxEditeurEvent.$on("clear", this.clear);
  }
}
</script>
