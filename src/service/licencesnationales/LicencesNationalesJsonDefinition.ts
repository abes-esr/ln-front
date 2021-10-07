/**
 * Définitions des formats Json utilisés par l'API Licences Nationales
 */

export interface JsonLoginRequest {
  login: string;
  password: string;
}

export interface JsonLoginResponse {
  accessToken: string;
  tokenType: string;
  nameEtab: string;
  isAdmin: boolean;
  userSiren: string;
  id: number;
  role: string;
}

export interface JsonMotDePasseOublieSirenRequest {
  siren: string;
  recaptcha: string;
}

export interface JsonMotDePasseOublieEmailRequest {
  email: string;
  recaptcha: string;
}

export interface JsonMotDePasseOublieResponse {
  message: string;
}

export interface JsonReinitialiserMotDePasseRequest {
  nouveauMotDePasse: string;
  token: string;
  recaptcha: string;
}

export interface JsonReinitialiserMotDePasseResponse {
  message: string;
}

export interface JsonVerifierValiditeTokenRequest {
  token: string;
}

export interface JsonVerifierValiditeTokenResponse {
  estValid: boolean;
}

export interface JsonModifierMotDePasseRequest {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}

export interface JsonModifierMotDePasseResponse {
  message: string;
}

export interface JsonCreateContact {
  nom: string;
  prenom: string;
  adresse: string;
  boitePostale: string;
  codePostal: string;
  ville: string;
  cedex: string;
  telephone: string;
  mail: string;
  motDePasse: string;
}

export interface JsonUpdateContact {
  nom: string;
  prenom: string;
  adresse: string;
  boitePostale: string;
  codePostal: string;
  ville: string;
  cedex: string;
  telephone: string;
  mail: string;
}

export interface JsonUpdateProfile {
  siren: string;
  contact: JsonUpdateContact;
  role: string;
}

export interface JsonCreateAccount {
  siren: string;
  nom: string;
  typeEtablissement: string;
  recaptcha: unknown;
  contact: JsonCreateContact;
}

//******* Fonctionnalité EditeurItem *********
// Création
export interface JsonCreationContactEditeurRequest {
  nom: string;
  prenom: string;
  mail: string;
}

export interface JsonCreationEditeurRequest {
  nom: string;
  identifiantBis: number;
  groupesEtabRelies: Array<string>;
  adresse: string;
  contactsCommerciaux: Array<JsonCreationContactEditeurRequest>;
  contactsTechniques: Array<JsonCreationContactEditeurRequest>;
}

//Liste
export interface JsonListeEditeurResponse {
  editeurs: Array<JsonSimpleEditeurResponse>;
}

export interface JsonSimpleEditeurResponse {
  id: number;
  nom: string;
  dateCreation: string;
}

export interface JsonContactEditeurResponse {
  id: number;
  nom: string;
  prenom: string;
  mail: string;
}

export interface JsonEditeurResponse {
  id: number;
  nom: string;
  identifiantBis: number;
  dateCreation: string;
  groupesEtabRelies: Array<string>;
  adresse: string;
  contactsCommerciaux: Array<JsonContactEditeurResponse>;
  contactsTechniques: Array<JsonContactEditeurResponse>;
}

//Modification
export interface JsonModificationContactEditeurRequest {
  id: number;
  nom: string;
  prenom: string;
  mail: string;
}

export interface JsonModificationEditeurRequest {
  id: number;
  nom: string;
  identifiantBis: number;
  groupesEtabRelies: Array<string>;
  adresse: string;
  contactsCommerciaux: Array<JsonModificationContactEditeurRequest>;
  contactsTechniques: Array<JsonModificationContactEditeurRequest>;
}

export interface JsonSuppresionEditeurResponse {
  message: string;
}
