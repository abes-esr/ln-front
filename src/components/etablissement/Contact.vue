<template>
  <v-form ref="form" lazy-validation>
    <v-row>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          label="Nom"
          placeholder="Nom"
          v-model="contact.nom"
          :rules="rulesForms.nomContactRules"
          required
          @keyup.enter="validate()"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          label="Téléphone"
          placeholder="Téléphone"
          maxlength="10"
          v-model="contact.telephone"
          :rules="rulesForms.telContactRules"
          required
          @keyup.enter="validate()"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          label="Prénom"
          placeholder="Prénom"
          v-model="contact.prenom"
          :rules="rulesForms.prenomContactRules"
          required
          @keyup.enter="validate()"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          label="Mail de contact"
          placeholder="Mail de contact"
          v-model="contact.mail"
          :rules="rulesForms.emailContactRules"
          required
          @keyup.enter="validate()"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          label="Adresse"
          placeholder="Adresse"
          maxlength="80"
          v-model="contact.adresse"
          :rules="rulesForms.adresseContactRules"
          required
          @keyup.enter="validate()"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          label="Confirmez votre adresse e-mail"
          placeholder="Confirmez votre adresse e-mail"
          v-model="emailConfirmation"
          :rules="rulesForms.confirmEmailContactRules"
          required
          @keyup.enter="validate()"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          label="Boite Postal"
          placeholder="Boite Postal"
          v-model="contact.boitePostale"
          required
          @keyup.enter="validate()"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-alert border="left" type="info" outlined>
          Votre mot de passe doit contenir au minimum 8 caractères dont une
          lettre majuscule, une lettre minuscule, un chiffre et un caractère
          spécial parmis @ $ ! % * ? &
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          label="Code Postal"
          placeholder="Code Postal"
          maxlength="5"
          v-model="contact.codePostal"
          :rules="rulesForms.codePostalContactRules"
          required
          @keyup.enter="validate()"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          label="Mot de passe"
          placeholder="Mot de passe"
          v-model="contact.motDePasse"
          :rules="rulesForms.passwordRules"
          :type="show1 ? 'text' : 'password'"
          required
          @keyup.enter="validate()"
          @click:append="show1 = !show1"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          label="Ville"
          placeholder="Ville"
          v-model="contact.ville"
          :rules="rulesForms.villeContactRules"
          required
          @keyup.enter="validate()"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          label="Confirmez votre mot de passe"
          placeholder="Confirmez votre mot de passe"
          v-model="motDePassConfirmation"
          :rules="rulesForms.confirmPassContactRules"
          :type="show1 ? 'text' : 'password'"
          required
          @keyup.enter="validate()"
          @click:append="show1 = !show1"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          label="CEDEX"
          placeholder="CEDEX"
          v-model="contact.cedex"
          required
          @keyup.enter="validate()"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { rulesForms } from "@/core/RulesForm";
import { Action } from "@/core/CommonDefinition";
import ContactEtablissement from "@/core/ContactEtablissement";

@Component
export default class Contact extends Vue {
  @Prop() contact!: ContactEtablissement;
  @Prop() action!: Action;
  Action: any = Action;
  rulesForms: any = rulesForms;
  motDePassConfirmation: string = "";
  emailConfirmation: string = "";
  show1: boolean = false;
  constructor() {
    super();
  }

  validate(): boolean {
    return (this.$refs.form as Vue & { validate: () => boolean }).validate();
  }

  clear(): void {
    (this.$refs.form as HTMLFormElement).reset();
  }
}
</script>
