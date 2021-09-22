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
  siren: string;
  id: number;
  role: string;
}

export interface JsonCreateAccount {
  adresseContact: string;
  siren: string;
  prenomContact: string;
  boitePostaleContact: string;
  nom: string;
  telephoneContact: string;
  cedexContact: string;
  motDePasse: string;
  codePostalContact: string;
  typeEtablissement: string;
  recaptcha: unknown;
  mailContact: string;
  nomContact: string;
  villeContact: string;
}
