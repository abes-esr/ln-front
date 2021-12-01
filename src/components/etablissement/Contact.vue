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
        <v-text-field
          outlined
          label="Prénom"
          placeholder="Prénom"
          v-model="contact.prenom"
          :rules="rulesForms.prenomContactRules"
          required
          @keyup.enter="validate()"
        ></v-text-field>
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
        <v-text-field
          outlined
          label="Boite Postal"
          placeholder="Boite Postal"
          v-model="contact.boitePostale"
          required
          @keyup.enter="validate()"
        ></v-text-field>
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
        <v-text-field
          outlined
          label="Ville"
          placeholder="Ville"
          v-model="contact.ville"
          :rules="rulesForms.villeContactRules"
          required
          @keyup.enter="validate()"
        ></v-text-field>
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
          :rules="rulesForms.telContactRules"
          required
          @keyup.enter="validate()"
        ></v-text-field>
        <v-form ref="mail" v-if="action === Action.CREATION">
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
        <MotDePasse
          ref="motdepasse"
          v-if="action === Action.CREATION"
          :action="Action.CREATION"
          :nouveau-mot-de-passe="contact.motDePasse"
        ></MotDePasse>
        <div v-if="action === Action.CREATION">
          <v-checkbox
            required
            :rules="rulesForms.checkboxRules"
            label="J'accepte les conditions générales liées à la politique de
                confidentialité*"
          ></v-checkbox>
          <div class="subtitle-2">
            Pour connaître et exercer vos droits relatifs à l'utilisation des
            données collectées par ce formulaire, veuillez consulter la page
            <a @click="$router.push({ path: '/donneespersonnelles' })"
              >Données personnelles</a
            >
          </div>
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import { rulesForms } from "@/core/RulesForm";
import { Action } from "@/core/CommonDefinition";
import ContactEtablissement from "@/core/ContactEtablissement";
import MotDePasse from "@/components/authentification/MotDePasse.vue";
import { Logger } from "@/utils/Logger";

@Component({
  components: { MotDePasse }
})
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

  get rulesMotDePasseConfirmation() {
    return () =>
      this.motDePassConfirmation === this.contact.motDePasse ||
      this.motDePassConfirmation === "" ||
      "Le mot de passe de confirmation n'est pas valide";
  }

  get rulesMailConfirmation() {
    return () =>
      this.emailConfirmation === this.contact.mail ||
      this.emailConfirmation === "" ||
      "Le mail de confirmation n'est pas valide";
  }

  @Watch("contact.mail")
  motDepasse(value: string): void {
    if (this.contact.mail != "") {
      (this.$refs.mail as Vue & { validate: () => boolean }).validate();
    }
  }

  checkConfirmationMotDePasse(): void {
    if (this.motDePassConfirmation != "") {
      (this.$refs.motdepasse as Vue & { validate: () => boolean }).validate();
    }
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
    const isMotDePasseValide = (this.$refs.motdepasse as Vue & {
      validate: () => boolean;
    }).validate();
    const isMailValide = (this.$refs.mail as Vue & {
      validate: () => boolean;
    }).validate();

    return isFormValide && isMotDePasseValide && isMailValide;
  }

  clear(): void {
    (this.$refs.motdepasse as MotDePasse).clear();
    (this.$refs.form as HTMLFormElement).resetValidation();
    (this.$refs.mail as HTMLFormElement).resetValidation();
    this.contact.reset();
  }
}
</script>
