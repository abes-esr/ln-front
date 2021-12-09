<template>
  <v-card witdh="50%" outlined>
    <v-form ref="form" :outline="true" lazy-validation>
      <v-card-text class="mb-0 pb-0">
        <v-radio-group row v-model="contact.type" class="d-flex justify-center">
          <v-radio
            v-for="type in typeContactCandidates"
            :key="type"
            :label="`Contact ${typeContactCandidatesLabel[type]}`"
            :value="type"
          ></v-radio>
        </v-radio-group>

        <v-text-field
          outlined
          label="Nom"
          placeholder="Nom"
          v-model="contact.nom"
          :rules="rulesForms.nom"
          required
          @keyup.enter="validate()"
        ></v-text-field>
        <v-text-field
          outlined
          label="Prénom"
          placeholder="Prénom"
          v-model="contact.prenom"
          :rules="rulesForms.prenom"
          required
          @keyup.enter="validate()"
        ></v-text-field>
        <v-text-field
          outlined
          label="Adresse e-mail"
          placeholder="Adresse e-mail"
          v-model="contact.mail"
          :rules="rulesForms.email"
          required
          @keyup.enter="validate()"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="pa-0">
        <v-btn class="ma-0 pa-0 bouton-simple" icon x-large @click="remove()">
          <font-awesome-icon :icon="['fas', 'trash']" />
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ContactType } from "@/core/CommonDefinition";
import ContactEditeur from "@/core/ContactEditeur";
import { rulesForms } from "@/core/RulesForm";

@Component
export default class Contact extends Vue {
  @Prop() contact!: ContactEditeur;
  rulesForms: any = rulesForms;

  typeContactCandidates: Array<ContactType> = [
    ContactType.COMMERCIAL,
    ContactType.TECHNIQUE
  ];
  typeContactCandidatesLabel: Array<string> = [];

  constructor() {
    super();
    for (const type in this.typeContactCandidates) {
      this.typeContactCandidatesLabel.push(ContactType[type].toLowerCase());
    }
  }

  remove(): void {
    this.$emit("onChange"); // On notifie le composant parent
  }

  validate(): boolean {
    return (this.$refs.form as Vue & {
      validate: () => boolean;
    }).validate();
  }

  clear(): void {
    (this.$refs.form as HTMLFormElement).resetValidation();
  }
}
</script>
<style scoped lang="scss">
.v-card__text {
  border: 0;
}

.v-card__title {
  width: 100%;
}

.v-input--radio-group__input {
  justify-content: center;
}
</style>
