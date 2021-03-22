<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col lg="5" md="8" xs="10">
        <div>
          <v-card witdh="100%">
            <v-form ref="formCreationCompte" lazy-validation>
              <v-card-title>Création d'un compte institutionnel</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-text-field
                      outlined
                      label="NOM DE L'ETABLISSEMENT"
                      placeholder="NOM DE L'ETABLISSEMENT"
                      v-model="nomEtab"
                      :rules="nomEtabRules"
                      required
                      @keyup.enter="validate()"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
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
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
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
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-text-field
                        outlined
                        label="Nom"
                        placeholder="Nom"
                        v-model="nomContact"
                        :rules="nomContactRules"
                        required
                        @keyup.enter="validate()"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-text-field
                        outlined
                        label="Prénom"
                        placeholder="Prénom"
                        v-model="prenomContact"
                        :rules="prenomContactRules"
                        required
                        @keyup.enter="validate()"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-text-field
                        outlined
                        label="Adresse postale"
                        placeholder="Adresse postale"
                        v-model="adresseContact"
                        :rules="adresseContactRules"
                        required
                        @keyup.enter="validate()"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-text-field
                        outlined
                        label="Boîte postale"
                        placeholder="Boîte postale"
                        v-model="boitePostaleContact"
                        @keyup.enter="validate()"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-text-field
                        outlined
                        label="Code postal"
                        placeholder="Code postal"
                        v-model="codePostalContact"
                        :rules="codePostalContactRules"
                        required
                        @keyup.enter="validate()"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-text-field
                        outlined
                        label="Ville"
                        placeholder="Ville"
                        v-model="villeContact"
                        :rules="villeContactRules"
                        required
                        @keyup.enter="validate()"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-text-field
                        outlined
                        label="Cedex"
                        placeholder="Cedex"
                        v-model="cedexContact"
                        @keyup.enter="validate()"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-text-field
                        outlined
                        label="Téléphone"
                        placeholder="Téléphone"
                        v-model="telContact"
                        :rules="telContactRules"
                        required
                        @keyup.enter="validate()"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-text-field
                        outlined
                        label="Adresse e-mail"
                        placeholder="Adresse e-mail"
                        v-model="emailContact"
                        :rules="emailContactRules"
                        required
                        @keyup.enter="validate()"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-text-field
                        outlined
                        label="Confirmez votre adresse e-mail"
                        placeholder="Confirmez votre adresse e-mail"
                        v-model="confirmEmailContact"
                        :rules="confirmEmailContactRules.concat(confirmEmailContactRule)"
                        required
                        @keyup.enter="validate()"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-alert
                        border="left"
                        color="grey"
                        dark
                    >
                      Votre mot de passe doit contenir au minimum 8 caractères dont une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial parmis @ $ ! % * ? &
                    </v-alert>
                    <v-text-field
                        outlined
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        label="Mot de passe"
                        placeholder="Mot de passe"
                        v-model="passContact"
                        :rules="passContactRules"
                        :type="show1 ? 'text' : 'password'"
                        required
                        @keyup.enter="validate()"
                        @click:append="show1 = !show1"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-text-field
                        outlined
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        label="Confirmez votre mot de passe"
                        placeholder="Confirmez votre mot de passe"
                        v-model="confirmPassContact"
                        :rules="confirmPassContactRules.concat(confirmPassContactRule)"
                        :type="show1 ? 'text' : 'password'"
                        required
                        @keyup.enter="validate()"
                        @click:append="show1 = !show1"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">

                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-row>
                  <v-col cols="9"></v-col>
                  <v-col cols="2">
                    <v-btn
                      color="success"
                      :loading="buttonLoading"
                      x-large
                      @click="recaptcha()"
                      >Envoyer</v-btn
                    >
                    <v-btn @click="clear">
                      Effacer
                    </v-btn>

                  </v-col>
                </v-row>
              </v-card-actions>
            </v-form>
          </v-card>
          <br />
          <v-alert dense outlined :value="alert" type="error">
            {{ error }}
          </v-alert>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts">

import Vue from "vue";
import { mapActions } from "vuex";
import axios from "axios";



