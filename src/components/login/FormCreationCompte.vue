<template>
  <div>
    <v-card witdh="100%" outlined>
      <v-form ref="formCreationCompte" lazy-validation>
        <v-card-title>Création d'un compte institutionnel</v-card-title>
        <v-card-text>
          <v-row>
            <v-col lg="6" md="12" xs="12">
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
                <v-col cols="8">
                  <v-text-field
                    outlined
                    label="SIREN"
                    placeholder="SIREN"
                    v-model="sirenEtab"
                    :rules="sirenEtabRules"
                    required
                    @input="checkSiren()"
                    @keyup.enter="validate()"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <!-- POPUP CONFIRMATION SIREN -->
                  <v-dialog v-model="dialog" persistent max-width="450">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        :disabled="!dialogAvailable"
                        rounded
                        outlined
                        v-bind="attrs"
                        v-on="on"
                        color="primary"
                        >Valider</v-btn
                      >
                    </template>
                    <v-card>
                      <v-card-title class="headline">
                        Votre SIREN est-il correct ?
                      </v-card-title>
                      <v-card-text
                        >Le SIREN renseigné correspond à l'établissement suivant
                        : <b>{{ checkSirenAPI }}</b></v-card-text
                      >
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="green darken-1"
                          text
                          @click="dialog = false"
                        >
                          Non
                        </v-btn>
                        <v-btn
                          color="green darken-1"
                          text
                          @click="dialog = false"
                        >
                          Oui
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <!-- FIN POPUP CONFIRMATION SIREN -->
                </v-col>
              </v-row>
              <v-row style="margin-top: 0;">
                <v-col cols="1" />
                <v-col cols="10">
                  <v-chip
                    class="ma-2"
                    :color="checkSirenColor"
                    text-color="white"
                    >SIREN : {{ checkSirenAPI }}</v-chip
                  >
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
            </v-col>
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
                <v-col cols="10">
                  <v-text-field
                    outlined
                    label="Confirmez votre adresse e-mail"
                    placeholder="Confirmez votre adresse e-mail"
                    v-model="confirmEmailContact"
                    :rules="
                      confirmEmailContactRules.concat(confirmEmailContactRule)
                    "
                    required
                    @keyup.enter="validate()"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-alert border="left" color="grey" dark>
                    Votre mot de passe doit contenir au minimum 8 caractères
                    dont une lettre majuscule, une lettre minuscule, un chiffre
                    et un caractère spécial parmis @ $ ! % * ? &
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
                    :rules="
                      confirmPassContactRules.concat(confirmPassContactRule)
                    "
                    :type="show1 ? 'text' : 'password'"
                    required
                    @keyup.enter="validate()"
                    @click:append="show1 = !show1"
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
                <v-btn
                  color="#cf491f"
                  :loading="buttonLoading"
                  x-large
                  @click="recaptcha()"
                  >Enregistrer</v-btn
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
    <a @click="$router.push({ path: '/login' })"
      ><br />Revenir au formulaire de connexion</a
    >
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {serviceLn} from "../../service/licencesnationales/LicencesNationalesApiService";
import {Logger} from "@/utils/Logger";
import {HttpRequestError} from "@/exception/HttpRequestError";
import {serviceGouv} from "@/service/data.gouv/DataGouvApiService";
import {SirenNotFoundError} from "@/service/data.gouv/SirenNotFoundError";

