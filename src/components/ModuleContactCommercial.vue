<template>
  <div>
    <v-form ref="form" lazy-validation>
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
import {Component, Vue} from "vue-property-decorator";
import {AjouterContactsEditeurEvent} from "@/main";
import {Logger} from "@/utils/Logger";

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

  validAndSend(): void {
    Logger.debug("Validation");
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      this.$emit("FormModuleContactCommercialEvent", {
        nomContactCommercial: this.nomContactCommercial,
        prenomContactCommercial: this.prenomContactCommercial,
        mailContactCommercial: this.emailContactCommercial
      });
    }
  }

  clear(): void {
    //(this.$refs.form as HTMLFormElement).reset();
  }

  mounted() {
    AjouterContactsEditeurEvent.$on(
      "ajouterContactsEditeurEvent",
      this.validAndSend
    );
    AjouterContactsEditeurEvent.$on("clear", this.clear);
    /*this.bus.$on("submit", this.validAndSend);
    this.bus.$on("clear", this.clear);*/
  }
}
</script>