export default Vue.extend({
  name: "FormCreationCompte",
  data() {
    return {
      show1: false,
      token:  this.$recaptchaLoaded() as any,
      nomEtab: "" as string,
      nomEtabRules: [
        (v: any) => !!v || "Le nom de l'établissement est obligatoire",
        (v: any) => /^([0-9A-Za-z'àâéèêôùûçÀÂÉÈÔÙÛÇ,\s-]{5,80})$/.test(v) || "Le nom d'établissement fourni n'est pas valide"

      ],
      sirenEtab: "" as string,
      sirenEtabRules: [
        (v: any) => !!v || "SIREN obligatoire",
        (v: any) => /^\d{9}$/.test(v) || "Le SIREN doit contenir 9 chiffres"
      ],

      typesEtab: ["EPIC/EPST",
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
        "Autre"],
      typeEtab: "" as string,
      typeEtabRules: [
        (v: any) => !!v || "Le type de l'établissement est obligatoire",
      ],

      nomContact: "" as string,
      nomContactRules: [
        (v: any) => !!v || "Le nom du contact est obligatoire",
        (v: any) => /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/.test(v) || "Le nom fourni n'est pas valide"
      ],
      prenomContact: "" as string,
      prenomContactRules: [
        (v: any) => !!v || "Le prénom du contact est obligatoire",
        (v: any) => /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/.test(v) || "Le prénom fourni n'est pas valide"
      ],
      adresseContact: "" as string,
      adresseContactRules: [
        (v: any) => !!v || "L'adresse postale de l'établissement est obligatoire",
        (v: any) => /^([0-9A-Za-z'àâéèêôùûçÀÂÉÈÔÙÛÇ,\s-]{5,80})$/.test(v) || "L'adresse postale fournie n'est pas valide"
      ],
      boitePostaleContact: "" as string,
      codePostalContact: "" as string,
      codePostalContactRules: [
        (v: any) => !!v || "Le code postal de l'établissement est obligatoire",
        (v: any) => /^\d{5}$/.test(v) || "Le code postal fourni n'est pas valide"
      ],
      villeContact: "" as string,
      villeContactRules: [
        (v: any) => !!v || "La ville de l'établissement est obligatoire",
        (v: any) => /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/.test(v) || "La ville fournie n'est pas valide"
      ],
      cedexContact: "" as string,
      telContact: "" as string,
      telContactRules: [
        (v: any) => !!v || "Le téléphone du contact est obligatoire",
        (v: any) => /^\d{10}$/.test(v) || "Veuillez entrer 10 chiffres sans espace"
      ],
      emailContact: "" as string,
      emailContactRules: [
        (v: any) => !!v || "L'adresse mail du contact est obligatoire",
        (v: any) => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v) || "L'adresse mail fournie n'est pas valide"
      ],
      confirmEmailContact: "" as string,
      confirmEmailContactRules: [
        (v: any) => !!v || "Vous devez confirmer l'adresse mail du contact",
      ],
      passContact: "" as string,
      passContactRules: [
        (v: any) => !!v || "Le mot de passe du contact est obligatoire",
        (v: any) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v) || "Le mot de passe fourni n'est pas valide"
      ],
      confirmPassContact: "" as string,
      confirmPassContactRules: [
        (v: any) => !!v || "Vous devez confirmer le mot de passe du contact"
      ],
      idAbes: "" as string,
      roleContact:"" as string,
      buttonLoading: false,
      alert: false,
      error: ""

    };
  },
  computed: {
    confirmEmailContactRule() {
      return (v: any) => (this.confirmEmailContact === this.emailContact) || 'L\'adresse mail de confirmation n\'est pas valide'
    },
    confirmPassContactRule() {
      return (v: any) => (this.confirmPassContact === this.passContact) || 'Le mot de passe de confirmation n\'est pas valide'
    },

    loggedIn() {
      return this.$store.state.user.isLoggedIn;
    }
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push('/profile');
    }
  },

  methods: {

    async recaptcha() {
      // (optional) Wait until recaptcha has been loaded.
      await this.$recaptchaLoaded()

      // Execute reCAPTCHA with action "creationCompte".
      this.token = await this.$recaptcha('creationCompte');
      console.log("token dans recaptcha() " + this.token);
      // Do stuff with the received token.
      this.validate();
    },
    /* si on veut faire la verif du score sur le front et pas le back on peut faire comme ceci :
    isHuman(token: any) {
      const endpoint = `${process.env.VUE_APP_RECAPTCHA_VERIFY_URL}?response=${token}&secret=${process.env.VUE_APP_RECAPTCHA_KEY_SITE}`;
      console.log("requete axios = " + axios.post(endpoint)
          .then(({data}) => data.score > process.env.VUE_APP_RECAPTCHA_SCORE_THRESHOLD));
      return axios.post(endpoint)
          .then(({data}) => data.score > process.env.VUE_APP_RECAPTCHA_SCORE_THRESHOLD);

    },*/
    validate(): void {
      this.alert = false;
      this.error = "";
      //this.recaptcha();
      //if (this.isHuman(this.recaptcha()) {
      if (this.token != null) {
        if ((this.$refs.formCreationCompte as Vue & { validate: () => boolean }).validate()) {
          this.creationCompte();
        }
      }
    },
    creationCompte(): void {
      this.buttonLoading = true;
      axios
        .post(process.env.VUE_APP_ROOT_API + "creationCompte", {
          nom: this.nomEtab,
          siren:this.sirenEtab,
          typeEtablissement:this.typeEtab,
          idAbes:this.idAbes,
          nomContact:this.nomContact,
          prenomContact:this.prenomContact,
          adresseContact:this.adresseContact,
          boitePostaleContact:this.boitePostaleContact,
          codePostalContact:this.codePostalContact,
          villeContact:this.villeContact,
          cedexContact:this.cedexContact,
          telephoneContact:this.telContact,
          mailContact:this.emailContact,
          motDePasse:this.passContact,
          roleContact:this.roleContact,
          recaptcha:this.token
        })
        .then(() => {
          this.$router.push({name: "home"});
        })
        .catch(err => {
          this.buttonLoading = false;
          this.error = err;
          this.alert = true;
        });
    },

    clear() {
      //this.$refs.formCreationCompte.reset();
    }
  }
});

</script>

<style scoped></style>
