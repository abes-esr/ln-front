<template>
  <v-card witdh="100%" outlined>
    <v-form ref="form" :outline="true" lazy-validation>
      <v-card-text>
        <v-radio-group v-model="contact.type">
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
            :rules="nomContactRules"
            required
            @keyup.enter="validate()"
        ></v-text-field>
        <v-text-field
            outlined
            label="Prénom"
            placeholder="Prénom"
            v-model="contact.prenom"
            :rules="prenomContactRules"
            required
            @keyup.enter="validate()"
        ></v-text-field>
        <v-text-field
            outlined
            label="Adresse e-mail"
            placeholder="Adresse e-mail"
            v-model="contact.mail"
            :rules="emailContactRules"
            required
            @keyup.enter="validate()"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn depressed
               class="mx-0"
               @click="remove()"
        >
          <v-icon color="black"
          >
            mdi-delete
          </v-icon>
        </v-btn>

      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {ContactType} from "@/core/CommonDefinition";
import ContactEditeur from "@/core/ContactEditeur";

@Component
export default class Contact extends Vue {
  @Prop() contact!: ContactEditeur;
  nomContactRules = [
    (v: string) => !!v || "Le nom du contact est obligatoire",
    (v: string) =>
        /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/.test(
            v
        ) || "Le nom fourni n'est pas valide"
  ];
  prenomContactRules = [
    (v: any) => !!v || "Le prénom du contact est obligatoire",
    (v: any) =>
        /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/.test(
            v
        ) || "Le prénom fourni n'est pas valide"
  ];
  emailContactRules = [
    (v: any) => !!v || "L'adresse mail du contact est obligatoire",
    (v: any) =>
        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v) ||
        "L'adresse mail fournie n'est pas valide"
  ];

  typeContactCandidates: Array<ContactType> = [
    ContactType.TECHNIQUE,
    ContactType.COMMERCIAL
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
    //(this.$refs.form as HTMLFormElement).reset();
  }
}
</script>
