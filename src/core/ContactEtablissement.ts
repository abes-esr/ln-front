export class ContactEtablissement {
  id: number = -999;
  nom: string = "";
  prenom: string = "";
  adresse: string = "";
  boitePostale: string = "";
  codePostal: string = "";
  ville: string = "";
  cedex: string = "";
  telephone: string = "";
  mail: string = "";
  motDePasse: string = "";
  role: string = "";

  reset():void {
    this.nom = "";
    this.prenom = "";
    this.adresse = "";
    this.boitePostale = "";
    this.codePostal = "";
    this.ville = "";
    this.cedex = "";
    this.telephone = "";
    this.mail = "";
    this.motDePasse = "";
  }
}
export default ContactEtablissement;
