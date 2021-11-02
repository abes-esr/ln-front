import { AxiosResponse } from "axios";
import { LicencesNationalesApiService } from "@/core/service/licencesnationales/LicencesNationalesApiService";

export class EtablissementService extends LicencesNationalesApiService {
  /**
   * Appel API pour créer un nouveau compte
   * @param data Json de création d'un nouveau compte à l'API LicencesNationales
   */
  creationCompte(data: JsonCreateAccount): Promise<AxiosResponse> {
    return this.client.put("/etablissements", data);
  }

  fusion(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/etablissements/fusion", data, token);
  }

  scission(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/etablissements/scission", data, token);
  }

  listeEtab(token: string): Promise<AxiosResponse> {
    return this.client.get("/etablissements/", token);
  }

  listeType(): Promise<AxiosResponse> {
    return this.client.get("/etablissements/getType");
  }

  getInfosEtab(token: string, siren?: string): Promise<AxiosResponse> {
    return this.client.get("/etablissements/" + siren, token);
  }

  updateProfile(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/etablissements/", data, token);
  }

  deleteEtab(token: string, siren: string, data: any): Promise<AxiosResponse> {
    return this.client.delete("/etablissements/" + siren, data, token);
  }
}

export const etablissementService = new EtablissementService();

/* JSON  entrée / sortie */

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
