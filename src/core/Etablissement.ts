import ContactEtablissement from "@/core/ContactEtablissement";
import Ip from "@/core/Ip";

export class Etablissement {
  id: number = -999;
  nom: string = "";
  siren: string = "";
  dateCreation: Date = new Date();
  typeEtablissement: string = "";
  statut: string = "";
  idAbes: string = "";
  contact: ContactEtablissement = new ContactEtablissement();
  ips: Array<Ip> = [];
}
export default Etablissement;
