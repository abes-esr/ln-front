import { LicencesNationalesApiService } from "@/core/service/licencesnationales/LicencesNationalesApiService";
import User from "@/core/User";
import { Logger } from "@/utils/Logger";

export class AuthentificationService extends LicencesNationalesApiService {
  /**
   * Appel API pour se logger et obtenir un getToken d'identification
   * @param data Json de login à l'API LicencesNationales
   * @return Json de réponse à l'authentification
   * @throws CredentialNotValidError si l'authentification a échoué
   * @throws HttpRequestError pour tout autre erreur
   */
  login(login: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const json: JsonLoginRequest = {
        login: login,
        password: password
      };
      return this.client
        .post("/authentification/connexion", json)
        .then(result => {
          const response: JsonLoginResponse = result.data;
          const user: User = new User();
          user.id = response.id;
          user.token = response.accessToken;
          user.nameEtab = response.userNameEtab;
          user.siren = response.userSiren;
          user.isAdmin = response.role === "admin" ? true : false;
          user.isLoggedIn = true;
          resolve(user);
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

  verifierValiditeToken(token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const json: JsonVerifierValiditeTokenRequest = {
        token: token
      };
      return this.client
        .post("/authentification/verifierValiditeToken", json)
        .then(result => {
          const response: JsonVerifierValiditeTokenResponse = result.data;
          if (response.estValide) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  changePassword(
    ancien: string,
    nouveau: string,
    token: string
  ): Promise<boolean> {
    const json: JsonModifierMotDePasseRequest = {
      ancienMotDePasse: ancien,
      nouveauMotDePasse: nouveau
    };
    return new Promise((resolve, reject) => {
      return this.client
        .post("/authentification/modifierMotDePasse", json, token)
        .then(result => {
          const response: JsonModifierMotDePasseResponse = result.data;
          resolve(true);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }
}

export const authService = new AuthentificationService();

/* JSON entrée / sortie */

export interface JsonLoginRequest {
  login: string;
  password: string;
}

export interface JsonLoginResponse {
  accessToken: string;
  tokenType: string;
  userNameEtab: string;
  isAdmin: boolean;
  userSiren: string;
  id: number;
  role: string;
}

export interface JsonMotDePasseOublieSirenRequest {
  siren: string;
  recaptcha: string;
}

export interface JsonMotDePasseOublieEmailRequest {
  email: string;
  recaptcha: string;
}

export interface JsonMotDePasseOublieResponse {
  message: string;
}

export interface JsonReinitialiserMotDePasseRequest {
  nouveauMotDePasse: string;
  token: string;
  recaptcha: string;
}

export interface JsonReinitialiserMotDePasseResponse {
  message: string;
}

export interface JsonVerifierValiditeTokenRequest {
  token: string;
}

export interface JsonVerifierValiditeTokenResponse {
  estValide: boolean;
}

export interface JsonModifierMotDePasseRequest {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}

export interface JsonModifierMotDePasseResponse {
  message: string;
}
