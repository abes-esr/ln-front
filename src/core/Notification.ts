export class Notification {
    constructor(s = '', date = new Date(), typeNotif = "Non spécifié", nomEtablissement = "Défaut") {
        this.siren = s;
        this.dateEvent = date;
        this.typeNotif = typeNotif;
        this.nomEtab = nomEtablissement;
    }

    siren: string = "";
    dateEvent: Date = new Date();
    typeNotif: string = "";
    nomEtab: string = "";
}
export default Notification;
