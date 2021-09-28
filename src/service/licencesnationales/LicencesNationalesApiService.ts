import { AxiosResponse } from "axios";
import AxiosClient from "../../utils/AxiosClient";
import {
  JsonCreateAccount,
  JsonLoginRequest,
  JsonLoginResponse,
  JsonMotDePasseOublieSirenRequest,
  JsonMotDePasseOublieResponse,
  JsonReinitialiserMotDePasseResponse,
  JsonReinitialiserMotDePasseRequest,
  JsonMotDePasseOublieEmailRequest,
  JsonVerifierValiditeTokenRequest,
  JsonVerifierValiditeTokenResponse, JsonModifierMotDePasseRequest, JsonModifierMotDePasseResponse
} from "@/service/licencesnationales/LicencesNationalesJsonDefinition";
import { HttpRequestError } from "@/exception/HttpRequestError";
import { CredentialNotValidError } from "@/service/licencesnationales/CredentialNotValidError";
import {UnauthorizedError} from "@/service/licencesnationales/UnauthorizedError";
import {BadRequestError} from "@/service/licencesnationales/BadRequestError";

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
          if (err.response.status == 400) {
            reject(new BadRequestError(err.response.data.message));
          } else if (err.response.status == 401) {
            reject(new UnauthorizedError('La route API '+err.response.data.path+' n\'est pas autorisée'));
          } else if (err.response.status == 404) {
            reject(new CredentialNotValidError(err.response.data.message));
          } else {
            reject(
                new HttpRequestError(
                    err.response.status,
                    err.response.data.error,
                    err.response.data.path
                )
            );
          }
        });
    });
  }

  /**
   * Appel API pour réinitiliser son mot de passe avec son Siren
   * @param data
   */
  motDePasseOublieSiren(
    data: JsonMotDePasseOublieSirenRequest
  ): Promise<JsonMotDePasseOublieResponse> {
    return new Promise((resolve, reject) => {
      return this.client
        .post("/authentification/motDePasseOublie", data)
        .then(result => {
          const response: JsonMotDePasseOublieResponse = result.data;
          resolve(response);
        })
        .catch(err => {
          if (err.response.status == 400) {
            reject(new BadRequestError(err.response.data.message));
          } else if (err.response.status == 401) {
            reject(new UnauthorizedError('La route API '+err.response.data.path+' n\'est pas autorisée'));
          } else if (err.response.status == 404) {
            reject(new CredentialNotValidError(err.response.data.message));
          } else {
            reject(
                new HttpRequestError(
                    err.response.status,
                    err.response.data.error,
                    err.response.data.path
                )
            );
          }
        });
    });
  }

  /**
   * Appel API pour réinitiliser son mot de passe avec son email
   * @param data
   */
  motDePasseOublieEmail(
    data: JsonMotDePasseOublieEmailRequest
  ): Promise<JsonMotDePasseOublieResponse> {
    return new Promise((resolve, reject) => {
      return this.client
        .post("/authentification/motDePasseOublie", data)
        .then(result => {
          const response: JsonMotDePasseOublieResponse = result.data;
          resolve(response);
        })
        .catch(err => {
          if (err.response.status == 400) {
            reject(new BadRequestError(err.response.data.message));
          } else if (err.response.status == 401) {
            reject(new UnauthorizedError('La route API '+err.response.data.path+' n\'est pas autorisée'));
          } else if (err.response.status == 404) {
            reject(new CredentialNotValidError(err.response.data.message));
          } else {
            reject(
                new HttpRequestError(
                    err.response.status,
                    err.response.data.error,
                    err.response.data.path
                )
            );
          }
        });
    });
  }

  reinitialiserMotDePasse(
    data: JsonReinitialiserMotDePasseRequest
  ): Promise<JsonReinitialiserMotDePasseResponse> {
    return new Promise((resolve, reject) => {
      return this.client
        .post("/authentification/reinitialiserMotDePasse", data)
        .then(result => {
          const response: JsonReinitialiserMotDePasseResponse = result.data;
          resolve(response);
        })
        .catch(err => {
          if (err.response.status == 400) {
            reject(new BadRequestError(err.response.data.message));
          } else if (err.response.status == 401) {
            reject(new UnauthorizedError('La route API '+err.response.data.path+' n\'est pas autorisée'));
          } else if (err.response.status == 404) {
            reject(new CredentialNotValidError(err.response.data.message));
          } else {
            reject(
                new HttpRequestError(
                    err.response.status,
                    err.response.data.error,
                    err.response.data.path
                )
            );
          }
        });
    });
  }

  verifierValiditeToken(
    data: JsonVerifierValiditeTokenRequest
  ): Promise<JsonVerifierValiditeTokenResponse> {
    return new Promise((resolve, reject) => {
      return this.client
        .post("/authentification/verifierValiditeToken", data)
        .then(result => {
          const response: JsonVerifierValiditeTokenResponse = result.data;
          resolve(response);
        })
        .catch(err => {
          if (err.response.status == 400) {
            reject(new BadRequestError(err.response.data.message));
          } else if (err.response.status == 401) {
            reject(new UnauthorizedError('La route API '+err.response.data.path+' n\'est pas autorisée'));
          } else if (err.response.status == 404) {
            reject(new CredentialNotValidError(err.response.data.message));
          } else {
            reject(
              new HttpRequestError(
                err.response.status,
                err.response.data.error,
                err.response.data.path
              )
            );
          }
        });
    });
  }

  changePassword(data: JsonModifierMotDePasseRequest,token: string): Promise<JsonModifierMotDePasseResponse> {
    return new Promise((resolve, reject) => {
      return this.client
          .post("/authentification/modifierMotDePasse", data,token)
          .then(result => {
            const response: JsonModifierMotDePasseResponse = result.data;
            resolve(response);
          })
          .catch(err => {
            if (err.response.status == 400) {
              reject(new BadRequestError(err.response.data.message));
            } else if (err.response.status == 401) {
              reject(new UnauthorizedError('La route API '+err.response.data.path+' n\'est pas autorisée'));
            } else if (err.response.status == 404) {
              reject(new CredentialNotValidError(err.response.data.message));
            } else {
              reject(
                  new HttpRequestError(
                      err.response.status,
                      err.response.data.error,
                      err.response.data.path
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



  ajouterAcces(url: string, token: string, data: any): Promise<AxiosResponse> {
    return this.client.post(url, token, data);
  }

  fusion(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/etablissements/fusion", token, data);
  }

  scission(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/etablissements/division", token, data);
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

  getListIP(token: string, siren): Promise<AxiosResponse> {
    return this.client.get("/ip/" + siren, token);
  }

  getListIPEtab(token: string, siren): Promise<AxiosResponse> {
    return this.client.get("/ip/ipsEtab/" + siren, token);
  }

  getIPInfos(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/ip/getIpEntity", data, token);
  }

  addIP(token: string, url: string, data: any): Promise<AxiosResponse> {
    return this.client.post(url, data, token);
  }

  deleteIP(token: string, url: string, data: any): Promise<AxiosResponse> {
    return this.client.post(url, data, token);
  }

  createEditeur(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/editeur/creationEditeur", data, token);
  }

  updateEditeur(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/editeur/modificationEditeur", data, token);
  }

  getEditeurs(token: string): Promise<AxiosResponse> {
    return this.client.get("/editeur/getListEditeurs", token);
  }

  fetchEditeur(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/ip/getEditeurEntity", data, token);
  }

  deleteEditeur(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/editeur/suppression", data, token);
  }
}

export const serviceLn = new LicencesNationalesApiService();
