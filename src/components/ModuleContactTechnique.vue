<template>
  <div>
    <v-form ref="form" lazy-validation>
      <v-card-title>Contact technique</v-card-title>

      <v-text-field
        outlined
        label="Nom"
        placeholder="Nom"
        v-model="nomContactTechnique"
        :rules="nomContactTechniqueRules"
        required
        @keyup.enter="validate()"
      ></v-text-field>
      <v-text-field
        outlined
        label="Prénom"
        placeholder="Prénom"
        v-model="prenomContactTechnique"
        :rules="prenomContactTechniqueRules"
        required
        @keyup.enter="validate()"
      ></v-text-field>
      <v-text-field
        outlined
        label="Adresse e-mail"
        placeholder="Adresse e-mail"
        v-model="emailContactTechnique"
        :rules="emailContactTechniqueRules"
        required
        @keyup.enter="validate()"
      ></v-text-field>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { AjouterContactsEditeurEvent } from "@/main";
import { Logger } from "@/utils/Logger";

export default Vue.extend({
  name: "ModuleContactTechnique",
  data() {
    return {
      nomContactTechnique: "" as string,
      nomContactTechniqueRules: [
        (v: any) => !!v || "Le nom du contact est obligatoire",
        (v: any) =>
          /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/.test(
            v
          ) || "Le nom fourni n'est pas valide"
      ],
      prenomContactTechnique: "" as string,
      prenomContactTechniqueRules: [
        (v: any) => !!v || "Le prénom du contact est obligatoire",
        (v: any) =>
          /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/.test(
            v
          ) || "Le prénom fourni n'est pas valide"
      ],
      emailContactTechnique: "" as string,
      emailContactTechniqueRules: [
        (v: any) => !!v || "L'adresse mail du contact est obligatoire",
        (v: any) =>
          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v) ||
          "L'adresse mail fournie n'est pas valide"
      ]
    };
  },
  methods: {
    validAndSend(): void {
      Logger.debug("Validation");
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        this.$emit("FormModuleContactTechniqueEvent", {
          nomContactTechnique: this.nomContactTechnique,
          prenomContactTechnique: this.prenomContactTechnique,
          mailContactTechnique: this.emailContactTechnique
        });
      }
    },
    clear(): void {
      //(this.$refs.form as HTMLFormElement).reset();
    }
  },
  mounted() {
    AjouterContactsEditeurEvent.$on(
      "ajouterContactsEditeurEvent",
      this.validAndSend
    );
    AjouterContactsEditeurEvent.$on("clear", this.clear);
    /*this.bus.$on("submit", this.validAndSend);
    this.bus.$on("clear", this.clear);*/
  }
});
</script>

<style scoped></style>
