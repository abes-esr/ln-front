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

  ipv4SegmentsRules = [
    (v: string) => !!v || "Le segment d'IP est obligatoire",
    (v: string) =>
      /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]))$/.test(v) ||
      "Le segment d'IP fourni n'est pas valide" // cf https://stackoverflow.com/a/47959401
  ];
  ipv6SegmentsRules = [
    (v: string) => !!v || "Le segment d'IP est obligatoire",
    (v: string) =>
      /^\s*([0-9a-fA-F]{1,4})$/.test(v) ||
      "Le segment d'IP fourni n'est pas valide"
  ];
  ipV4Rules = [
    (v: string) => !!v || "L'IP est obligatoire",
    (v: string) =>
      /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
        v
      ) || "L'IP fournie n'est pas valide" // cf https://stackoverflow.com/a/47959401
  ];
  ipV6Rules = [
    (v: string) => !!v || "L'IP est obligatoire",
    (v: string) =>
      /^\s*(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\s*$/.test(
        v
      ) || "L'IP fournie n'est pas valide" // cf https://stackoverflow.com/a/17871737
  ];
  plageIpV4Rules = [
    (v: string) => !!v || "La plage d'Ips est obligatoire",
    (v: string) =>
      /^(([(\d+)(x+)]){1,3})?\.(([(\d+)(x+)]){1,3})?\.(([(\d+)(x+)]){1,3})(-+([(\d+)(x)]{1,3}))\.(([(\d+)(x+)]){1,3})(-+([(\d+)(x)]{1,3}))$/.test(
        v
      ) || "La plage d'Ips fournie n'est pas valide" //regex qui filtre le texte parasite au cas où : cf https://stackoverflow.com/a/53442371
  ];
  plageIpV6Rules = [
    (v: string) => !!v || "La plage d'Ips est obligatoire",
    (v: string) =>
      /^\s*((([0-9a-fA-F]{1,4}:){6,6}[0-9a-fA-F]{1,4}-[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}-[0-9a-fA-F]{1,4}))s*$/.test(
        v
      ) || "La plage d'Ips fournie n'est pas valide" // cf https://stackoverflow.com/a/17871737
  ];
}
export const rulesForms = new rulesForm();
