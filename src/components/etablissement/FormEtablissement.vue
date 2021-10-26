<template>
  <div>
    <v-form ref="formCreationCompte" lazy-validation>
      <h3 style="padding-left : 10px;">
        <a @click="$router.push({ path: '/login' })"
          ><br />Votre établissement a déjà un compte ? S'authentifier</a
        >
      </h3>
      <v-card-title>Créer le compte de votre établissement</v-card-title>
      <v-card-text>
        <v-col lg="6" md="12" xs="12">
          <v-alert border="left" type="info" outlined>
            <h4>
              Avant de créer cotre compte, vérifier l'éligibilité de votre
              établissement
            </h4>
            <br />
            <p>
              <strong>Attention : </strong>L'accès aux corpus sous licences
              nationales est reservé aux établissements bénéficiaires selon les
              conditions spécifiques négociées avec chaque éditeur. Pour
              permettre la déclaration des adresses IP autorisées, l'Abes met à
              la disposition des professionnels de la documentation cette
              application dédiée à la gestion des accès.
              <a
                href="http://documentation.abes.fr/aidelicencesnationales/index.html#Beneficiaires"
                target="_blank"
                >Vérifier l'éligibilité de votre établissement.</a
              >
            </p>
            <v-checkbox
              required
              :rules="rulesForms.checkboxRules"
              label="Je confirme que mon établissement est éligible"
            ></v-checkbox>
          </v-alert>
        </v-col>
        <v-card-title>Informations de l'établissement</v-card-title>
        <v-divider></v-divider>
        <br />
        <v-row>
          <v-col lg="6" md="12" xs="12">
            <v-row>
              <v-col cols="1" />
              <v-col cols="10">
                <v-text-field
                  outlined
                  label="Nom de l'établissement"
                  placeholder="Nom de l'établissement"
                  maxlength="80"
                  v-model="nomEtab"
                  :rules="rulesForms.nomEtabRules"
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
                  maxlength="9"
                  v-model="sirenEtab"
                  :rules="rulesForms.sirenEtabRules"
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
                      >Valider
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="headline">
                      Votre SIREN est-il correct ?
                    </v-card-title>
                    <v-card-text
                      >Le SIREN renseigné correspond à l'établissement suivant :
                      <b>{{ checkSirenAPI }}</b></v-card-text
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
                <v-chip class="ma-2" :color="checkSirenColor" text-color="white"
                  >SIREN : {{ checkSirenAPI }}
                </v-chip>
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
                  :items="typesEtab"
                  label="Type de l'établissement"
                  :rules="rulesForms.typeEtabRules"
                  required
                ></v-select>
                <a
                  style="text-decoration: none"
                  href="https://www.sirene.fr/sirene/public/static/recherche"
                  target="_blank"
                >
                  <v-alert border="left" type="info" outlined>
                    Trouver le SIREN de votre établissement ?
                  </v-alert>
                </a>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-card-title>Informations de contact</v-card-title>
        <v-divider></v-divider>
        <br />
        <v-row>
          <v-col lg="6" md="12" xs="12">
            <v-row>
              <v-col cols="1" />
              <v-col cols="10">
                <v-text-field
                  outlined
                  label="Nom"
                  placeholder="Nom"
                  v-model="nomContact"
                  :rules="rulesForms.nomContactRules"
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
                  :rules="rulesForms.prenomContactRules"
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
                  :rules="rulesForms.adresseContactRules"
                  maxlength="80"
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
                  :rules="rulesForms.codePostalContactRules"
                  maxlength="5"
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
                  :rules="rulesForms.villeContactRules"
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
                  maxlength="10"
                  :rules="rulesForms.telContactRules"
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
                  :rules="rulesForms.emailContactRules"
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
                    rulesForms.confirmEmailContactRules.concat(
                      confirmEmailContactRule
                    )
                  "
                  required
                  @keyup.enter="validate()"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="1" />
              <v-col cols="10">
                <v-alert border="left" type="info" outlined>
                  Votre mot de passe doit contenir au minimum 8 caractères dont
                  une lettre majuscule, une lettre minuscule, un chiffre et un
                  caractère spécial parmis @ $ ! % * ? &
                </v-alert>
                <v-text-field
                  outlined
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  label="Mot de passe"
                  placeholder="Mot de passe"
                  v-model="passContact"
                  :rules="rulesForms.passwordRules"
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
                    rulesForms.confirmPassContactRules.concat(
                      confirmPassContactRule
                    )
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
              <v-col cols="10">
                <v-checkbox
                  required
                  :rules="rulesForms.checkboxRules"
                  label="J'accepte les conditions générales liées à la politique de
                confidentialité*"
                ></v-checkbox>
                <div class="subtitle-2">
                  Pour connaître et exercer vos droits relatifs à l'utilisation
                  des données collectées par ce formulaire, veuillez consulter
                  la page
                  <a @click="$router.push({ path: '/donneespersonnelles' })"
                    >Données personnelles</a
                  >
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-col cols="7"></v-col>
        <v-col>
          <v-row>
            <v-col cols="4"></v-col>
            <v-col cols="3">
              <v-btn x-large color="secondary" @click="clear"> Effacer</v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn
                color="button"
                :loading="buttonLoading"
                x-large
                @click="recaptcha()"
                >Enregistrer
                <v-icon style="padding-left: 5px;"
                  >mdi-arrow-right-circle-outline
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-card-actions>
    </v-form>
    <br />
    <v-alert dense outlined :value="alert" type="error">
      {{ error }}
    </v-alert>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import { Logger } from "@/utils/Logger";
