<template>
  <div>
    <v-card witdh="100%" outlined>
      <v-form ref="formEditeur" lazy-validation>
        <v-card-title v-if="action == Action.CREATION"
          >Créer un éditeur
        </v-card-title>
        <v-card-title v-else-if="action == Action.MODIFICATION"
          >Modifier un éditeur
        </v-card-title>
        <v-card-text>
          <v-card flat>
            <v-alert dense outlined :value="alert" type="error">
              {{ error }}
            </v-alert>
            <v-card-title>Information de l'éditeur</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6" lg="6" xl="6">
                  <v-text-field
                    outlined
                    label="NOM DE L'EDITEUR"
                    placeholder="NOM DE L'EDITEUR"
                    v-model="editeur.nom"
                    :rules="nomEditeurRules"
                    required
                    @keyup.enter="validate()"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" lg="6" xl="6">
                  <v-text-field
                    outlined
                    label="Identifiant éditeur"
                    placeholder="Identifiant éditeur"
                    v-model="editeur.identifiantBis"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" lg="6" xl="6">
                  <v-select
                    v-model="editeur.groupesEtabRelies"
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
                              editeur.groupesEtabRelies.length > 0
                                ? 'indigo darken-4'
                                : ''
                            "
                          >
                            {{ iconEtab }}
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
                <v-col cols="12" md="6" lg="6" xl="6">
                  <v-text-field
                    outlined
                    label="Adresse postale"
                    placeholder="Adresse postale"
                    v-model="editeur.adresse"
                    :rules="adresseEditeurRules"
                    required
                    @keyup.enter="validate()"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-card flat>
            <v-card-title>
              {{ editeur.contacts.length }} contact(s)</v-card-title
            >
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6" lg="6" xl="6">
                  <v-container
                    v-for="(contact, index) in editeur.contacts"
                    :key="index"
                  >
                    <contact
                      :ref="'contactForm_' + index"
                      :contact="contact"
                      @onChange="removeContact(contact)"
                    ></contact>
                  </v-container>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions class="v-card__actions">
              <v-btn
                color="primary"
                class="ma-2 white--text"
                @click="addContact()"
              >
                <font-awesome-icon :icon="['fas', 'plus']" class="mx-2" />
                Ajouter un contact
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-card-text>
        <v-card-actions class="v-card__actions">
          <v-row>
            <v-col cols="9"></v-col>
            <v-col>
              <v-btn @click="clear()" color="grey" class="mx-2">Vider </v-btn>
              <v-btn
                @click="validate()"
                :loading="buttonLoading"
                class="btn-1 mx-2"
                >Valider
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {Logger} from "@/utils/Logger";
import {Action, ContactType} from "@/core/CommonDefinition";
import Editeur from "@/core/Editeur";
import Contact from "@/components/editeur/Contact.vue";
import ContactEditeur from "@/core/ContactEditeur";
import {LicencesNationalesUnauthorizedApiError} from "@/core/service/licencesnationales/exception/LicencesNationalesUnauthorizedApiError";
import {editeurService} from "@/core/service/licencesnationales/EditeurService";

@Component({
  components: { Contact }
})
export default class ComposantEditeur extends Vue {
  editeur: Editeur;
  @Prop() action!: Action;
  Action: any = Action;

