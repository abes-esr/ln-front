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
                    v-on:ContactsCommerciauxFromModuleEvent="
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
                    v-on:ContactsTechniquesFromModuleEvent="
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
import Vue from "vue";
import { HTTP } from "../utils/http-commons";
import { mapActions } from "vuex";
import ModuleContactTechnique from "@/components/ModuleContactTechnique.vue";
import ModuleContactCommercial from "@/components/ModuleContactCommercial.vue";
import {
  AjouterContactsCommerciauxEditeurEvent,
  AjouterContactsTechniquesEditeurEvent
} from "@/main";

export default Vue.extend({
  name: "NouvelEditeur",
  components: { ModuleContactTechnique, ModuleContactCommercial },
  data() {
    return {
      show1: false,
      nomEditeur: "" as string,
      nomEditeurRules: [
        (v: never) => !!v || "Le nom de l'éditeur est obligatoire",
        (v: never) =>
          /^([0-9A-Za-z'àâéèêôùûçÀÂÉÈÔÙÛÇ,\s-]{5,80})$/.test(v) ||
          "Le nom de l'éditeur fourni n'est pas valide"
      ],
      identifiantEditeur: "" as string,
      /*identifiantEditeurRules: [
        (v: never) => !!v || "L'identifiant de l'éditeur est obligatoire",
        (v: never) =>
          /^[0-9]$/.test(v) ||
          "L'identifiant éditeur est uniquement composé de chiffres"
      ],*/
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
      selectedTypesEtab: [],
      adresseEditeur: "" as string,
      adresseEditeurRules: [
        (v: never) =>
          !!v || "L'adresse postale de l'établissement est obligatoire",
        (v: never) =>
          /^([0-9A-Za-z'àâéèêôùûçÀÂÉÈÔÙÛÇ,\s-]{5,80})$/.test(v) ||
          "L'adresse postale fournie n'est pas valide"
      ],
      moduleContactCommercialNumber: 1,
      moduleContactTechniqueNumber: 1,
      listeContactsCommerciauxEditeurDTO: [] as any,
      listeContactsTechniquesEditeurDTO: [] as any,
      buttonLoading: false,
      alert: false,
      error: ""
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.user.isLoggedIn;
    },
    tousTypesEtab(): any {
      return this.selectedTypesEtab.length === this.typesEtab.length;
    },
    certainsTypesEtab(): any {
      return this.selectedTypesEtab.length > 0 && !this.tousTypesEtab;
    },
    icon() {
      if (this.tousTypesEtab) return "mdi-close-box";
      if (this.certainsTypesEtab) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    }
  },
  mounted() {
    console.log(
      "ListCC.length = " + this.listeContactsCommerciauxEditeurDTO.length
    );
    console.log(
      "ListCT.length = " + this.listeContactsTechniquesEditeurDTO.length
    );
  },

  methods: {
    ...mapActions({
      setNotification: "setNotification"
    }),

    remplirListeContactsCommerciauxFromModule(payload: never): void {
      console.log("remplirListeContactsCommerciauxFromModule");
      this.listeContactsCommerciauxEditeurDTO.push(payload);

      console.log(
        "ListCC.length = " + this.listeContactsCommerciauxEditeurDTO.length
      );
      console.log(
        "ListCT.length = " + this.listeContactsTechniquesEditeurDTO.length
      );

      //AjouterContactsCommerciauxEditeurEvent.$emit("clear");
      if (
        this.listeContactsCommerciauxEditeurDTO.length ==
          this.moduleContactCommercialNumber &&
        this.listeContactsTechniquesEditeurDTO.length ==
          this.moduleContactTechniqueNumber
      ) {
        this.send();
      }
    },
    remplirListeContactsTechniquesFromModule(payload: never): void {
      console.log("remplirListeContactsTechniquesFromModule");
      this.listeContactsTechniquesEditeurDTO.push(payload);

      AjouterContactsTechniquesEditeurEvent.$emit("clear");
      AjouterContactsCommerciauxEditeurEvent.$emit(
        "ajouterContactsCommerciauxEditeurEvent"
      );
      if (
        this.listeContactsCommerciauxEditeurDTO.length ==
          this.moduleContactCommercialNumber &&
        this.listeContactsTechniquesEditeurDTO.length ==
          this.moduleContactTechniqueNumber
      ) {
        this.send();
      }
    },
    enclencherAjouterContactsEditeur(): void {
      console.log("debut enclencherAjouterContactsEditeur");
      AjouterContactsTechniquesEditeurEvent.$emit(
        "ajouterContactsTechniquesEditeurEvent"
      );
    },
    increaseModuleContactCommercialNumber: function() {
      this.moduleContactCommercialNumber++;
    },
    decreaseModuleContactCommercialNumber: function() {
      this.moduleContactCommercialNumber--;
    },
    increaseModuleContactTechniqueNumber: function() {
      this.moduleContactTechniqueNumber++;
    },
    decreaseModuleContactTechniqueNumber: function() {
      this.moduleContactTechniqueNumber--;
    },
    toggle() {
      this.$nextTick(() => {
        if (this.tousTypesEtab) {
          this.selectedTypesEtab = [];
        } else {
          this.selectedTypesEtab = this.typesEtab.slice();
        }
      });
    },
    send() {
      this.buttonLoading = true;
      console.log("dans le send");

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

          HTTP.post(
            process.env.VUE_APP_ROOT_API + "ln/editeur/creationEditeur",
            {
              nomEditeur: this.nomEditeur,
              identifiantEditeur: this.identifiantEditeur,
              groupesEtabRelies: this.selectedTypesEtab,
              adresseEditeur: this.adresseEditeur,
              listeContactCommercialEditeurDTO: this
                .listeContactsCommerciauxEditeurDTO,
              listeContactTechniqueEditeurDTO: this
                .listeContactsTechniquesEditeurDTO
            }
          )
            .then(response => {
              this.alert = true;
              this.buttonLoading = false;
              this.setNotification(response.data);
              console.log("notification = " + this.$store.state.notification);
              this.$router.push({ path: "/listeEditeurs" });
            })
            .catch(err => {
              this.buttonLoading = false;
              this.error = err.response.data;
              this.alert = true;
            });
        }
      }
    },

    clear() {
      (this.$refs.formNouvelEditeur as HTMLFormElement).reset();
    }
  }
});
</script>

<style scoped></style>
