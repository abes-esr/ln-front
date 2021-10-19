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
                      maxlength="80"
                      v-model="etablissement.nom"
                      :rules="rulesForms.nomEtabRules"
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
                      maxlength="9"
                      v-model="etablissement.siren"
                      :rules="rulesForms.sirenEtabRules"
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
                      v-model="etablissement.typeEtablissement"
                      :items="typesEtab"
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
                    v-model="etablissement.contact.mail"
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
                    label="Nom"
                    placeholder="Nom"
                    v-model="etablissement.contact.nom"
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
                    v-model="etablissement.contact.prenom"
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
                    label="Téléphone"
                    placeholder="Téléphone"
                    maxlength="10"
                    v-model="etablissement.contact.telephone"
                    :rules="rulesForms.telContactRules"
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
                    maxlength="80"
                    v-model="etablissement.contact.adresse"
                    :rules="rulesForms.adresseContactRules"
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
                    v-model="etablissement.contact.boitePostale"
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
                    maxlength="5"
                    v-model="etablissement.contact.codePostal"
                    :rules="rulesForms.codePostalContactRules"
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
                    v-model="etablissement.contact.ville"
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
                    label="CEDEX"
                    placeholder="CEDEX"
                    v-model="etablissement.contact.cedex"
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
                >Envoyer
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
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import { rulesForms } from "@/core/RulesForm";
import Etablissement from "@/core/Etablissement";

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
  etablissement: Etablissement;
  rulesForms: any = rulesForms;

  typesEtab: Array<string> = [];
  typeEtab: string = "";
  jsonResponse: any = {};
  alert: boolean = false;
  error: string = "";
  buttonLoading: boolean = false;

  constructor() {
    super();
    this.etablissement = this.getCurrentEtablissement;
  }

  update() {
    this.etablissement = this.getCurrentEtablissement;
  }

  get getCurrentEtablissement(): Etablissement {
    return this.$store.getters.getCurrentEtablissement
  }

  get userSiren(): string {
    return this.$store.getters.userSiren();
  }

  get isAdmin(): boolean {
    return this.$store.getters.isAdmin();
  }

  //Le param "sirenParam" est optionel, utilisé dans le cas Admin
  sirenLocal = this.sirenParam ? this.sirenParam : this.userSiren;

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
    etablissementService
      .getEtablissement(this.sirenLocal, this.$store.getters.getToken())
      .then(result => {
        this.etablissement = result;
      })
      .catch(err => {
        this.alert = true;
        this.error = err;
      });
  }

  fetchListeType(): void {
    etablissementService
      .listeType()
      .then(result => {
        result.data.forEach(element => {
          this.typesEtab.push(element.libelle);
        });
      })
      .catch(err => {
        this.alert = true;
        this.error = err;
      });
  }

  submitProfil(): void {
    this.etablissement.siren = this.sirenLocal;
    etablissementService
      .updateEtablissement(this.etablissement, this.$store.getters.getToken())
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
}
</script>
