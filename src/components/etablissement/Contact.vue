<template>
  <v-form ref="form" lazy-validation :disabled="isDisableForm">
    <v-row>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          label="Nom"
          placeholder="Nom"
          v-model="contact.nom"
          :rules="rulesForms.nom"
          required
          @keyup.enter="validate()"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          label="Prénom"
          placeholder="Prénom"
          v-model="contact.prenom"
          :rules="rulesForms.prenom"
          required
          @keyup.enter="validate()"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          label="Adresse"
          placeholder="Adresse"
          maxlength="80"
          v-model="contact.adresse"
          :rules="rulesForms.adresse"
          required
          @keyup.enter="validate()"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          label="Boite Postale"
          placeholder="Boite Postale"
          v-model="contact.boitePostale"
          required
          @keyup.enter="validate()"
        ></v-text-field> </v-col
      ><v-col cols="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          label="Code Postal"
          placeholder="Code Postal"
          maxlength="5"
          v-model="contact.codePostal"
          :rules="rulesForms.codePostal"
          required
          @keyup.enter="validate()"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          label="Ville"
          placeholder="Ville"
          v-model="contact.ville"
          :rules="rulesForms.ville"
          required
          @keyup.enter="validate()"
        ></v-text-field>
      </v-col>
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
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          label="Téléphone"
          placeholder="Téléphone"
          maxlength="10"
          v-model="contact.telephone"
          :rules="rulesForms.tel"
          required
          @keyup.enter="validate()"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-form ref="mail" :disabled="isDisableForm">
          <v-text-field
            outlined
            label="Mail de contact"
            placeholder="Mail de contact"
            v-model="contact.mail"
            :rules="rulesForms.email.concat(rulesMailConfirmation)"
            required
            @keyup="checkConfirmationMail()"
            @keyup.enter="validate()"
            autocomplete="new-mail"
          ></v-text-field>
          <v-text-field
            outlined
            label="Confirmez votre adresse e-mail"
            placeholder="Confirmez votre adresse e-mail"
            v-model="emailConfirmation"
            :rules="rulesForms.email.concat(rulesMailConfirmation)"
            required
            @keyup="checkConfirmationMail()"
            @keyup.enter="validate()"
            autocomplete="new-mail"
          ></v-text-field>
        </v-form>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <MotDePasse
          ref="motdepasse"
          v-if="
            action === Action.CREATION ||
              action === Action.FUSION ||
              action === Action.SCISSION
          "
          :action="Action.CREATION"
          :linkIsExpired="false"
          :nouveau-mot-de-passe="contact.motDePasse"
          @update:nouveauMotDePasse="updateMotDePasse"
          :isDisableForm="isDisableForm"
        ></MotDePasse>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6"></v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <div v-if="action === Action.CREATION">
          <v-checkbox
            required
            :rules="rulesForms.checkboxRules"
            label="J'accepte les conditions générales liées à la politique de
                confidentialité*"
          ></v-checkbox>
          <div>
            Pour connaître et exercer vos droits relatifs à l'utilisation des
            données collectées par ce formulaire, veuillez consulter la page
            <a @click="gotoDonneesPersonnellesInNewPage()"
              >Données personnelles</a
            >
          </div>
          <br />
          <div>
            Ce formulaire est protégé par reCAPTCHA, la
            <a href="https://policies.google.com/privacy"
              >politique de confidentialité</a
            >
            ainsi que les
            <a href="https://policies.google.com/terms"
              >conditions d'utilisations</a
            >
            de Google s'appliquent.
          </div>
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { rulesForms } from "@/core/RulesForm";
import { Action } from "@/core/CommonDefinition";
import ContactEtablissement from "@/core/ContactEtablissement";
import MotDePasse from "@/components/authentification/MotDePasse.vue";

@Component({
  components: { MotDePasse }
})
export default class Contact extends Vue {
  @Prop() contact!: ContactEtablissement;
  @Prop() action!: Action;
  @Prop() isDisableForm!: boolean;
  Action: any = Action;
  rulesForms: any = rulesForms;
  emailConfirmation: string = "";
  ancienMail: string = "";

  constructor() {
    super();
    this.ancienMail = this.contact.mail;
  }

  get rulesMailConfirmation() {
    return () =>
      this.emailConfirmation === this.contact.mail ||
      this.emailConfirmation === "" ||
      "Le mail de confirmation n'est pas valide";
  }

  gotoDonneesPersonnellesInNewPage(): void {
    const route = this.$router.resolve({ path: "/donneespersonnelles" });
    window.open(route.href);
  }

  checkConfirmationMail(): void {
    if (this.emailConfirmation != "") {
      (this.$refs.mail as Vue & { validate: () => boolean }).validate();
    }
  }

  validate(): boolean {
    const isFormValide = (this.$refs.form as Vue & {
      validate: () => boolean;
    }).validate();

    let isMotDePasseValide = true;
    if (this.$refs.motdepasse) {
      isMotDePasseValide = (this.$refs.motdepasse as Vue & {
        validate: () => boolean;
      }).validate();
    }

    let isMailValide = true;
    if (
      this.action == Action.CREATION ||
      this.ancienMail != this.contact.mail
    ) {
      isMailValide = (this.$refs.mail as Vue & {
        validate: () => boolean;
      }).validate();
    }

    return isFormValide && isMotDePasseValide && isMailValide;
  }

  clear(): void {
    if (this.$refs.motdepasse) {
      (this.$refs.motdepasse as MotDePasse).clear();
    }
    (this.$refs.form as HTMLFormElement).resetValidation();
    (this.$refs.mail as HTMLFormElement).resetValidation();
    this.contact.reset();
  }

  updateMotDePasse(value: string) {
    this.contact.motDePasse = value;
  }
}
</script>
