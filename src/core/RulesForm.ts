// eslint-disable-next-line @typescript-eslint/class-name-casing
export class rulesForm {
  nomEtabRules = [
    (v: string) => !!v || "Le nom de l'établissement est obligatoire",
    (v: string) => v.length >= 5 || "Minimum 5 caractères",
    (v: string) =>
      /^([0-9A-Za-z'àâéèêôùûçÀÂÉÈÔÙÛÇ,\s-]){5,80}$/.test(v) ||
      "Le nom d'établissement fourni n'est pas valide"
  ];

  sirenEtabRules = [
    (v: string) => !!v || "SIREN obligatoire",
    (v: string) => /^\d{9}$/.test(v) || "Le SIREN doit contenir 9 chiffres"
  ];

  typeEtabRules = [
    (v: string) => !!v || "Le type de l'établissement est obligatoire"
  ];

  nomContactRules = [
    (v: string) => !!v || "Le nom du contact est obligatoire",
    (v: string) =>
      /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/.test(
        v
      ) || "Le nom fourni n'est pas valide"
  ];

  prenomContactRules = [
    (v: string) => !!v || "Le prénom du contact est obligatoire",
    (v: string) =>
      /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[A-Za-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/.test(
        v
      ) || "Le prénom fourni n'est pas valide"
  ];

  adresseContactRules = [
    (v: string) =>
      !!v || "L'adresse postale de l'établissement est obligatoire",
    (v: string) => v.length >= 5 || "Minimum 5 caractères",
    (v: string) =>
      /^([0-9A-Za-z'àâéèêôùûçÀÂÉÈÔÙÛÇ,\s-]{5,80})$/.test(v) ||
      "L'adresse postale fournie n'est pas valide"
  ];

  codePostalContactRules = [
    (v: string) => !!v || "Le code postal de l'établissement est obligatoire",
    (v: string) => /^\d{5}$/.test(v) || "Le code postal fourni n'est pas valide"
  ];

  villeContactRules = [
    (v: string) => !!v || "La ville de l'établissement est obligatoire",
    (v: string) =>
      /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/.test(v) ||
      "La ville fournie n'est pas valide"
  ];

  telContactRules = [
    (v: string) => !!v || "Le téléphone du contact est obligatoire",
    (v: string) =>
      /^\d{10}$/.test(v) || "Veuillez entrer 10 chiffres sans espace"
  ];

  emailContactRules = [
    (v: string) => !!v || "Champ obligatoire",
    (v: string) => /.+@.+\..+/.test(v) || "Adresse mail invalide"
  ];
  // /* une autre regle pour email. lequel choisir */
  // mailRules = [
  //     (v: string) => !!v || "Adresse mail obligatoire",
  //     (v: string) =>
  //         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
  //             v
  //         ) || "Adresse mail invalide"
  // ];

  confirmEmailContactRules = [
    (v: string) => !!v || "Vous devez confirmer l'adresse mail du contact"
  ];

  passwordRules = [
    (v: string) => !!v || "Le mot de passe du contact est obligatoire",
    (v: string) => v.length >= 5 || "Minimum 8 caractères",
    (v: string) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        v
      ) ||
      "Le mot de passe doit contenir des lettres dont au moins une majuscule, au moins un chiffre et un caractère spécial, et faire 8 caractères minimum"
  ];

  passwordObligatoryRules = [(v: string) => !!v || "Mot de passe obligatoire"];

  confirmPassContactRules = [
    (v: string) => !!v || "Vous devez confirmer le mot de passe du contact"
  ];

  checkboxRules = [(v: boolean) => v || "Veuillez accepter avant de valider"];

  loginRules = [
    (v: string) => !!v || "SIREN obligatoire",
    (v: string) => /^\d{9}$/.test(v) || "Le SIREN doit contenir 9 chiffres"
  ];
}
export const rulesForms = new rulesForm();
