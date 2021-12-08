import { LicencesNationalesApiService } from "@/core/service/licencesnationales/LicencesNationalesApiService";
import Etablissement from "@/core/Etablissement";
import ContactEtablissement from "@/core/ContactEtablissement";
import {AxiosResponse} from "axios";

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
      const jsonContact: JsonCreateContactEtablissement = {
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
      const json: JsonCreateEtablissement = {
        nom: etablissement.nom,
        siren: etablissement.siren,
        typeEtablissement: etablissement.typeEtablissement.toString(),
        contact: jsonContact,
        recaptcha: tokenrecaptcha
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

  listeType(): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      return this.client
        .get("/etablissements/getType")
        .then(result => {
          const response: Array<JsonTypeEtablissementResponse> = result.data;
          const typesEtablissement: Array<string> = [];
          response.forEach(element => typesEtablissement.push(element.libelle));
          resolve(typesEtablissement);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  getEtablissements(token: string): Promise<Array<Etablissement>> {
    return new Promise((resolve, reject) => {
      return this.client
        .get("/etablissements/", token)
        .then(result => {
          const response: Array<JsonSimpleEtablissementResponse> = result.data;
          const etabs: Array<Etablissement> = [];
          response.forEach(element => {
            const etablissement: Etablissement = new Etablissement();
            etablissement.id = element.id;
            etablissement.nom = element.nom;
            etablissement.siren = element.siren;
            etablissement.dateCreation = new Date(element.dateCreation);
            etablissement.typeEtablissement = element.typeEtablissement;
            etablissement.statut = element.statut;
            etablissement.idAbes = element.idAbes;
            etabs.push(etablissement);
          });
          resolve(etabs);
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
          //etablissement.dateCreation = new Date(response.dateCreation);
          etablissement.dateCreation = new Date();
          etablissement.typeEtablissement = response.typeEtablissement;
          etablissement.statut = response.statut;
          etablissement.idAbes = response.idAbes;

          const contact: ContactEtablissement = new ContactEtablissement();
          contact.id = response.contact.id;
          contact.nom = response.contact.nom;
          contact.prenom = response.contact.prenom;
          contact.adresse = response.contact.adresse;
          contact.boitePostale = response.contact.boitePostale;
          contact.codePostal = response.contact.codePostal;
          contact.ville = response.contact.ville;
          contact.cedex = response.contact.cedex;
          contact.telephone = response.contact.telephone;
          contact.mail = response.contact.mail;

          etablissement.contact = contact;
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
      const jsonContact: JsonUpdateContactEtablissement = {
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
      const json: JsonUpdateEtablissement = {
        nom: etablissement.nom,
        siren: etablissement.siren,
        typeEtablissement: etablissement.typeEtablissement,
        contact: jsonContact
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

  deleteEtab(token: string, siren: string, commentaire:string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.client
        .delete("/etablissements/" + siren, null, token)
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }
}

export const etablissementService = new EtablissementService();

/* JSON  entrée / sortie */

interface JsonEtablissementResponse {
  id: number;
  nom: string;
  siren: string;
  dateCreation: string;
  typeEtablissement: string;
  statut: string;
  idAbes: string;
  contact: JsonContactEtablissementResponse;
}

interface JsonSimpleEtablissementResponse {
  id: number;
  nom: string;
  siren: string;
  dateCreation: string;
  typeEtablissement: string;
  statut: string;
  idAbes: string;
}

interface JsonContactEtablissementResponse {
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
}

interface JsonCreateEtablissement {
  nom: string;
  siren: string;
  typeEtablissement: string;
  contact: JsonCreateContactEtablissement;
  recaptcha: string;
}

export interface JsonCreateContactEtablissement {
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

export interface JsonUpdateContactEtablissement {
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

export interface JsonUpdateEtablissement {
  nom: string;
  siren: string;
  typeEtablissement: string;
  contact: JsonUpdateContactEtablissement;
}

export interface JsonTypeEtablissementResponse {
  libelle: string;
}
