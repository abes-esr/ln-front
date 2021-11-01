<template>
  <v-card>
    <v-form ref="formCreationCompte" lazy-validation>
      <v-card-subtitle @click="$router.push({ path: '/login' })">
        Votre établissement a déjà un compte ? S'authentifier
      </v-card-subtitle>
      <v-card-title v-if="action === Action.CREATION" class="pl-3">
        Créer le compte de votre établissement
      </v-card-title>
      <v-card-text>
        <v-row v-if="action === Action.CREATION">
          <v-col cols="12" md="6" lg="6" xl="6">
            <v-alert border="left" type="info" outlined>
              <h4 class="mb-1">
                Avant de créer cotre compte, vérifier l'éligibilité de votre
                établissement
              </h4>
              <p>
                <strong>Attention : </strong>L'accès aux corpus sous licences
                nationales est reservé aux établissements bénéficiaires selon
                les conditions spécifiques négociées avec chaque éditeur. Pour
                permettre la déclaration des adresses IP autorisées, l'Abes met
                à la disposition des professionnels de la documentation cette
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
        </v-row>
        <v-row
          v-if="
            (action === Action.MODIFICATION && isAdmin) ||
              action === Action.CREATION
          "
        >
          <v-card-title>Informations de l'établissement</v-card-title>
        </v-row>
        <v-row>
          <v-divider></v-divider>
        </v-row>
        <v-row class="pt-1">
          <v-col cols="12" md="6" lg="6" xl="6">
            <v-text-field
              outlined
              label="Nom de l'établissement"
              placeholder="Nom de l'établissement"
              maxlength="80"
              v-model="etablissement.nom"
              :rules="rulesForms.nomEtabRules"
              required
              @keyup.enter="validate()"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            <v-select
              outlined
              v-model="etablissement.typeEtablissement"
              :items="typesEtab"
              label="Type de l'établissement"
              :rules="rulesForms.typeEtabRules"
              required
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" lg="6" xl="6">
            <v-text-field
              outlined
              label="SIREN"
              placeholder="SIREN"
              maxlength="9"
              v-model="etablissement.siren"
              :rules="rulesForms.sirenEtabRules"
              required
              @input="checkSiren()"
              @keyup.enter="validate()"
            ></v-text-field>
            <v-chip class="ma-2" :color="checkSirenColor" text-color="white"
              >SIREN : {{ checkSirenAPI }}
            </v-chip>
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
                  <v-btn color="green darken-1" text @click="dialog = false">
                    Non
                  </v-btn>
                  <v-btn color="green darken-1" text @click="dialog = false">
                    Oui
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- FIN POPUP CONFIRMATION SIREN -->
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            <v-btn
              color="primary"
              rounded
              href="https://www.sirene.fr/sirene/public/static/recherche"
              target="_blank"
              outlined
            >
              Trouver le SIREN de votre établissement ?
            </v-btn>
          </v-col>
        </v-row>
        <v-card-title>Information Contact</v-card-title>
        <v-divider class="mb-4"></v-divider>
        <contact :action="action" :contact="etablissement.contact" />
        <v-col cols="12" md="6" lg="6" xl="6" v-if="action === Action.CREATION">
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
        </v-col>
        <v-col cols="12" md="6" lg="6" xl="6">
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-btn
              color="button"
              :loading="buttonLoading"
              x-large
              @click="recaptcha()"
              >Enregistrer
              <v-icon class="pl-1">mdi-arrow-right-circle-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-card-text>
    </v-form>
    <v-alert dense outlined :value="alert" type="error">
      {{ error }}
    </v-alert>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Logger } from "@/utils/Logger";
import { serviceGouv } from "@/core/service/data.gouv/DataGouvApiService";
import { SirenNotFoundError } from "@/core/service/data.gouv/exception/SirenNotFoundError";
import { LicencesNationalesUnauthorizedApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesUnauthorizedApiError";
import { DataGouvApiError } from "@/core/service/data.gouv/exception/DataGouvApiError";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import { rulesForms } from "@/core/RulesForm";
import Etablissement from "@/core/Etablissement";
import { Action } from "@/core/CommonDefinition";
import Contact from "@/components/etablissement/Contact.vue";

@Component({
  components: { Contact }
})
export default class FormEtablissement extends Vue {
  etablissement: Etablissement;
  @Prop() action!: Action;
  Action: any = Action;
  rulesForms: any = rulesForms;
  isAdmin: boolean = this.$store.getters.isAdmin();
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

  update() {
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
        this.$store
          .dispatch("setNotification", "l'établissement à bien été créé")
          .catch(err => {
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
