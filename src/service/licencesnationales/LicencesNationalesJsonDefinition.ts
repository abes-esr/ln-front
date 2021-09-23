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

export interface JsonMotDePasseOublieRequest {
  siren: string;
  email: string;
  recaptcha: string;
}

export interface JsonMotDePasseOublieResponse {
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
