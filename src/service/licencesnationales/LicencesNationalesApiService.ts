import { AxiosResponse } from "axios";
import AxiosClient from "../../utils/AxiosClient";
import {
  JsonCreateAccount,
  JsonLoginRequest,
  JsonLoginResponse
} from "@/service/licencesnationales/LicencesNationalesJsonDefinition";
import { HttpRequestError } from "@/exception/HttpRequestError";
import { CredentialNotValidError } from "@/service/licencesnationales/CredentialNotValidError";

export class LicencesNationalesApiService {
  // Client HTTP
  client: AxiosClient = new AxiosClient(process.env.VUE_APP_ROOT_API);

  /**
   * Appel API pour se logger et obtenir un token d'identification
   * @param data Json de login à l'API LicencesNationales
   * @return Json de réponse à l'authentification
   * @throws CredentialNotValidError si l'authentification a échoué
   * @throws HttpRequestError pour tout autre erreur
   */
  login(data: JsonLoginRequest): Promise<JsonLoginResponse> {
    return new Promise((resolve, reject) => {
      return this.client
        .post("/authentification/connexion", data)
        .then(result => {
          const response: JsonLoginResponse = result.data;
          resolve(response);
        })
        .catch(err => {
          if (err.response.status == 404) {
            reject(new CredentialNotValidError(err.response.data.message));
          } else {
            reject(
              new HttpRequestError(
                err.response.status,
                err.response.data.message,
                err.response.data.debugMessage
              )
            );
          }
        });
    });
  }

  /**
   * Appel API pour créer un nouveau compte
   * @param data Json de création d'un nouveau compte à l'API LicencesNationales
   */
  creationCompte(data: JsonCreateAccount): Promise<AxiosResponse> {
    return this.client.put("/etablissements", data);
  }

  changePassword(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post(
      "/reinitialisationMotDePasse/updatePassword",
      token,
      data
    );
  }

  ajouterAcces(url: string, token: string, data: any): Promise<AxiosResponse> {
    return this.client.post(url, token, data);
  }

  fusion(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/etablissement/fusion", token, data);
  }

  scission(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/etablissement/division", token, data);
  }

  listeEtab(token: string): Promise<AxiosResponse> {
    return this.client.get("/etablissement/getListEtab", token);
  }

  getInfosEtab(token: string): Promise<AxiosResponse> {
    return this.client.get("/etablissement/getInfoEtab", token);
  }

  updateProfile(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/etablissement/modification", token, data);
  }

  deleteEtab(token: string, siren: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/etablissement/suppression/" + siren, token, data);
  }

  getListIP(token: string, siren): Promise<AxiosResponse> {
    return this.client.get("/ip/" + siren, token);
  }

  getListIPEtab(token: string, siren): Promise<AxiosResponse> {
    return this.client.get("/ip/ipsEtab/" + siren, token);
  }

  getIPInfos(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/ip/getIpEntity", token, data);
  }

  addIP(token: string, url: string, data: any): Promise<AxiosResponse> {
    return this.client.post(url, token, data);
  }

  deleteIP(token: string, url: string, data: any): Promise<AxiosResponse> {
    return this.client.post(url, token, data);
  }

  createEditeur(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/editeur/creationEditeur", token, data);
  }

  updateEditeur(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/editeur/modificationEditeur", token, data);
  }

  getEditeurs(token: string): Promise<AxiosResponse> {
    return this.client.get("/editeur/getListEditeurs", token);
  }

  fetchEditeur(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/ip/getEditeurEntity", token, data);
  }

  deleteEditeur(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/editeur/suppression", token, data);
  }

  resetPassword(data: Record<string, any>): Promise<AxiosResponse> {
    return this.client.post("/reinitialisationMotDePasse/resetPassword", data);
  }

  checkToken(data: Record<string, any>): Promise<AxiosResponse> {
    return this.client.post(
      "/reinitialisationMotDePasse/verifTokenValide",
      data
    );
  }

  saveNewPassword(data: Record<string, any>): Promise<AxiosResponse> {
    return this.client.post(
      "/reinitialisationMotDePasse/enregistrerPassword",
      data
    );
  }
}

export const serviceLn = new LicencesNationalesApiService();
