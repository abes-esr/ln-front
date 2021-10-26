<template>
  <div>
    <v-card width="100%" outlined>
      <v-form ref="form" lazy-validation>
        <v-card-title>Modifier mes informations</v-card-title>
<!--        Todo : if creat or modif action = Action.truc-->
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
                    v-model="contact.mail"
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
                    v-model="contact.nom"
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
                    v-model="contact.prenom"
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
                    v-model="contact.telephone"
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
                    v-model="contact.adresse"
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
                    v-model="contact.boitePostale"
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
                    v-model="contact.codePostal"
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
                    v-model="contact.ville"
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
                    v-model="contact.cedex"
                    required
                    @keyup.enter="validate()"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { rulesForms } from "@/core/RulesForm";
import { Action } from "@/core/CommonDefinition";
import ContactEtablissement from "@/core/ContactEtablissement";

@Component
export default class Contact extends Vue {
  @Prop() contact!: ContactEtablissement;
  @Prop() action!: Action;
  Action: any = Action;
  rulesForms: any = rulesForms;

  constructor() {
    super();
  }

  validate(): boolean {
    return (this.$refs.form as Vue & { validate: () => boolean }).validate();
  }

  clear(): void {
    (this.$refs.form as HTMLFormElement).reset();
  }
}
</script>
