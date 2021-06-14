<template>
  <div>
    <v-card>
      <v-form ref="form" lazy-validation>
        <v-card-title>Création d'un compte institutionnel</v-card-title>
        <v-card-text>
          <v-text-field
            outlined
            label="NOM DE L'ETABLISSEMENT"
            placeholder="NOM DE L'ETABLISSEMENT"
            v-model="nomEtab"
            :rules="nomEtabRules"
            required
            @keyup.enter="validate()"
          ></v-text-field>
          <v-text-field
            outlined
            label="SIREN"
            placeholder="SIREN"
            v-model="sirenEtab"
            :rules="sirenEtabRules"
            required
            @keyup.enter="validate()"
          ></v-text-field>
          <v-select
            outlined
            v-model="typeEtab"
            :items="typesEtab"
            label="Type de l'établissement"
            :rules="typeEtabRules"
            required
          ></v-select>
          <v-card-title>Informations contact</v-card-title>
          <v-text-field
            outlined
            label="Nom"
            placeholder="Nom"
            v-model="nomContact"
            :rules="nomContactRules"
            required
            @keyup.enter="validate()"
          ></v-text-field>
          <v-text-field
            outlined
            label="Prénom"
            placeholder="Prénom"
            v-model="prenomContact"
            :rules="prenomContactRules"
            required
            @keyup.enter="validate()"
          ></v-text-field>
          <v-text-field
            outlined
            label="Adresse postale"
            placeholder="Adresse postale"
            v-model="adresseContact"
            :rules="adresseContactRules"
            required
            @keyup.enter="validate()"
          ></v-text-field>
          <v-text-field
            outlined
            label="Boîte postale"
            placeholder="Boîte postale"
            v-model="boitePostaleContact"
            @keyup.enter="validate()"
          ></v-text-field>
          <v-text-field
            outlined
            label="Code postal"
            placeholder="Code postal"
            v-model="codePostalContact"
            :rules="codePostalContactRules"
            required
            @keyup.enter="validate()"
          ></v-text-field>
          <v-text-field
            outlined
            label="Ville"
            placeholder="Ville"
            v-model="villeContact"
            :rules="villeContactRules"
            required
            @keyup.enter="validate()"
          ></v-text-field>
          <v-text-field
            outlined
            label="Cedex"
            placeholder="Cedex"
            v-model="cedexContact"
            @keyup.enter="validate()"
          ></v-text-field>
          <v-text-field
            outlined
            label="Téléphone"
            placeholder="Téléphone"
            v-model="telContact"
            :rules="telContactRules"
            required
            @keyup.enter="validate()"
          ></v-text-field>
          <v-text-field
            outlined
            label="Adresse e-mail"
            placeholder="Adresse e-mail"
            v-model="emailContact"
            :rules="emailContactRules"
            required
            @keyup.enter="validate()"
          ></v-text-field>
          <v-text-field
            outlined
            label="Confirmez votre adresse e-mail"
            placeholder="Confirmez votre adresse e-mail"
            v-model="confirmEmailContact"
            required
            @keyup.enter="validate()"
          ></v-text-field>
          <v-alert border="left" color="grey" dark>
            Votre mot de passe doit contenir au minimum 8 caractères dont une
            lettre majuscule, une lettre minuscule, un chiffre et un caractère
            spécial parmis @ $ ! % * ? &
          </v-alert>
          <v-text-field
            outlined
            label="Mot de passe"
            placeholder="Mot de passe"
            v-model="passContact"
            :rules="passContactRules"
            type="password"
            required
            @keyup.enter="validate()"
          ></v-text-field>
          <v-text-field
            outlined
            label="Confirmez votre mot de passe"
            placeholder="Confirmez votre mot de passe"
            v-model="confirmPassContact"
            type="password"
            required
            @keyup.enter="validate()"
          ></v-text-field>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";

