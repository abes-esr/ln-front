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
import { Component, Vue } from "vue-property-decorator";
import { serviceLn } from "../../service/licencesnationales/LicencesNationalesApiService";
import { Logger } from "@/utils/Logger";

@Component
export default class ModifierEditeur extends Vue {
  id: string = "";
  show1: boolean = false;
  jsonResponse = {};
  nomEditeur: string = "";
  nomEditeurRules = [
    (v: string) => !!v || "Le nom de l'éditeur est obligatoire",
    (v: string) =>
      /^([0-9A-Za-z'àâéèêôùûçÀÂÉÈÔÙÛÇ,\s-]{5,80})$/.test(v) ||
      "Le nom de l'éditeur fourni n'est pas valide"
  ];

  adresseEditeur: string = "";
  adresseEditeurRules = [
    (v: string) =>
      !!v || "L'adresse postale de l'établissement est obligatoire",
    (v: string) =>
      /^([0-9A-Za-z'àâéèêôùûçÀÂÉÈÔÙÛÇ,\s-]{5,80})$/.test(v) ||
      "L'adresse postale fournie n'est pas valide"
  ];

  boitePostaleEditeur: string = "";
  codePostalEditeur: string = "";
  codePostalEditeurRules = [
    (v: string) => !!v || "Le code postal de l'éditeur est obligatoire",
    (v: string) => /^\d{5}$/.test(v) || "Le code postal fourni n'est pas valide"
  ];
  villeEditeur: string = "";
  villeEditeurRules = [
    (v: string) => !!v || "La ville de l'éditeur est obligatoire",
    (v: string) =>
      /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/.test(v) ||
      "La ville fournie n'est pas valide"
  ];
  cedexEditeur: string = "";

  typesEtab: Array<string> = [
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
  ];

  emailBatch: string = "";
  emailBatchRules = [
    (v: string) => !!v || "L'adresse mail d'envoi des accès est obligatoire",
    (v: string) =>
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        v
      ) || "L'adresse mail d'envoi des accès fournie n'est pas valide"
  ];

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
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        v
      ) || "L'adresse mail fournie n'est pas valide"
  ];

  typeContact: string = "";
  buttonLoading: boolean = false;
  alert: boolean = false;
  error: string = "";

  get loggedIn() {
    return this.$store.state.user.isLoggedIn;
  }

  mounted() {
    this.id = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1,
      window.location.href.lastIndexOf("&")
    );
    Logger.debug("this.id = " + this.id);
    this.fetchEditeur();
  }

  fetchEditeur(): void {
    console.log("id = " + this.id);
    serviceLn
      .fetchEditeur(this.$store.state.user.token, {
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
  }

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
  }

  submitEditeur(): void {
    this.updateJsonObject();
    Logger.debug(JSON.stringify(this.jsonResponse));
    serviceLn
      .updateEditeur(this.$store.state.user.token, this.jsonResponse)
      .then(response => {
        this.buttonLoading = false;
        Logger.debug("notification = " + response.data);
        this.$store.dispatch("setNotification", response.data).catch(err => {
          Logger.error(err);
        });
        Logger.debug("notification = " + this.$store.state.notification);
        this.$router.push({ path: "/listeEditeurs" });
      })
      .catch(err => {
        this.buttonLoading = false;
        this.error = err.response.data;
        this.alert = true;
      });
  }

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
  }

  clear() {
    (this.$refs.formModifierEditeur as HTMLFormElement).reset();
  }
}
</script>
