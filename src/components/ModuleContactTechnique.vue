<template>
  <div>
    <v-form ref="formModuleCT" lazy-validation>
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
import { Component, Vue } from "vue-property-decorator";
import { Logger } from "@/utils/Logger";
import { AjouterContactsTechniquesEditeurEvent } from "@/main";
import { ModifierContactsTechniquesEditeurEvent } from "@/main";

@Component
export default class ModuleContactTechnique extends Vue {
  nomContactTechnique: string = "";
  nomContactTechniqueRules = [
    (v: string) => !!v || "Le nom du contact est obligatoire",
    (v: string) =>
      /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/.test(
        v
      ) || "Le nom fourni n'est pas valide"
  ];
  prenomContactTechnique: string = "";
  prenomContactTechniqueRules = [
    (v: string) => !!v || "Le prénom du contact est obligatoire",
    (v: string) =>
      /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/.test(
        v
      ) || "Le prénom fourni n'est pas valide"
  ];
  emailContactTechnique: string = "";
  emailContactTechniqueRules = [
    (v: string) => !!v || "L'adresse mail du contact est obligatoire",
    (v: string) =>
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v) ||
      "L'adresse mail fournie n'est pas valide"
  ];

  validate(): void {
    if (
        (this.$refs.formModuleCT as Vue & {
          validate: () => boolean;
        }).validate()
    ) {
      this.validAndSend();
    }
  }

  validAndSend(): void {
    Logger.debug("Validation CT");
    this.$emit("FormModuleContactTechniqueEvent", {
      nomContactTechnique: this.nomContactTechnique,
      prenomContactTechnique: this.prenomContactTechnique,
      mailContactTechnique: this.emailContactTechnique
    });
  }


  clear(): void {
    //(this.$refs.form as HTMLFormElement).reset();
  }

  mounted() {
    AjouterContactsTechniquesEditeurEvent.$on(
        "AjouterContactsTechniquesEditeurEvent",
        this.validate
    );
    AjouterContactsTechniquesEditeurEvent.$on("clear", this.clear);
    ModifierContactsTechniquesEditeurEvent.$on(
        "ModifierContactsTechniquesEditeurEvent",
        this.validate
    );
    ModifierContactsTechniquesEditeurEvent.$on("clear", this.clear);
  }
}
</script>
