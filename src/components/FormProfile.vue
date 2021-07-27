<template>
  <div>
    <v-card width="100%" outlined>
      <v-form ref="form" lazy-validation>
        <v-card-title>Modifier mes informations</v-card-title>
        <v-card-text>
          <v-row>
            <v-col lg="6" md="12" xs="12">
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-text-field
                    outlined
                    label="Mail de contact"
                    placeholder="Mail de contact"
                    v-model="mail"
                    :rules="mailRules"
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
                    label="Nom"
                    placeholder="Nom"
                    v-model="nomContact"
                    :rules="nomRules"
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
                    :rules="nomRules"
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
                    label="Téléphone"
                    placeholder="Téléphone"
                    v-model="telephone"
                    :rules="telRules"
                    required
                    @keyup.enter="validate()"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col lg="6" md="12" xs="12">
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-text-field
                    outlined
                    label="Adresse"
                    placeholder="Adresse"
                    v-model="adresse"
                    :rules="adrRules"
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
                    label="Code Postal"
                    placeholder="Code Postal"
                    v-model="codePostal"
                    :rules="cpRules"
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
                    v-model="ville"
                    :rules="villeRules"
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
                    label="CEDEX"
                    placeholder="CEDEX"
                    v-model="cedex"
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
                    label="Boite Postal"
                    placeholder="Boite Postal"
                    v-model="bp"
                    required
                    @keyup.enter="validate()"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col cols="10"></v-col>
            <v-col>
              <v-btn
                color="success"
                :loading="buttonLoading"
                x-large
                @click="validate()"
                >Envoyer</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions></v-form
      >
    </v-card>
    <br />
    <v-alert dense outlined :value="alert" type="error">
      {{ error }}
    </v-alert>
  </div>
</template>

<script lang="ts">
import {serviceLn} from "../service/licencesnationales/LicencesNationalesApiService";
import {Logger} from "@/utils/Logger";
import {Component, Vue} from "vue-property-decorator";

@Component
export default class FormProfile extends Vue {
  adresse: string = "";
  codePostal: string = "";
  ville: string = "";
  bp: string = "";
  cedex: string = "";
  mail: string = "";
  nomContact: string = "";
  prenomContact: string = "";
  telephone: string = "";
  jsonResponse: any = {};
  alert: boolean = false;
  error: string = "";
  nomRules = [(v: string) => !!v || "Champ obligatoire"];
  adrRules = [
    (v: string) => !!v || "Champ obligatoire",
    (v: string) => (v && v.length >= 10) || "Adresse trop courte"
  ];
  villeRules = [
    (v: string) => !!v || "Champ obligatoire",
    (v: string) => (v && v.length >= 2) || "Ville trop courte"
  ];
  mailRules = [
    (v: string) => !!v || "Champ obligatoire",
    (v: string) => /.+@.+\..+/.test(v) || "Adresse mail non valide"
  ];
  cpRules = [
    (v: string) => !!v || "Champ obligatoire",
    (v: string) =>
      /[\d]{5}/.test(v) || "Le code postal doit être composé de 5 chiffres"
  ];
  telRules = [
    (v: string) => !!v || "Champ obligatoire",
    (v: string) =>
      /^[\d]*$/.test(v) ||
      "Le téléphone doit être composé de chiffres uniquement"
  ];
  buttonLoading: boolean = false;

  get userSiren(): string {
    return this.$store.getters.userSiren;
  }

  mounted() {
    this.fetchEtab();
  }

  validate(): void {
    this.error = "";
    this.alert = false;
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      this.buttonLoading = true;
      this.submitProfil();
    }
  }

  fetchEtab(): void {
    serviceLn
      .getInfosEtab(this.$store.state.user.token)
      .then(result => {
        this.mail = result.data.contact.mail;
        this.nomContact = result.data.contact.nom;
        this.prenomContact = result.data.contact.prenom;
        this.adresse = result.data.contact.adresse;
        this.bp = result.data.contact.boitePostal;
        this.codePostal = result.data.contact.codePostal;
        this.cedex = result.data.contact.cedex;
        this.ville = result.data.contact.ville;
        this.telephone = result.data.contact.telephone;
      })
      .catch(err => {
        this.alert = true;
        this.error = err;
      });
  }

  submitProfil(): void {
    this.updateJsonObject();
    Logger.debug(JSON.stringify(this.jsonResponse));
    serviceLn
      .updateProfile(this.$store.state.user.token, this.jsonResponse)
      .then(() => {
        this.buttonLoading = false;
        this.$router.push({ name: "Home" });
      })
      .catch(err => {
        this.buttonLoading = false;
        this.alert = true;
        this.error = err;
      });
  }

  updateJsonObject(): void {
    const json: any = {};
    json.adresseContact = this.adresse;
    json.boitePostaleContact = this.bp;
    json.cedexContact = this.cedex;
    json.codePostalContact = this.codePostal;
    json.mailContact = this.mail;
    json.nomContact = this.nomContact;
    json.prenomContact = this.prenomContact;
    json.siren = this.userSiren;
    json.telephoneContact = this.telephone;
    json.villeContact = this.ville;
    this.jsonResponse = json;
  }
}
</script>

<style scoped></style>
