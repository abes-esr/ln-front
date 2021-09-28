<template>
  <div>
    <v-card witdh="100%" outlined>
      <v-form ref="formNouvelEditeur" lazy-validation>
        <v-row align="center" justify="center">
          <v-col lg="12" md="12" xs="12">
            <v-row>
              <v-col cols="1" />
              <v-col cols="10">
                <v-card-title>Création d'un nouvel éditeur</v-card-title>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row align="center" justify="center">
          <v-col lg="9" md="12" xs="12">
            <v-card-text>
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
                    label="Identifiant éditeur"
                    placeholder="Identifiant éditeur"
                    v-model="identifiantEditeur"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-select
                    v-model="selectedTypesEtab"
                    :items="typesEtab"
                    label="Groupes d'établissements reliés"
                    multiple
                    outlined
                  >
                    <template v-slot:prepend-item>
                      <v-list-item ripple @click="toggle">
                        <v-list-item-action>
                          <v-icon
                            :color="
                              selectedTypesEtab.length > 0
                                ? 'indigo darken-4'
                                : ''
                            "
                          >
                            {{ icon }}
                          </v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title>
                            Tout sélectionner
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider class="mt-2"></v-divider>
                    </template>
                  </v-select>
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
                  <module-contact-commercial
                    v-on:FormModuleContactCommercialEvent="
                      remplirListeContactsCommerciauxFromModule
                    "
                    v-for="n in moduleContactCommercialNumber"
                    :key="n"
                  ></module-contact-commercial>
                  <v-card-actions class="v-card__actions">
                    <v-row>
                      <v-col cols="10">
                        <v-main
                          >Nombre de contacts commerciaux :
                          {{ moduleContactCommercialNumber }}</v-main
                        >
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="1" />
                      <v-col cols="10">
                        <v-btn @click="increaseModuleContactCommercialNumber"
                          >Ajouter un contact commercial
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="1" />
                      <v-col cols="10">
                        <v-btn @click="decreaseModuleContactCommercialNumber"
                          >Supprimer un contact commercial
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-actions>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <module-contact-technique
                    v-on:FormModuleContactTechniqueEvent="
                      remplirListeContactsTechniquesFromModule
                    "
                    v-for="n in moduleContactTechniqueNumber"
                    :key="n"
                  ></module-contact-technique>
                  <v-card-actions class="v-card__actions">
                    <v-row>
                      <v-col cols="10">
                        <v-main
                          >Nombre de contacts technique :
                          {{ moduleContactTechniqueNumber }}</v-main
                        >
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="1" />
                      <v-col cols="10">
                        <v-btn @click="increaseModuleContactTechniqueNumber"
                          >Ajouter un contact technique
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="1" />
                      <v-col cols="10">
                        <v-btn @click="decreaseModuleContactTechniqueNumber"
                          >Supprimer un contact technique
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-actions>
                </v-col>
              </v-row>
            </v-card-text>
          </v-col>
        </v-row>

        <v-card-actions class="v-card__actions">
          <v-row>
            <v-col cols="9"></v-col>
            <v-col>
              <v-btn @click="clear()">Annuler </v-btn>
              <v-btn
                @click="enclencherAjouterContactsEditeur()"
                :loading="buttonLoading"
                color="success"
                >Valider
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
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { serviceLn } from "../../service/licencesnationales/LicencesNationalesApiService";
import ModuleContactTechnique from "@/components/ModuleContactTechnique.vue";
import ModuleContactCommercial from "@/components/ModuleContactCommercial.vue";
import {
  AjouterContactsCommerciauxEditeurEvent,
  AjouterContactsTechniquesEditeurEvent
} from "@/main";
import { Logger } from "@/utils/Logger";