import { serviceGouv } from "@/core/service/data.gouv/DataGouvApiService";
import { SirenNotFoundError } from "@/core/service/data.gouv/exception/SirenNotFoundError";
import { LicencesNationalesUnauthorizedApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesUnauthorizedApiError";
import { DataGouvApiError } from "@/core/service/data.gouv/exception/DataGouvApiError";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import { rulesForms } from "@/core/RulesForm";
import Etablissement from "@/core/Etablissement";
import {Action} from "@/core/CommonDefinition";
import Editeur from "@/core/Editeur";

@Component
export default class FormEtablissement extends Vue {
  etablissement: Etablissement;
  @Prop() action!: Action;
  Action: any = Action;
  rulesForms: any = rulesForms;
  show1: boolean = false;
  isValid: Promise<boolean> = this.$recaptchaLoaded();
  token: string = "";
  typesEtab: Array<string> = [];
  checkSirenAPI: string = "En attente de vérification";
  checkSirenColor: string = "grey";
  buttonLoading: boolean = false;
  alert: boolean = false;
  error: string = "";
  dialog: boolean = false;
  dialogAvailable: boolean = false;

  constructor() {
    super();
    this.etablissement = this.getCurrentEtablissement;
  }

  update(){
    this.etablissement = this.getCurrentEtablissement;
  }

  get getCurrentEtablissement(): Etablissement {
    return this.$store.getters.getCurrentEtablissement();
  }

  async recaptcha() {
    // (optional) Wait until recaptcha has been loaded.
    await this.$recaptchaLoaded();

    // Execute reCAPTCHA with action "creationCompte".
    this.token = await this.$recaptcha("creationCompte");
    Logger.debug("getToken dans recaptcha() " + this.token);
    // Do stuff with the received getToken.
    this.validate();
  }

  validate(): void {
    this.alert = false;
    this.error = "";
    this.recaptcha();
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
    this.alert = false;

    etablissementService
      .creerEtablissement(this.etablissement, this.token)
      .then(response => {
        this.buttonLoading = false;
        Logger.debug("notification = " + "l'établissement à bien été créé");
        //this.setNotification(response.data);
        this.$store.dispatch("setNotification", "l'établissement à bien été créé").catch(err => {
          Logger.error(err);
        });
        this.$store.dispatch("setCreationCompteEffectueeTrue").catch(err => {
          Logger.error(err);
        });
        Logger.debug("notification = " + this.$store.getters.notification());
        Logger.debug(
          "creationCompteEffectuee = " +
            this.$store.getters.creationCompteEffectuee()
        );
        this.$router.push({ path: "/login" });
      })
      .catch(err => {
        this.buttonLoading = false;
        this.alert = true;

        if (err instanceof LicencesNationalesUnauthorizedApiError) {
          this.error =
            "Vous n'êtes pas autorisé à effectuer cette opération.: " +
            err.message;
          Logger.error(err.toString());
        } else {
          Logger.error(err.toString());
          this.error = "Impossible d'exécuter l'action : " + err.message;
        }
      });
  }

  /**
   * Fonction de vérification du numéro SIREN
   */
  checkSiren(): void {
    this.checkSirenAPI = "Vérification du SIREN en cours...";
    this.checkSirenColor = "grey";
    if (this.etablissement.siren.length === 9) {
      this.dialogAvailable = true;
      serviceGouv
        .checkSiren(this.etablissement.siren)
        .then(() => {
          this.checkSirenAPI = "valide";
          this.checkSirenColor = "green";
        })
        .catch(err => {
          Logger.error(err);
          if (err instanceof SirenNotFoundError) {
            this.checkSirenAPI = "inconnu";
            this.checkSirenColor = "red";
          } else if (err instanceof DataGouvApiError) {
            this.checkSirenAPI =
              "Impossible de contacter le service de vérification du numéro SIREN";
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

  fetchListeType(): void {
    etablissementService.listeType().then(result => {
      result.data.forEach(element => {
        this.typesEtab.push(element.libelle);
      });
    });
  }

  clear() {
    (this.$refs.formCreationCompte as HTMLFormElement).reset();
  }
}
</script>
<style src="../login/style.css"></style>
