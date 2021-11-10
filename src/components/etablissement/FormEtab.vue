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
                :rules="rulesForms.nomEtabRules"
                required
                @keyup.enter="validate()"
              ></v-text-field>
              <v-text-field
                outlined
                label="SIREN"
                placeholder="SIREN"
                v-model="sirenEtab"
                :rules="rulesForms.sirenEtabRules"
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
                :rules="rulesForms.typeEtabRules"
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
                :rules="rulesForms.nomContactRules"
                required
                @keyup.enter="validate()"
              ></v-text-field>
              <v-text-field
                outlined
                label="Prénom"
                placeholder="Prénom"
                v-model="prenomContact"
                :rules="rulesForms.prenomContactRules"
                required
                @keyup.enter="validate()"
              ></v-text-field>
              <v-text-field
                outlined
                label="Adresse postale"
                placeholder="Adresse postale"
                v-model="adresseContact"
                :rules="rulesForms.adresseContactRules"
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
                :rules="rulesForms.codePostalContactRules"
                required
                @keyup.enter="validate()"
              ></v-text-field>
              <v-text-field
                outlined
                label="Ville"
                placeholder="Ville"
                v-model="villeContact"
                :rules="rulesForms.villeContactRules"
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
                :rules="rulesForms.telContactRules"
                required
                @keyup.enter="validate()"
              ></v-text-field>
              <v-text-field
                outlined
                label="Adresse e-mail"
                placeholder="Adresse e-mail"
                v-model="emailContact"
                :rules="rulesForms.emailContactRules"
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
                :rules="rulesForms.passwordRules"
                type="password"
                required
                @keyup.enter="validate()"
              ></v-text-field>
              <v-text-field
                outlined
                label="Confirmez votre mot de passe"
                placeholder="Confirmez votre mot de passe"
                v-model="confirmPassContact"
                :rules="rulesForms.passwordObligatoryRules"
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
import { rulesForms } from "@/core/RulesForm";

@Component
export default class FormEtab extends Vue {
  rulesForms: any = rulesForms;
  nomEtab: string = "";
  sirenEtab: string = "";
  typesEtab: Array<string> = [];

  typeEtab: string = "";
  nomContact: string = "";
  prenomContact: string = "";
  adresseContact: string = "";
  boitePostaleContact: string = "";
  codePostalContact: string = "";
  villeContact: string = "";
  cedexContact: string = "";
  telContact: string = "";
  emailContact: string = "";
  confirmEmailContact: string = "";
  passContact: string = "";
  confirmPassContact: string = "";
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
