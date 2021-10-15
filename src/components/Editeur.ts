import ContactEditeur from "@/components/ContactEditeur";
import { ValueError } from "@/exception/ValueError";

export class Editeur {
  id: number = -999;
  nom: string = "";
  identifiantBis: number = -999;
  dateCreation: Date = new Date();
  groupesEtabRelies: Array<string> = [];
  adresse: string = "";
  contacts: Array<ContactEditeur> = [];

  addContact(item: ContactEditeur): void {
    this.contacts.push(item);
  }

  findContactById(id: number): ContactEditeur {
    const index = this.contacts.findIndex(x => x.id === id);
    if (index == -1) {
      throw new ValueError("Contact width id " + id + " not found");
    } else {
      return this.contacts[index];
    }
  }

  removeContact(item: ContactEditeur): void {
    const index = this.contacts.findIndex(x => x.id === item.id);
    if (index == -1) {
      throw new ValueError("Contact " + item + " not found");
    }
    // On supprime l'indice
    this.contacts.splice(index, 1);
  }
}
export default Editeur;
