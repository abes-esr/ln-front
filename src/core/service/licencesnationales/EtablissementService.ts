import { AxiosResponse } from "axios";
import { LicencesNationalesApiService } from "@/core/service/licencesnationales/LicencesNationalesApiService";
import Etablissement from "@/core/Etablissement";

export class EtablissementService extends LicencesNationalesApiService {
  /**
   * Appel API pour créer un nouveau compte
   *
   */
  creerEtablissement(
    etablissement: Etablissement,
    tokenrecaptcha: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const jsonContact: JsonCreateContact = {
        nom: etablissement.contact.nom,
        prenom: etablissement.contact.prenom,
        adresse: etablissement.contact.adresse,
        boitePostale: etablissement.contact.boitePostale,
        codePostal: etablissement.contact.codePostal,
        ville: etablissement.contact.ville,
        cedex: etablissement.contact.cedex,
        telephone: etablissement.contact.telephone,
        mail: etablissement.contact.mail,
        motDePasse: etablissement.contact.motDePasse
      };
      const json: JsonCreateAccount = {
        nom: etablissement.nom,
        siren: etablissement.siren,
        typeEtablissement: etablissement.typeEtablissement,
        recaptcha: tokenrecaptcha,
        contact: jsonContact
      };
      return this.client
        .put("/etablissements", json)
        .then(result => {
          resolve(true);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
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

  listeType(): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      return this.client
        .get("/etablissements/getType")
        .then(result => {
          const response: Array<JsonTypeEtablissement> = result.data;
          const typesEtablissement: Array<string> = [];
          response.forEach(element => typesEtablissement.push(element.libelle));
          resolve(typesEtablissement);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  getEtablissement(siren: string, token: string): Promise<Etablissement> {
    return new Promise((resolve, reject) => {
      return this.client
        .get("/etablissements/" + siren, token)
        .then(result => {
          const response: JsonEtablissementResponse = result.data;
          const etablissement: Etablissement = new Etablissement();
          etablissement.id = response.id;
          etablissement.nom = response.nom;
          etablissement.siren = response.siren;
          etablissement.dateCreation = new Date(response.dateCreation);
          etablissement.typeEtablissement = response.typeEtablissement;
          etablissement.statut = response.statut;
          etablissement.idAbes = response.idAbes;
          etablissement.contact = response.contact;
          resolve(etablissement);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  updateEtablissement(
    etablissement: Etablissement,
    token: string
  ): Promise<boolean> {
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
        role: etablissement.contact.role //role du contact de l'etablissement à modifier
      };
      const json: JsonUpdateProfile = {
        siren: etablissement.siren,
        contact: jsonContact,
        role: "etab" //role de l'utilisateur qui modifie todo isAdmin ? userRole ? changer la signature ?
      };

      return this.client
        .post("/etablissements/" + etablissement.siren, json, token)
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
  role: string;
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

export interface JsonTypeEtablissement {
  libelle: string;
}