export default Vue.extend({
  name: "FormEtab",
  data() {
    return {
      nomEtab: "" as string,
      nomEtabRules: [
        (v: any) => !!v || "Le nom de l'établissement est obligatoire",
        (v: any) =>
          /^([0-9A-Za-z'àâéèêôùûçÀÂÉÈÔÙÛÇ,\s-]{5,80})$/.test(v) ||
          "Le nom d'établissement fourni n'est pas valide"
      ],

      sirenEtab: "" as string,
      sirenEtabRules: [
        (v: any) => !!v || "SIREN obligatoire",
        (v: any) => /^\d{9}$/.test(v) || "Le SIREN doit contenir 9 chiffres"
      ],

      typesEtab: [
        "EPIC/EPST",
        "Ecoles d'ingénieurs",
        "Ecoles de formation spécialisée",
        "Ecoles de Management",
        "Enseignement Supérieur et Recherche",
        "Fondations",
        "GIP",
        "Grands etablissements publics",
        "Hôpitaux universitaires",
        "Lecture publique",
        "Universités",
        "Etablissement membre du réseau Latitude France",
        "Autre"
      ],
      typeEtab: "" as string,
      typeEtabRules: [
        (v: any) => !!v || "Le type de l'établissement est obligatoire"
      ],

      nomContact: "" as string,
      nomContactRules: [
        (v: any) => !!v || "Le nom du contact est obligatoire",
        (v: any) =>
          /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/.test(
            v
          ) || "Le nom fourni n'est pas valide"
      ],
      prenomContact: "" as string,
      prenomContactRules: [
        (v: any) => !!v || "Le prénom du contact est obligatoire",
        (v: any) =>
          /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/.test(
            v
          ) || "Le prénom fourni n'est pas valide"
      ],
      adresseContact: "" as string,
      adresseContactRules: [
        (v: any) =>
          !!v || "L'adresse postale de l'établissement est obligatoire",
        (v: any) =>
          /^([0-9A-Za-z'àâéèêôùûçÀÂÉÈÔÙÛÇ,\s-]{5,80})$/.test(v) ||
          "L'adresse postale fournie n'est pas valide"
      ],
      boitePostaleContact: "" as string,
      codePostalContact: "" as string,
      codePostalContactRules: [
        (v: any) => !!v || "Le code postal de l'établissement est obligatoire",
        (v: any) =>
          /^\d{5}$/.test(v) || "Le code postal fourni n'est pas valide"
      ],
      villeContact: "" as string,
      villeContactRules: [
        (v: any) => !!v || "La ville de l'établissement est obligatoire",
        (v: any) =>
          /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/.test(
            v
          ) || "La ville fournie n'est pas valide"
      ],
      cedexContact: "" as string,
      telContact: "" as string,
      telContactRules: [
        (v: any) => !!v || "Le téléphone du contact est obligatoire",
        (v: any) =>
          /^\d{10}$/.test(v) || "Veuillez entrer 10 chiffres sans espace"
      ],
      emailContact: "" as string,
      emailContactRules: [
        (v: any) => !!v || "L'adresse mail du contact est obligatoire",
        (v: any) =>
          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v) ||
          "L'adresse mail fournie n'est pas valide"
      ],
      confirmEmailContact: "" as string,
      confirmEmailContactRules: [
        (v: any) => !!v || "Vous devez confirmer l'adresse mail du contact"
      ],
      passContact: "" as string,
      passContactRules: [
        (v: any) => !!v || "Le mot de passe du contact est obligatoire",
        (v: any) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            v
          ) || "Le mot de passe fourni n'est pas valide"
      ],
      confirmPassContact: "" as string,
      confirmPassContactRules: [
        (v: any) => !!v || "Vous devez confirmer le mot de passe du contact"
      ],
      idAbes: "" as string
    };
  },
  props: ["bus"],
  methods: {
    validAndSend(): void {
      console.log("Validation");
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        this.$emit("formEtab", {
          adresseContact: this.adresseContact,
          boitePostaleContact: this.boitePostaleContact,
          cedexContact: this.cedexContact,
          codePostalContact: this.codePostalContact,
          idAbes: this.idAbes,
          mailContact: this.emailContact,
          motDePasse: this.passContact,
          nom: this.nomEtab,
          nomContact: this.nomContact,
          prenomContact: this.prenomContact,
          siren: this.sirenEtab,
          telephoneContact: this.telContact,
          typeEtablissement: this.typeEtab,
          villeContact: this.villeContact
        });
      }
    },
    clear(): void {
      (this.$refs.form as HTMLFormElement).reset();
    }
  },
  mounted() {
    this.bus.$on("submit", this.validAndSend);
    this.bus.$on("clear", this.clear);
  }
});
</script>

<style scoped></style>
