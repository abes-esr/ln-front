import { AxiosResponse } from "axios";
import { LicencesNationalesApiService } from "@/core/service/licencesnationales/LicencesNationalesApiService";
import Etablissement from "@/core/Etablissement";
import ContactEtablissement from "@/core/ContactEtablissement";
import Ip from "@/core/Ip";
import {Logger} from "@/utils/Logger";

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

  getEtablissement(siren: string, token: string): Promise<Etablissement> {
    return new Promise((resolve, reject) => {
      return this.client
        .get("/etablissements/" + siren, token)
        .then(result => {
          const response: JsonEtablissementResponse = result.data;
          const etablissement: Etablissement = new Etablissement();
          etablissement.id = response.id;
          console.log(response);
          etablissement.nom = response.nom;
          etablissement.siren = response.siren;
          etablissement.dateCreation = new Date(response.dateCreation);
          etablissement.typeEtablissement = response.typeEtablissement;
          etablissement.statut = response.statut;
          etablissement.idAbes = response.idAbes;
          etablissement.contact = response.contact; //todo: à tester
          resolve(etablissement);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  updateProfile(etablissement: Etablissement, token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const jsonContact: JsonUpdateContact = {
        nom: etablissement.contact.nom,
        prenom: etablissement.contact.prenom,
        adresse: etablissement.contact.adresse,
        boitePostale: etablissement.contact.boitePostale,
        codePostal: etablissement.contact.codePostal,
        ville: etablissement.contact.ville,
        cedex: etablissement.contact.cedex,
        telephone: etablissement.contact.telephone,
        mail: etablissement.contact.mail,
        role: etablissement.contact.role
      };
      const json: JsonUpdateProfile = {
        siren: etablissement.siren,
        contact: jsonContact,
      };

      return this.client
        .post("/etablissements/"+etablissement.siren, json, token)
        .then(result => {
          resolve(true);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
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
  role: string;
}

export interface JsonUpdateProfile {
  siren: string;
  contact: JsonUpdateContact;
}

interface JsonContactEtablissement {
  id: number;
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
  role: string;
}

interface JsonIp {
  id: number;
  ip: string;
  dateCreation: Date;
  dateModification: Date;
  commentaires: string;
  statut: string;
}

interface JsonEtablissementResponse {
  id: number;
  nom: string;
  siren: string;
  dateCreation: string;
  typeEtablissement: string;
  statut: string;
  idAbes: string;
  contact: JsonContactEtablissement;
  ips: Array<JsonIp>;
}

export interface JsonCreateAccount {
  siren: string;
  nom: string;
  typeEtablissement: string;
  recaptcha: unknown;
  contact: JsonCreateContact;
}
