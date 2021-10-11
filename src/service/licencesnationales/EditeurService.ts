import {AxiosResponse} from "axios";
import {LicencesNationalesApiService} from "@/service/licencesnationales/LicencesNationalesApiService";
import Editeur from "@/components/Editeur";
import {ContactType} from "@/components/CommonDefinition";
import ContactEditeur from "@/components/ContactEditeur";

export class EditeurService extends LicencesNationalesApiService {
  createEditeur(
    editeur: Editeur,
    token: string
  ): Promise<JsonListeEditeurResponse> {
    return new Promise((resolve, reject) => {
      const contactsCommerciaux: Array<JsonCreationContactEditeurRequest> = [];
      const contactsTechniques: Array<JsonCreationContactEditeurRequest> = [];

      for (let index = 0; index < editeur.contacts.length; index++) {
        if (editeur.contacts[index].type == ContactType.COMMERCIAL) {
          contactsCommerciaux.push(editeur.contacts[index]);
        } else if (editeur.contacts[index].type == ContactType.TECHNIQUE) {
          contactsTechniques.push(editeur.contacts[index]);
        }
      }
      const json = {
        nom: editeur.nom,
        identifiantBis: editeur.identifiantBis,
        groupesEtabRelies: editeur.groupesEtabRelies,
        adresse: editeur.adresse,
        contactsCommerciaux: contactsCommerciaux,
        contactsTechniques: contactsTechniques
      };
      return this.client
        .put("/editeurs", json, token)
        .then(result => {
          const response: JsonListeEditeurResponse = result.data;
          resolve(response);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  // Modification
  updateEditeur(editeur: Editeur, token: string): Promise<AxiosResponse> {
    const contactsCommerciaux: Array<JsonCreationContactEditeurRequest> = [];
    const contactsTechniques: Array<JsonCreationContactEditeurRequest> = [];

    for (let index = 0; index < editeur.contacts.length; index++) {
      if (editeur.contacts[index].type == ContactType.COMMERCIAL) {
        contactsCommerciaux.push(editeur.contacts[index]);
      } else if (editeur.contacts[index].type == ContactType.TECHNIQUE) {
        contactsTechniques.push(editeur.contacts[index]);
      }
    }
    const json = {
      nom: editeur.nom,
      identifiantBis: editeur.identifiantBis,
      groupesEtabRelies: editeur.groupesEtabRelies,
      adresse: editeur.adresse,
      contactsCommerciaux: contactsCommerciaux,
      contactsTechniques: contactsTechniques
    };

    return this.client.post("/editeurs/" + editeur.id, json, token);
  }

  //Liste
  getEditeurs(token: string): Promise<Array<Editeur>> {
    return new Promise((resolve, reject) => {
      return this.client
        .get("/editeurs", token)
        .then(result => {
          const response: Array<JsonSimpleEditeurResponse> = result.data;
          const editeurs: Array<Editeur> = [];
          response.forEach(element => {
            const editeur: Editeur = new Editeur();
            editeur.id = element.id;
            editeur.nom = element.nom;
            editeur.dateCreation = new Date(element.dateCreation);
            editeurs.push(editeur);
          });
          resolve(editeurs);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  getEditeur(id: number, token: string): Promise<Editeur> {
    return new Promise((resolve, reject) => {
      return this.client
        .get("/editeurs/" + id, token)
        .then(result => {
          const response: JsonEditeurResponse = result.data;
          const editeur: Editeur = new Editeur();
          editeur.id = response.id;
          editeur.nom = response.nom;
          editeur.dateCreation = new Date(response.dateCreation);
          editeur.groupesEtabRelies = response.groupesEtabRelies;
          editeur.identifiantBis = response.identifiantBis;
          editeur.adresse = response.adresse;

          // On vide les contacts et on les regénère à partir du JSON
          editeur.contacts = [];
          response.contactsCommerciaux.forEach(element => {
            const contact: ContactEditeur = new ContactEditeur();
            contact.id = element.id;
            contact.nom = element.nom;
            contact.type = ContactType.COMMERCIAL;
            contact.prenom = element.prenom;
            contact.mail = element.mail;
            editeur.addContact(contact);
          });

          response.contactsTechniques.forEach(element => {
            const contact: ContactEditeur = new ContactEditeur();
            contact.id = element.id;
            contact.nom = element.nom;
            contact.type = ContactType.TECHNIQUE;
            contact.prenom = element.prenom;
            contact.mail = element.mail;
            editeur.addContact(contact);
          });
          resolve(editeur);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  deleteEditeur(id: number, token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.client
        .delete("/editeurs/" + id, token)
        .then(result => {
          const response: JsonSuppresionEditeurResponse = result.data;
          resolve(true);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }
}

export const editeurService = new EditeurService();

/* JSON entrée / sortie */

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