@Component({
  components: { ModuleContactTechnique, ModuleContactCommercial }
})
export default class NouvelEditeur extends Vue {
  nomEditeur: string = "";
  nomEditeurRules = [
    (v: string) => !!v || "Le nom de l'éditeur est obligatoire",
    (v: string) =>
      /^([0-9A-Za-z'àâéèêôùûçÀÂÉÈÔÙÛÇ,\s-]{5,80})$/.test(v) ||
      "Le nom de l'éditeur fourni n'est pas valide"
  ];
  identifiantEditeur: string = "";
  typesEtab: Array<string> = [
    "Universités, grandes écoles, écoles de formation spécialisées",
    "CHR-CHU",
    "Etablissements de santé (autres que CHR-CHU)",
    "Ecoles françaises à l'étranger",
    "Etablissements publics administratifs",
    "Organismes de recherche",
    "Etablissements publics de coopération scientifique",
    "Etablissements publics de coopération culturelle",
    "Etablissements publics à caractère industriel et commercial",
    "Fondation reconnues d'utilité publique",
    "GIP",
    "Réseau Latitude France",
    "Bibliothèques de lecture publique"
  ];
  selectedTypesEtab: Array<string> = [];
  adresseEditeur: string = "";
  adresseEditeurRules = [
    (v: string) =>
      !!v || "L'adresse postale de l'établissement est obligatoire",
    (v: string) =>
      /^([0-9A-Za-z'àâéèêôùûçÀÂÉÈÔÙÛÇ,\s-]{5,80})$/.test(v) ||
      "L'adresse postale fournie n'est pas valide"
  ];
  moduleContactCommercialNumber: number = 1;
  moduleContactTechniqueNumber: number = 1;
  listeContactsCommerciauxEditeurDTO: Array<string> = [];
  listeContactsTechniquesEditeurDTO: Array<string> = [];
  buttonLoading: boolean = false;
  alert: boolean = false;
  error: string = "";

  get loggedIn() {
    return this.$store.state.user.isLoggedIn;
  }
  get tousTypesEtab(): any {
    return this.selectedTypesEtab.length === this.typesEtab.length;
  }
  get certainsTypesEtab(): any {
    return this.selectedTypesEtab.length > 0 && !this.tousTypesEtab;
  }
  get icon() {
    if (this.tousTypesEtab) return "mdi-close-box";
    if (this.certainsTypesEtab) return "mdi-minus-box";
    return "mdi-checkbox-blank-outline";
  }

  /* ordre du process :
   * au clic sur valider => enclencherAjouterContactsEditeur()
   * 1 - verifie les champs obligatoire de formNouvelEditeur
   * 2 - remets à zero les listes formModuleCC et CT au cas où erreurs utilisateurs en amont => evite doublonnage
   * 3 - si min 1CC et 0CT
   *         envoie l'event CC,
   *         on arrive sur le module CC au niveau du mounted eventON puis verification des champs avec le validate et enfin le emit dans la méthode validAndSend
   *         on revient sur nouvelEditeur sur le champs cc et v-on = la méthode de remplissage liste CC
   *         on transfère le payload dans l'array listeCC-DTO
   *         validate
   *   -si min 1CT
   *         envoie l'event CT,
   *         on arrive sur le module CT au niveau du mounted eventON puis verification des champs avec le validate et enfin le emit dans la méthode validAndSend
   *         on revient sur nouvelEditeur sur le champs ct et v-on = la méthode de remplissage liste CT
   *         on transfère le payload dans l'array listeCT-DTO
   *         on déclenche l'event CC
   *         on arrive sur le module CC au niveau du mounted eventON puis verification des champs avec le validate et enfin le emit dans la méthode validAndSend
   *         on revient sur nouvelEditeur sur le champs cc et v-on = la méthode de remplissage liste CC
   *         on transfère le payload dans l'array listeCC-DTO
   *         les 2 listes sont remplies
   *         validate
   * 4 - on verifie les champs du formNouvelEditeur (les verifications modules se passent au nv des modules
   * 5 - on envoit
   * Vérifications : dans l'ordre
   * 1 - au clic sur valider : verifie les champs formNouvelEditeur (obligatoires nomEditeur + adresse)
   * 2 - si aucun modules CC ou CT remplis, étant donné que par défaut les compteurs modules sont à 1, l'event CT se déclenche et repère le module vide avec son validate
   *   - cas d'utilisation :
   *          => l'utilisateur remplit 1 CT et 0 CC et clique sur valider
   *             l'event CT est envoyé, on arrive sur le module CT, on vérifie les données, on emit, on reçoit au nv du v-on sur le champs ct, la méthode de remplissage ct se déclenche
   *             la liste ct est remplie, on envoit l'event cc, on arrive sur le module au nv du validate, qui repère que le module est vide et renvoit du rouge et l'utilisateur est bloqué car le module par défaut à 1 est vide
   *             l'utilisateur supprime le module clique sur envoyer ou remplit le module CC
   *             le process reprend => d'où l'utilité de mettre à zero les listes pour couvrir le cas où il y a des erreurs
   *          => l'utilisateur remplit 1CC et 0CT
   *             l'event CT est envoyé, car par défaut les modules sont à 1, on arrive sur le module CT, au nv du validate, qui repère que le module est vide et renvoit du rouge et l'utilisateur est bloqué car le module par défaut à 1 est vide
   *             l'utilisateur supprime le module clique sur envoyer ou remplit le module CT
   *             le process reprend
   *             si il a supprimé le CT, le compteur CT est à 0 et qd il clique sur valider le if CC!= 0 && CT==0 déclenche l'event CC directement
   *
   * En résumé : par defaut on affiche 1 module CC et 1 module CT donc si l'utilisateur ne supprime pas les modules qu'il n'utilisent pas, au clic sur valider ce sera l'event CT qui sera envoyé
   *             qui renvoit du rouge sur le CT vide
   *             0CC et 1 CT = event CT => verif module CT=> remplissage liste CT  ==> validate => send
   *             1CC et 0CT = event CC = > verif module CC=> remplissage liste CC + ==> validate => send
   *             et situation par défaut:
   *             1CC et 1CT = event CT => verif module CT=> remplissage liste CT + event CC = > verif module CC=> remplissage liste CC + ==> validate => send
   *
   * */

  ///////////////methodes utilitaires////////////

  increaseModuleContactCommercialNumber(): void {
    this.moduleContactCommercialNumber++;
  }

  decreaseModuleContactCommercialNumber(): void {
    this.moduleContactCommercialNumber--;
  }

  increaseModuleContactTechniqueNumber(): void {
    this.moduleContactTechniqueNumber++;
  }

  decreaseModuleContactTechniqueNumber(): void {
    this.moduleContactTechniqueNumber--;
  }

  toggle(): void {
    this.$nextTick(() => {
      if (this.tousTypesEtab) {
        this.selectedTypesEtab = [];
      } else {
        this.selectedTypesEtab = this.typesEtab.slice();
      }
    });
  }

  ////////////////Au clic sur valider on envoit les évenements vers les modules CC ou CT///////////////////////

  /*enclencherAjouterContactsEditeur(): void {
    Logger.debug("debut enclencherAjouterContactsEditeur");
    AjouterContactsEditeurEvent.$emit("ajouterContactsEditeurEvent");
    AjouterContactsEditeurEvent.$emit("clear");
  }*/

  enclencherAjouterContactsEditeur(): void {
    this.error = "";
    this.alert = false;
    if (
      (this.$refs.formNouvelEditeur as Vue & {
        validate: () => boolean;
      }).validate()
    ) {
      console.log("debut enclencherAjouterContactsEditeur");

      //Remettre à zéro les listes dans le cas où l'utilisateur aurait déjà cliqué au préalable sur valider et ayant reçu des erreurs
      //notamment du fait que on offre un module CC et un module CT par défaut
      //si un module reste vide il faut nécéssairement qu'il clique sur - pour le retirer
      if (this.listeContactsTechniquesEditeurDTO.length != 0)
        this.listeContactsTechniquesEditeurDTO.length = 0;
      if (this.listeContactsCommerciauxEditeurDTO.length != 0)
        this.listeContactsCommerciauxEditeurDTO.length = 0;

      //si 0 CT et au moins 1 CC on va directement recup les infos au module CC
      if (
        this.moduleContactTechniqueNumber == 0 &&
        this.moduleContactCommercialNumber != 0
      ) {
        AjouterContactsCommerciauxEditeurEvent.$emit(
          "AjouterContactsCommerciauxEditeurEvent"
        );
      }
      //si en revanche on a au moins 1 module CT remplit, c'est lui qui prend les devants
      AjouterContactsTechniquesEditeurEvent.$emit(
        "AjouterContactsTechniquesEditeurEvent"
      );
    }
  }

  ////////////////les modules CT ou CC ont renvoyé un signal emit, nos v-on reçoivent le signal, les méthodes de remplissages des listes se déclenchent /////////////
  remplirListeContactsCommerciauxFromModule(payload: never): void {
    Logger.debug("remplirListeContactCommercialFromModule");
    this.listeContactsCommerciauxEditeurDTO.push(payload);
    //si pas de contacts techniques remplis, on envoit directement les contacts commerciaux
    if (this.moduleContactTechniqueNumber == 0) this.validate();
  }

  remplirListeContactsTechniquesFromModule(payload: never): void {
    Logger.debug("remplirListeContactTechniqueFromModule");
    //on remplit la liste à partir du module
    this.listeContactsTechniquesEditeurDTO.push(payload);

    //on remet la liste CC à zéro => cas où l'utilisateur a cliqué sur valider alors qu'il a laissé des modules vides
    //l'erreur lui a été signalée (champs en rouge)
    //il supprime les modules vide et clique à nouveau sur valider
    //les listes se reremplissent donc doublonnages
    //c'est pourquoi on fait ce qui suit
    if (this.listeContactsCommerciauxEditeurDTO.length != 0)
      this.listeContactsCommerciauxEditeurDTO.length = 0;

    //si un ou des modules contacts commerciaux sont remplis on envoit l'evenement d'ajout CC
    if (this.moduleContactCommercialNumber != 0) {
      AjouterContactsCommerciauxEditeurEvent.$emit(
        "AjouterContactsCommerciauxEditeurEvent"
      );
    }
    if (
      this.listeContactsCommerciauxEditeurDTO.length ==
        this.moduleContactCommercialNumber &&
      this.listeContactsTechniquesEditeurDTO.length ==
        this.moduleContactTechniqueNumber
    ) {
      this.validate();
    }
  }

  /////////////////on valide et on envoit au back////////////////////////

  //on verifie que l'utilisateur a bien remplit les champs obligatoires pas ceux des modules (nom et adresse)
  validate(): void {
    this.error = "";
    this.alert = false;
    if (
      (this.$refs.formNouvelEditeur as Vue & {
        validate: () => boolean;
      }).validate()
    ) {
      this.send();
    }
  }

  send(): void {
    this.buttonLoading = true;

    //on verifie que le nb d'éléments dans les liste correspond bien aux nb des compteurs
    if (
      this.listeContactsCommerciauxEditeurDTO.length ==
        this.moduleContactCommercialNumber &&
      this.listeContactsTechniquesEditeurDTO.length ==
        this.moduleContactTechniqueNumber
    ) {
      if (
        (this.$refs.formNouvelEditeur as Vue & {
          validate: () => boolean;
        }).validate()
      ) {
        console.log({
          listeContactsCommerciauxEditeurDTO: this
            .listeContactsCommerciauxEditeurDTO
        });

        this.alert = false;

        serviceLn
          .createEditeur(this.$store.state.user.token, {
            nomEditeur: this.nomEditeur,
            identifiantEditeur: this.identifiantEditeur,
            groupesEtabRelies: this.selectedTypesEtab,
            adresseEditeur: this.adresseEditeur,
            listeContactCommercialEditeurDTO: this
              .listeContactsCommerciauxEditeurDTO,
            listeContactTechniqueEditeurDTO: this
              .listeContactsTechniquesEditeurDTO
          })
          .then(response => {
            this.alert = true;
            this.buttonLoading = false;
            this.$store
              .dispatch("setNotification", response.data)
              .catch(err => {
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
    }
  }

  clear() {
    (this.$refs.formNouvelEditeur as HTMLFormElement).reset();
  }
}
</script>
