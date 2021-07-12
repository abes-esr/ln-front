<template>
  <div>
    <v-card witdh="100%" outlined>
      <v-form ref="formModifierEditeur" lazy-validation>
        <v-card-title>Modification de l'éditeur</v-card-title>
        <v-card-text>
          <v-row>
            <v-col lg="6" md="12" xs="12">
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-text-field
                    outlined
                    label="NOM DE L'EDITEUR"
                    placeholder="NOM DE L'EDITEUR"
                    v-model="nomEditeur"
                    :rules="nomEditeurRules"
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
                    v-model="adresseEditeur"
                    :rules="adresseEditeurRules"
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
                    v-model="boitePostaleEditeur"
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
                    v-model="codePostalEditeur"
                    :rules="codePostalEditeurRules"
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
                    v-model="villeEditeur"
                    :rules="villeEditeurRules"
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
                    v-model="cedexEditeur"
                    @keyup.enter="validate()"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
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
            <v-card-title>Informations contact(s)</v-card-title>
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

            <v-col lg="6" md="12" xs="12">
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
                <v-col cols="10"> </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-col cols="5"></v-col>
          <v-col cols="5">
            <v-row justify="space-between">
              <v-col>
                <v-btn x-large color="grey" @click="clear"> Effacer</v-btn>
              </v-col>
              <v-col cols="1"></v-col>
              <v-col cols="4">
                <v-btn color="success" :loading="buttonLoading" x-large
                  >Envoyer</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
        </v-card-actions>
      </v-form>
    </v-card>
    <br />
    <v-alert dense outlined :value="alert" type="error">
      {{ error }}
    </v-alert>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import { HTTP } from "../utils/http-commons";

