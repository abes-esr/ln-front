import { AxiosResponse } from "axios";
import AxiosClient from "../../utils/AxiosClient";
import {
  JsonCreateAccount,
  JsonCreationEditeurRequest,
  JsonEditeurResponse,
  JsonListeEditeurResponse,
  JsonLoginRequest,
  JsonLoginResponse,
  JsonModifierMotDePasseRequest,
  JsonModifierMotDePasseResponse,
  JsonMotDePasseOublieEmailRequest,
  JsonMotDePasseOublieResponse,
  JsonMotDePasseOublieSirenRequest,
  JsonReinitialiserMotDePasseRequest,
  JsonReinitialiserMotDePasseResponse,
  JsonSimpleEditeurResponse,
  JsonSuppresionEditeurResponse,
  JsonVerifierValiditeTokenRequest,
  JsonVerifierValiditeTokenResponse
} from "@/service/licencesnationales/LicencesNationalesJsonDefinition";
import { LicencesNationalesApiError } from "@/service/licencesnationales/exception/LicencesNationalesApiError";
import { LicencesNationalesBadRequestApiError } from "@/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import { LicencesNationalesUnauthorizedApiError } from "@/service/licencesnationales/exception/LicencesNationalesUnauthorizedApiError";
import { LicencesNationalesNotFoundApiError } from "@/service/licencesnationales/exception/LicencesNationalesNotFoundApiError";
import { LicencesNationalesInternalErrorApiError } from "@/service/licencesnationales/exception/LicencesNationalesInternalErrorApiError";

export class LicencesNationalesApiService {
  // Client HTTP
  client: AxiosClient = new AxiosClient(process.env.VUE_APP_ROOT_API);

  buildException(err: any): LicencesNationalesApiError {
    if (err.response) {
      // Il y a une réponse HTTP
      if (err.response.status) {
        // Il s'agit d'une exception de l'API
        if (err.response.status == 400) {
          return new LicencesNationalesBadRequestApiError(
            err.response.data.message,
            err.response.data.path,
            err.response.data.debugMessage
          );
        } else if (err.response.status == 401) {
          return new LicencesNationalesUnauthorizedApiError(
            err.response.data.error,
            err.response.data.path,
            err.response.data.debugMessage
          );
        } else if (err.response.status == 403) {
          return new LicencesNationalesUnauthorizedApiError(
            err.response.data.error,
            err.response.data.path,
            err.response.data.debugMessage
          );
        } else if (err.response.status == 404) {
          return new LicencesNationalesNotFoundApiError(
            err.response.data.error,
            err.response.data.path,
            err.response.data.debugMessage
          );
        } else if (err.response.status == 500) {
          return new LicencesNationalesInternalErrorApiError(
            err.response.data.error,
            err.response.data.path,
            err.response.data.debugMessage
          );
        } else {
          return new LicencesNationalesApiError(err.error);
        }
      } else {
        // Exception non géré par l'API - Erreur interne ?
        return new LicencesNationalesApiError(err.error);
      }
    } else {
      // Erreur au départ de la requête HTTP
      return new LicencesNationalesApiError(err.message);
    }
  }

  /**
   * Appel API pour se logger et obtenir un getToken d'identification
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
          reject(this.buildException(err));
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
          reject(this.buildException(err));
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
          reject(this.buildException(err));
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
          reject(this.buildException(err));
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
          reject(this.buildException(err));
        });
    });
  }

  changePassword(
    data: JsonModifierMotDePasseRequest,
    token: string
  ): Promise<JsonModifierMotDePasseResponse> {
    return new Promise((resolve, reject) => {
      return this.client
        .post("/authentification/modifierMotDePasse", data, token)
        .then(result => {
          const response: JsonModifierMotDePasseResponse = result.data;
          resolve(response);
        })
        .catch(err => {
          reject(this.buildException(err));
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

  addIP(token: string, siren: string, data: any): Promise<AxiosResponse> {
    return this.client.put("/ip/" + siren, data, token);
  }

  updateIP(token: string, id, data: any): Promise<AxiosResponse> {
    return this.client.post("/ip/" + id, data, token);
  }

  validateIp(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/ip/valider", data, token);
  }

  deleteIP(token: string, id): Promise<AxiosResponse> {
    return this.client.delete("/ip/" + id, token);
  }

  //******* Fonctionnalité EditeurItem *********
  // Création

  createEditeur(
    token: string,
    data: JsonCreationEditeurRequest
  ): Promise<JsonListeEditeurResponse> {
    return new Promise((resolve, reject) => {
      return this.client
        .put("/editeurs", data, token)
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
  updateEditeur(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/editeur/modificationEditeur", data, token);
  }

  //Liste
  getEditeurs(token: string): Promise<Array<JsonSimpleEditeurResponse>> {
    return new Promise((resolve, reject) => {
      return this.client
        .get("/editeurs", token)
        .then(result => {
          const response: Array<JsonSimpleEditeurResponse> = result.data;
          resolve(response);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  getEditeur(id: number, token: string): Promise<JsonEditeurResponse> {
    return new Promise((resolve, reject) => {
      return this.client
        .get("/editeurs/" + id, token)
        .then(result => {
          const response: JsonEditeurResponse = result.data;
          resolve(response);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  deleteEditeur(
    id: number,
    token: string
  ): Promise<JsonSuppresionEditeurResponse> {
    return new Promise((resolve, reject) => {
      return this.client
        .delete("/editeurs/" + id, token)
        .then(result => {
          const response: JsonSuppresionEditeurResponse = result.data;
          resolve(response);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }
}

export const serviceLn = new LicencesNationalesApiService();
