<template>
  <div>
    <v-card width="100%" outlined>
      <v-form ref="form" lazy-validation>
        <!-- Bloc Spécifique aux Admin -->
        <div v-if="isAdmin">
          <v-card-title>Modifier l'établissement</v-card-title>
          <v-card-text>
            <v-row>
              <v-col lg="6" md="12" xs="12">
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-text-field
                      outlined
                      label="Nom de l'établissement"
                      placeholder="Nom de l'établissement"
                      v-model="nomEtab"
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
                      label="SIREN"
                      placeholder="SIREN"
                      v-model="siren"
                      disabled
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col lg="6" md="12" xs="12">
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-select
                      outlined
                      v-model="typeEtab"
                      :items="listeType"
                      label="Type de l'établissement"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <!-- FIN Bloc Spécifique aux Admin -->
        <v-card-title v-if="isAdmin">Modifier le contact</v-card-title>
        <v-card-title v-else>Modifier mes informations</v-card-title>
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
import { serviceLn } from "../service/licencesnationales/LicencesNationalesApiService";
import { Logger } from "@/utils/Logger";
import { Component, Vue } from "vue-property-decorator";

//Si la modification est effectuée par un admin
//On passe le SIREN du compte à modifier en Prop
//Si on ne passe rien, la prop reste vide, on peut utiliser le composant pour modifier uniquement en mode utilisateur
const FormProfileProps = Vue.extend({
  props: {
    sirenParam: {
      type: String,
      default: ""
    }
  }
});

@Component
export default class FormProfile extends FormProfileProps {
  siren: string = "";
  nomEtab: string = "";
  typeEtab: string = "";
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
  listeType: Array<string> = [];
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
  sirenEtabRules = [
    (v: string) => !!v || "SIREN obligatoire",
    (v: string) => /^\d{9}$/.test(v) || "Le SIREN doit contenir 9 chiffres"
  ];
  buttonLoading: boolean = false;

  get userSiren(): string {
    return this.$store.getters.userSiren;
  }

  get isAdmin(): boolean {
    return this.$store.getters.isAdmin;
  }

  mounted() {
    this.fetchEtab();
    if (this.isAdmin) {
      this.fetchListeType();
    }
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
    //Le param "sirenParam" est optionel, utilisé dans le cas Admin
    serviceLn
      .getInfosEtab(this.$store.state.user.token, this.sirenParam)
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
        if (this.isAdmin) {
          this.siren = result.data.siren;
          this.nomEtab = result.data.nom;
          this.typeEtab = result.data.typeEtablissement;
        }
      })
      .catch(err => {
        this.alert = true;
        this.error = err;
      });
  }

  fetchListeType(): void {
    serviceLn
      .listeType()
      .then(result => {
        result.data.forEach(element => {
          this.listeType.push(element.libelle);
        });
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
    const contact: any = {};
    contact.adresse = this.adresse;
    contact.boitePostale = this.bp;
    contact.cedex = this.cedex;
    contact.codePostal = this.codePostal;
    contact.mail = this.mail;
    contact.nom = this.nomContact;
    contact.prenom = this.prenomContact;
    contact.telephone = this.telephone;
    contact.ville = this.ville;
    json.siren = this.userSiren;
    json.contact = contact;
    json.role = this.isAdmin ? "admin" : "etab";
    if (this.isAdmin) {
      json.siren = this.siren;
      json.typeEtablissement = this.typeEtab;
      json.nom = this.nomEtab;
    }
    this.jsonResponse = json;
  }
}
</script>
