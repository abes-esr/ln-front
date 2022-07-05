<template>
  <v-form ref="form" lazy-validation :disabled="isDisableForm">
    <v-row>
      <v-col cols="12" md="5" lg="5" xl="5" class="pa-1 pt-4">
        <v-row
          ><v-text-field
            outlined
            label="Nom"
            placeholder="Nom"
            v-model="contact.nom"
            :rules="rulesForms.nom"
            required
            @keyup.enter="validate()"
          ></v-text-field
        ></v-row>
        <v-row
          ><v-text-field
            outlined
            label="Prénom"
            placeholder="Prénom"
            v-model="contact.prenom"
            :rules="rulesForms.prenom"
            required
            @keyup.enter="validate()"
          ></v-text-field
        ></v-row>
        <v-row
          ><v-text-field
            outlined
            label="Adresse"
            placeholder="Adresse"
            maxlength="80"
            v-model="contact.adresse"
            :rules="rulesForms.adresse"
            required
            @keyup.enter="validate()"
          ></v-text-field
        ></v-row>
        <v-row
          ><v-text-field
            outlined
            label="Boîte postale"
            placeholder="Boîte postale"
            v-model="contact.boitePostale"
            required
            @keyup.enter="validate()"
          ></v-text-field
        ></v-row>
        <v-row
          ><v-text-field
            outlined
            label="Code Postal"
            placeholder="Code Postal"
            maxlength="5"
            v-model="contact.codePostal"
            :rules="rulesForms.codePostal"
            required
            @keyup.enter="validate()"
          ></v-text-field
        ></v-row>
        <v-row
          ><v-text-field
            outlined
            label="Ville"
            placeholder="Ville"
            v-model="contact.ville"
            :rules="rulesForms.ville"
            required
            @keyup.enter="validate()"
          ></v-text-field
        ></v-row>
        <v-row
          ><v-text-field
            outlined
            label="CEDEX"
            placeholder="CEDEX"
            v-model="contact.cedex"
            required
            @keyup.enter="validate()"
          ></v-text-field
        ></v-row>
      </v-col>
      <v-col cols="0" md="1" lg="1" xl="1" class="pa-0"></v-col>
      <v-col cols="12" md="5" lg="5" xl="5" class="pa-1 pt-4">
        <v-row>
          <v-text-field
            outlined
            label="Téléphone"
            placeholder="Téléphone"
            maxlength="10"
            v-model.trim="contact.telephone"
            :rules="rulesForms.tel"
            required
            @paste.prevent="pastePhone"
            @keyup.enter="validate()"
          ></v-text-field
        ></v-row>
        <v-row
          ><v-form ref="mail" :disabled="isDisableForm" style="width: 100%">
            <v-alert
              outlined
              class="pa-3 fondBlanc"
              v-if="action === Action.CREATION"
            >
              <font-awesome-icon
                :icon="['fas', 'info-circle']"
                class="fa-2x mr-5 mb-1 mt-2 icone-information"
              />
              Choisir de préférence un alias pérenne pour continuer de recevoir
              les différents messages informatifs sur la gestion du compte et
              des IP déclarées en cas de changement d’interlocuteur ou
              d’interlocutrice au sein de l’établissement
            </v-alert>
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
            ></v-text-field> </v-form
        ></v-row>
        <v-row>
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
        </v-row>
        <v-row
          ><div v-if="action === Action.CREATION">
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
              <a href="https://policies.google.com/privacy" target="_blank"
                >politique de confidentialité</a
              >
              ainsi que les
              <a href="https://policies.google.com/terms" target="_blank"
                >conditions d'utilisations</a
              >
              de Google s'appliquent.
            </div>
          </div></v-row
        >
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

  pastePhone(evt) {
    this.contact.telephone = evt.clipboardData
      .getData("text")
      .replaceAll(" ", "")
      .replaceAll(".", "");
  }
}
</script>

<style scoped>
.row {
  margin: 0 !important;
}
</style>