@Component
export default class FormCreationCompte extends Vue {
  show1: boolean = false;
  isValid: Promise<boolean> = this.$recaptchaLoaded();
  token: string = "";
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
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        v
      ) || "L'adresse mail fournie n'est pas valide"
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
  idAbes: string = "";
  roleContact: string = "";
  checkSirenAPI: string = "En attente de vérification";
  checkSirenColor: string = "grey";
  buttonLoading: boolean = false;
  alert: boolean = false;
  error: string = "";
  dialog: boolean = false;
  dialogAvailable: boolean = false;

  get confirmEmailContactRule() {
    return () =>
      this.confirmEmailContact === this.emailContact ||
      "L'adresse mail de confirmation n'est pas valide";
  }
  get confirmPassContactRule() {
    return () =>
      this.confirmPassContact === this.passContact ||
      "Le mot de passe de confirmation n'est pas valide";
  }
  get loggedIn() {
    return this.$store.state.user.isLoggedIn;
  }

  mounted() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  }

  async recaptcha() {
    // (optional) Wait until recaptcha has been loaded.
    await this.$recaptchaLoaded();

    // Execute reCAPTCHA with action "creationCompte".
    this.token = await this.$recaptcha("creationCompte");
    Logger.debug("token dans recaptcha() " + this.token);
    // Do stuff with the received token.
    this.validate();
  }

  //si on veut faire la verif du score sur le front et pas le back on peut faire comme ceci :
  /*isHuman(token: any) {
      const endpoint = `${process.env.VUE_APP_RECAPTCHA_VERIFY_URL}?response=${token}&secret=${process.env.VUE_APP_RECAPTCHA_KEY_SITE}`;
      Logger.debug(
        "requete axios = " +
          axios
            .post(endpoint)
            .then(
              ({ data }) =>
                data.score > process.env.VUE_APP_RECAPTCHA_SCORE_THRESHOLD
            )
      );
      return axios
        .post(endpoint)
        .then(
          ({ data }) =>
            data.score > process.env.VUE_APP_RECAPTCHA_SCORE_THRESHOLD
        );
    },*/

  validate(): void {
    this.alert = false;
    this.error = "";
    //this.recaptcha();
    //if (this.isHuman(this.recaptcha()) {
    if (this.token != null) {
      if (
        (this.$refs.formCreationCompte as Vue & {
          validate: () => boolean;
        }).validate()
      ) {
        this.creationCompte();
      }
    }
  }

  creationCompte(): void {
    this.buttonLoading = true;
    serviceLn
      .creationCompte({
        nom: this.nomEtab,
        siren: this.sirenEtab,
        typeEtablissement: this.typeEtab,
        idAbes: this.idAbes,
        nomContact: this.nomContact,
        prenomContact: this.prenomContact,
        adresseContact: this.adresseContact,
        boitePostaleContact: this.boitePostaleContact,
        codePostalContact: this.codePostalContact,
        villeContact: this.villeContact,
        cedexContact: this.cedexContact,
        telephoneContact: this.telContact,
        mailContact: this.emailContact,
        motDePasse: this.passContact,
        roleContact: this.roleContact,
        recaptcha: this.token
      })
      .then(response => {
        this.buttonLoading = false;
        Logger.debug("notification = " + response.data);
        //this.setNotification(response.data);
        this.$store.dispatch("setNotification", response.data).catch(err => {
          Logger.error(err);
        });
        this.$store.dispatch("setCreationCompteEffectueeTrue").catch(err => {
          Logger.error(err);
        });
        Logger.debug("notification = " + this.$store.state.notification);
        Logger.debug(
          "creationCompteEffectuee = " +
            this.$store.state.creationCompteEffectuee
        );
        this.$router.push({ path: "/login" });
      })
      .catch(err => {
        Logger.error(err.message);
        if (err instanceof HttpRequestError) {
          Logger.debug("Erreur API : " + err.debugMessage);
        }

        this.buttonLoading = false;
        this.error = err.message;
        this.alert = true;
      });
  }

  /**
   * Fonction de vérification du numéro SIREN
   */
  checkSiren(): void {
    this.checkSirenAPI = "Vérification du SIREN en cours...";
    this.checkSirenColor = "grey";
    if (this.sirenEtab.length === 9) {
      this.dialogAvailable = true;
      serviceGouv
        .checkSiren(this.sirenEtab)
        .then(result => {
          this.checkSirenAPI = "valide";
          this.checkSirenColor = "green";
        })
        .catch(err => {
          if (err instanceof HttpRequestError) {
            this.checkSirenAPI =
              "Impossible de contacter le service de vérification du numéro SIREN";
            this.checkSirenColor = "red";
          } else if (err instanceof SirenNotFoundError) {
            this.checkSirenAPI = "inconnu";
            this.checkSirenColor = "red";
          } else {
            this.checkSirenAPI = "Erreur interne : " + err.message;
            this.checkSirenColor = "red";
          }
        });
    } else {
      this.dialogAvailable = false;
    }
    this.checkSirenAPI = "En attente de vérification";
  }

  clear() {
    (this.$refs.formCreationCompte as HTMLFormElement).reset();
  }
}
</script>
