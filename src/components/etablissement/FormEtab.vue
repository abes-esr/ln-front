<template>
  <div>
    <v-card>
      <v-form ref="form" lazy-validation>
        <v-card-title>Création d'un compte institutionnel</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
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
            </v-col>
            <v-col cols="6">
              <v-select
                outlined
                v-model="typeEtab"
                :items="typesEtab"
                label="Type de l'établissement"
                :rules="typeEtabRules"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-card-title>Informations contact</v-card-title>
          <v-row>
            <v-col cols="6">
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
            </v-col>
            <v-col cols="6">
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
                Votre mot de passe doit contenir au minimum 8 caractères dont
                une lettre majuscule, une lettre minuscule, un chiffre et un
                caractère spécial parmis @ $ ! % * ? &
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
              ></v-text-field> </v-col
          ></v-row>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Logger } from "@/utils/Logger";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";

@Component
export default class FormEtab extends Vue {
  nomEtab: string = "";
  nomEtabRules = [
    (v: string) => !!v || "Le nom de l'établissement est obligatoire",
    (v: string) =>
      /^([0-9A-Za-z'àâéèêôùûçÀÂÉÈÔÙÛÇ,\s-]{5,80})$/.test(v) ||
      "Le nom d'établissement fourni n'est pas valide"
  ];

  sirenEtab: string = "";
  sirenEtabRules = [
    (v: string) => !!v || "SIREN obligatoire",
    (v: string) => /^\d{9}$/.test(v) || "Le SIREN doit contenir 9 chiffres"
  ];

  typesEtab: Array<string> = [];

  typeEtab: string = "";
  typeEtabRules = [
    (v: string) => !!v || "Le type de l'établissement est obligatoire"
  ];

  nomContact: string = "";
  nomContactRules = [
    (v: string) => !!v || "Le nom du contact est obligatoire",
    (v: string) =>
      /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/.test(
        v
      ) || "Le nom fourni n'est pas valide"
  ];

  prenomContact: string = "";
  prenomContactRules = [
    (v: string) => !!v || "Le prénom du contact est obligatoire",
    (v: string) =>
      /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/.test(
        v
      ) || "Le prénom fourni n'est pas valide"
  ];

  adresseContact: string = "";
  adresseContactRules = [
    (v: string) =>
      !!v || "L'adresse postale de l'établissement est obligatoire",
    (v: string) =>
      /^([0-9A-Za-z'àâéèêôùûçÀÂÉÈÔÙÛÇ,\s-]{5,80})$/.test(v) ||
      "L'adresse postale fournie n'est pas valide"
  ];

  boitePostaleContact: string = "";
  codePostalContact: string = "";
  codePostalContactRules = [
    (v: string) => !!v || "Le code postal de l'établissement est obligatoire",
    (v: string) => /^\d{5}$/.test(v) || "Le code postal fourni n'est pas valide"
  ];

  villeContact: string = "";
  villeContactRules = [
    (v: string) => !!v || "La ville de l'établissement est obligatoire",
    (v: string) =>
      /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/.test(v) ||
      "La ville fournie n'est pas valide"
  ];

  cedexContact: string = "";
  telContact: string = "";
  telContactRules = [
    (v: string) => !!v || "Le téléphone du contact est obligatoire",
    (v: string) =>
      /^\d{10}$/.test(v) || "Veuillez entrer 10 chiffres sans espace"
  ];

  emailContact: string = "";
  emailContactRules = [
    (v: string) => !!v || "L'adresse mail du contact est obligatoire",
    (v: string) =>
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v) ||
      "L'adresse mail fournie n'est pas valide"
  ];
  confirmEmailContact: string = "";
  confirmEmailContactRules = [
    (v: string) => !!v || "Vous devez confirmer l'adresse mail du contact"
  ];

  passContact: string = "";
  passContactRules = [
    (v: string) => !!v || "Le mot de passe du contact est obligatoire",
    (v: string) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        v
      ) || "Le mot de passe fourni n'est pas valide"
  ];
  confirmPassContact: string = "";
  confirmPassContactRules = [
    (v: string) => !!v || "Vous devez confirmer le mot de passe du contact"
  ];
  @Prop() bus: any;

  validAndSend(): void {
    Logger.debug("Validation");
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      this.$emit("formEtab", {
        nom: this.nomEtab,
        siren: this.sirenEtab,
        typeEtablissement: this.typeEtab,
        contact: {
          nom: this.nomContact,
          prenom: this.prenomContact,
          adresse: this.adresseContact,
          boitePostale: this.boitePostaleContact,
          codePostal: this.codePostalContact,
          ville: this.villeContact,
          cedex: this.cedexContact,
          telephone: this.telContact,
          mail: this.emailContact,
          motDePasse: this.passContact
        }
      });
    }
  }

  clear(): void {
    (this.$refs.form as HTMLFormElement).reset();
  }

  fetchListeType(): void {
    etablissementService.listeType().then(result => {
      result.data.forEach(element => {
        this.typesEtab.push(element.libelle);
      });
    });
  }

  mounted() {
    this.fetchListeType();
    this.bus.$on("submit", this.validAndSend);
    this.bus.$on("clear", this.clear);
  }
}
</script>
