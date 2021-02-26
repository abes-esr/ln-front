<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col lg="5" md="8" xs="10">
  <div>
    <v-card witdh="100%">
      <v-form ref="form" lazy-validation>
        <v-card-title>Création d'un compte institutionnel</v-card-title>
        <v-card-text>
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
            <v-col cols="10">
              <v-text-field
                  outlined
                  label="SIREN"
                  placeholder="SIREN"
                  v-model="sirenEtab"
                  :rules="sirenEtabRules"
                  required
                  @keyup.enter="validate()"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="1" />
            <v-col cols="10">
              <v-select
                  outlined
                  v-model="typeEtab"
                  :items="choixetabtype"
                  label="Type de l'établissement"
                  :rules="typeEtabRules"
                  required
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="1" />
            <v-col cols="10">
              <v-text-field
                  outlined
                  label="Adresse postale"
                  placeholder="Adresse postale"
                  v-model="adresseEtab"
                  :rules="adresseEtabRules"
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
                  label="Code postal"
                  placeholder="Code postal"
                  v-model="codepostalEtab"
                  :rules="codepostalEtabRules"
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
                  v-model="villeEtab"
                  :rules="villeEtabRules"
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
                  v-model="cedexEtab"
                  :rules="cedexEtabRules"
                  required
                  @keyup.enter="validate()"
              ></v-text-field>
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
                  :rules="confirmEmailContactRules"
                  required
                  @keyup.enter="validate()"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col cols="9"></v-col>
            <v-col cols="2">
              <v-btn
                color="success"
                :loading="buttonLoading"
                x-large
                @click="validate()"
                >Envoyer</v-btn
              >
              <v-btn @click="clear">
                Effacer
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";

export default Vue.extend({
  name: "FormCreationCompte",
  data() {
    return {
      nomEtab: "" as string,
      nomEtabRules: [
        (v: any) => !!v || "Le nom de l'établissement est obligatoire",

      ],
      sirenEtab: "" as string,
      sirenEtabRules: [
        (v: any) => !!v || "SIREN obligatoire",
        (v: any) => /^\d{9}$/.test(v) || "Le SIREN doit contenir 9 chiffres"
      ],

      choixetabtype:  [  "EPIC/EPST",
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
                          "Autre"],
      typeEtabRules: [
        (v: any) => !!v || "Le type de l'établissement est obligatoire",
      ],
    };
  },
  methods: {
    ...mapActions({
      creationCompteAction: "creationCompte"
    }),
    validate(): void {
      this.alert = false;
      this.error = "";
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate())
        this.creationCompte();
    },
    creationCompte(): void {
      this.buttonLoading = true;
      this.creationCompteAction({
        nomEtab:this.nomEtab,
        sirenEtab: this.sirenEtab,
        typeEtab:this.typeEtab,
        adresseEtab:this.adresseEtab,
        codePostalEtab:this.codePostalEtab,
        villeEtab:this.villeEtab,
        cedexEtab:this.cedexEtab,
        password: this.password,

      })
        .then(() => {
          this.$router.push({ name: "home" });
        })
        .catch(err => {
          this.buttonLoading = false;
          this.error = err;
          this.alert = true;
        });
    }
  }
});
</script>

<style scoped></style>