  nomEditeurRules = [
    (v: string) => !!v.trim() || "Le nom de l'éditeur est obligatoire",
    (v: string) =>
      /^([0-9A-Za-z'àâéèêôùûçÀÂÉÈÔÙÛÇ,\s-]{5,80})$/.test(v.trim()) ||
      "Le nom de l'éditeur fourni n'est pas valide"
  ];

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
  adresseEditeurRules = [
    (v: string) =>
      !!v.trim() || "L'adresse postale de l'établissement est obligatoire",
    (v: string) =>
      /^([0-9A-Za-z'àâéèêôùûçÀÂÉÈÔÙÛÇ,\s-]{5,80})$/.test(v.trim()) ||
      "L'adresse postale fournie n'est pas valide"
  ];

  buttonLoading: boolean = false;
  alert: boolean = false;
  error: string = "";

  constructor() {
    super();
    this.editeur = this.getCurrentEditeur;
  }

  get getCurrentEditeur(): Editeur {
    return this.$store.getters.getCurrentEditeur();
  }

  get tousTypesEtab(): any {
    return this.editeur.groupesEtabRelies.length === this.typesEtab.length;
  }

  get certainsTypesEtab(): any {
    return this.editeur.groupesEtabRelies.length > 0 && !this.tousTypesEtab;
  }

  get iconEtab() {
    if (this.tousTypesEtab) return "mdi-close-box";
    if (this.certainsTypesEtab) return "mdi-minus-box";
    return "mdi-checkbox-blank-outline";
  }

  toggle(): void {
    this.$nextTick(() => {
      if (this.tousTypesEtab) {
        this.editeur.groupesEtabRelies = [];
      } else {
        this.editeur.groupesEtabRelies = this.typesEtab.slice();
      }
    });
  }

  validate(): void {
    this.error = "";
    this.alert = false;

    // On vérifie le formulaire éditeur
    let isValide: boolean = (this.$refs.formEditeur as Vue & {
      validate: () => boolean;
    }).validate();

    // On vérifie les formulaires contacts
    let isSubFormValide: boolean = false;
    let countContactTechnique: number = 0;
    let countContactCommercial: number = 0;
    for (let index = 0; index < this.editeur.contacts.length; index++) {
      if (this.editeur.contacts[index].type == ContactType.TECHNIQUE) {
        countContactTechnique++;
      } else if (this.editeur.contacts[index].type == ContactType.COMMERCIAL) {
        countContactCommercial++;
      }
      isSubFormValide = this.$refs["contactForm_" + index][0].validate();

      if (!isValide || !isSubFormValide) {
        // Si le formulaire éditeur n'était pas valide, on garde à non valide
        isValide = false;
      } else {
        isValide = true;
      }
    }

    if (countContactCommercial === 0 || countContactTechnique === 0) {
      isValide = false;
      this.buttonLoading = false;
      this.error = "Vous devez saisir au moins un contact technique et un contact commercial";
      this.alert = true;
    }

    if (isValide) {
      this.send();
    }
  }

  addContact(): void {
    Logger.debug("Ajout d'un contact par défaut");
    const contact = new ContactEditeur();
    this.editeur.addContact(contact);
  }

  removeContact(item: ContactEditeur): void {
    this.editeur.removeContact(item);
  }

  send(): void {
    this.buttonLoading = true;
    this.alert = false;

    if (this.action == Action.CREATION) {
      editeurService
        .createEditeur(this.editeur, this.$store.getters.getToken())
        .then(() => {
          this.alert = true;
          this.buttonLoading = false;
          this.$store.dispatch("setNotification", "OK").catch(err => {
            Logger.error(err);
          });
          Logger.debug("notification = " + this.$store.state.notification);
          this.$router.push({ path: "/listeEditeurs" });
        })
        .catch(err => {
          this.buttonLoading = false;
          this.alert = true;
          Logger.error(err.toString());
          if (err instanceof LicencesNationalesUnauthorizedApiError) {
            this.error = "Vous n'êtes pas autorisé à effectuer cette opération";
          } else {
            this.error = "Impossible de créer l'éditeur : " + err.message;
          }
        });
    } else if (this.action == Action.MODIFICATION) {
      editeurService
        .updateEditeur(this.editeur, this.$store.getters.getToken())
        .then(() => {
          this.alert = true;
          this.buttonLoading = false;
          this.$store.dispatch("setNotification", "OK").catch(err => {
            Logger.error(err);
          });
          Logger.debug("notification = " + this.$store.state.notification);
          this.$router.push({ path: "/listeEditeurs" });
        })
        .catch(err => {
          this.buttonLoading = false;
          this.alert = true;
          Logger.error(err.toString());
          if (err instanceof LicencesNationalesUnauthorizedApiError) {
            this.error = "Vous n'êtes pas autorisé à effectuer cette opération";
          } else {
            this.error = "Impossible de créer l'éditeur : " + err.message;
          }
        });
    }
  }

  clear() {
    this.buttonLoading = false;
    this.alert = false;
    (this.$refs.formEditeur as HTMLFormElement).reset(); // Formulaire editeur

    for (let index = 0; index < this.editeur.contacts.length; index++) {
      // Formulaire contact
      this.$refs["contactForm_" + index][0].clear();
    }
  }
}
</script>
