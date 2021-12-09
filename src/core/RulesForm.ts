// eslint-disable-next-line @typescript-eslint/class-name-casing
export class rulesForm {
  nomEtabRules = [
    (v: string) => !!v || "Le nom de l'établissement est obligatoire"
  ];

  siren = [
    (v: string) => !!v || "SIREN obligatoire",
    (v: string) =>
      /^\d{9}$/.test(v.trim()) || "Le SIREN doit contenir 9 chiffres"
  ];

  typeEtabRules = [
    (v: string) => !!v || "Le type de l'établissement est obligatoire"
  ];

  nom = [(v: string) => !!v || "Le nom est obligatoire"];

  prenom = [(v: string) => !!v || "Le prénom est obligatoire"];

  adresse = [(v: string) => !!v || "L'adresse postale est obligatoire"];

  codePostal = [
    (v: string) => !!v || "Le code postal est obligatoire",
    (v: string) =>
      /^\d{5}$/.test(v.trim()) ||
      "Le code postal doit contenir 5 chiffres uniquement"
  ];

  ville = [(v: string) => !!v || "La ville de l'établissement est obligatoire"];

  tel = [
    (v: string) => !!v || "Le téléphone du contact est obligatoire",
    (v: string) =>
      /^\d{10}$/.test(v.trim()) || "Veuillez entrer 10 chiffres sans espace"
  ];

  email = [
    (v: string) => !!v || "Champ obligatoire",
    (v: string) => /.+@.+\..+/.test(v.trim()) || "Adresse mail invalide"
  ];

  motDePasse = [
    (v: string) => !!v || "Le mot de passe est obligatoire",
    (v: string) =>
      (!!v && v.length >= 8) ||
      "Le mot de passe doit contenir au moins 8 caractères",
    (v: string) =>
      /^(.*[a-z]+.*)$/.test(v) ||
      "Le mot de passe doit contenir au moins une minuscule",
    (v: string) =>
      /^(.*[A-Z]+.*)$/.test(v) ||
      "Le mot de passe doit contenir au moins une majuscule",
    (v: string) =>
      /^(.*\d+.*)$/.test(v) ||
      "Le mot de passe doit contenir au moins un chiffre",
    (v: string) =>
      /^(.*[@$!%*?&]+.*)$/.test(v) ||
      "Le mot de passe doit contenir au moins un caractère spécial parmis @ $ ! % * ? &"
  ];

  checkboxRules = [(v: boolean) => v || "Veuillez accepter avant de valider"];
}
export const rulesForms = new rulesForm();