export default Vue.extend({
  name: "ModifierEditeur",
  data() {
    return {
      id: "" as string,
      show1: false,
      jsonResponse: {},
      nomEditeur: "" as string,
      nomEditeurRules: [
        (v: never) => !!v || "Le nom de l'éditeur est obligatoire",
        (v: never) =>
          /^([0-9A-Za-z'àâéèêôùûçÀÂÉÈÔÙÛÇ,\s-]{5,80})$/.test(v) ||
          "Le nom de l'éditeur fourni n'est pas valide"
      ],
      adresseEditeur: "" as string,
      adresseEditeurRules: [
        (v: never) =>
          !!v || "L'adresse postale de l'établissement est obligatoire",
        (v: never) =>
          /^([0-9A-Za-z'àâéèêôùûçÀÂÉÈÔÙÛÇ,\s-]{5,80})$/.test(v) ||
          "L'adresse postale fournie n'est pas valide"
      ],
      boitePostaleEditeur: "" as string,
      codePostalEditeur: "" as string,
      codePostalEditeurRules: [
        (v: never) => !!v || "Le code postal de l'éditeur est obligatoire",
        (v: never) =>
          /^\d{5}$/.test(v) || "Le code postal fourni n'est pas valide"
      ],
      villeEditeur: "" as string,
      villeEditeurRules: [
        (v: never) => !!v || "La ville de l'éditeur est obligatoire",
        (v: never) =>
          /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/.test(
            v
          ) || "La ville fournie n'est pas valide"
      ],
      cedexEditeur: "" as string,

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
      emailBatch: "" as string,
      emailBatchRules: [
        (v: never) => !!v || "L'adresse mail d'envoi des accès est obligatoire",
        (v: never) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "L'adresse mail d'envoi des accès fournie n'est pas valide"
      ],
      typeEtab: "" as string,
      typeEtabRules: [
        (v: never) => !!v || "Le type de l'établissement est obligatoire"
      ],

      nomContact: "" as string,
      nomContactRules: [
        (v: never) => !!v || "Le nom du contact est obligatoire",
        (v: never) =>
          /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/.test(
            v
          ) || "Le nom fourni n'est pas valide"
      ],
      prenomContact: "" as string,
      prenomContactRules: [
        (v: never) => !!v || "Le prénom du contact est obligatoire",
        (v: never) =>
          /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/.test(
            v
          ) || "Le prénom fourni n'est pas valide"
      ],

      telContact: "" as string,
      telContactRules: [
        (v: never) => !!v || "Le téléphone du contact est obligatoire",
        (v: never) =>
          /^\d{10}$/.test(v) || "Veuillez entrer 10 chiffres sans espace"
      ],
      emailContact: "" as string,
      emailContactRules: [
        (v: never) => !!v || "L'adresse mail du contact est obligatoire",
        (v: never) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "L'adresse mail fournie n'est pas valide"
      ],
      typeContact: "" as string,
      buttonLoading: false,
      alert: false,
      error: ""
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.user.isLoggedIn;
    }
  },
  mounted() {
    this.id = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1,
      window.location.href.lastIndexOf("&")
    );
    console.log("this.id = " + this.id);
    this.fetchEditeur();
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },

  methods: {
    ...mapActions({
      setNotification: "setNotification"
    }),

    fetchEditeur(): void {
      console.log("id = " + this.id);
      //console.log("siren = " + this.getUserSiren);
      HTTP.post("/ln/ip/getEditeurEntity", {
        id: this.id,
        siren: this.$store.state.user.siren
      })
        .then(result => {
          this.id = result.data.id;
          (this.nomEditeur = result.data.nomEditeur),
            (this.adresseEditeur = result.data.adresseEditeur),
            (this.boitePostaleEditeur = result.data.boitePostaleEditeur),
            (this.codePostalEditeur = result.data.codePostalEditeur),
            (this.villeEditeur = result.data.villeEditeur),
            (this.cedexEditeur = result.data.cedexEditeur),
            (this.emailBatch = result.data.emailBatch),
            (this.typeEtab = result.data.typeEtab),
            (this.nomContact = result.data.nomContact),
            (this.prenomContact = result.data.prenomContact),
            (this.typeContact = result.data.typeContact),
            (this.telContact = result.data.telContact),
            (this.emailContact = result.data.emailContact);
        })
        .catch(err => {
          this.alert = true;
          this.error = err;
        });
    },

    validate(): void {
      this.error = "";
      this.alert = false;
      if (
        (this.$refs.formModifierEditeur as Vue & {
          validate: () => boolean;
        }).validate()
      ) {
        this.buttonLoading = true;
        this.submitEditeur();
      }
    },
    submitEditeur(): void {
      this.updateJsonObject();
      console.log(this.jsonResponse);
      HTTP.post("/ln/editeur/modificationEditeur", this.jsonResponse)
        .then(response => {
          this.buttonLoading = false;
          console.log("notification = " + response.data);
          this.setNotification(response.data);
          console.log("notification = " + this.$store.state.notification);
          this.$router.push({ path: "/listeEditeurs" });
        })
        .catch(err => {
          this.buttonLoading = false;
          this.error = err.response.data;
          this.alert = true;
        });
    },

    updateJsonObject(): void {
      const json: any = {};
      json.id = this.id;
      (json.nomEditeur = this.nomEditeur),
        (json.adresseEditeur = this.adresseEditeur),
        (json.boitePostaleEditeur = this.boitePostaleEditeur),
        (json.codePostalEditeur = this.codePostalEditeur),
        (json.villeEditeur = this.villeEditeur),
        (json.cedexEditeur = this.cedexEditeur),
        (json.emailBatch = this.emailBatch),
        (json.typeEtab = this.typeEtab),
        (json.nomContact = this.nomContact),
        (json.prenomContact = this.prenomContact),
        (json.typeContact = this.typeContact),
        (json.telContact = this.telContact),
        (json.emailContact = this.emailContact),
        (this.jsonResponse = json);
    },
    clear() {
      (this.$refs.formModifierEditeur as HTMLFormElement).reset();
    }
  }
});
</script>

<style scoped></style>
