/**
 * Définitions des formats Json utilisés par l'API Data Gouv
 */

export interface JsonCheckSirenResponse {
   unite_legale: JsonCheckSirenInfo;
}

export interface JsonCheckSirenInfo {
    denomination: string;
}

