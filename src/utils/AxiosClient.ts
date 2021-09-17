import axios, { AxiosInstance, AxiosResponse } from "axios";

/**
 * Représente un client Axios pour envoyer et recevoir des requêtes HTTP avec
 * les méthodes POST et GET avec ou sans authentification
 */
class AxiosClient {
  client: AxiosInstance;

  constructor(url: string) {
    this.client = axios.create({
      baseURL: url
    });
  }

  /**
   * Appel HTTP POST
   * @param url URL de la requête HTTP
   * @param data Body de la requête HTTP
   * @param token Token Bearer à ajouter à l'entête
   */
  post(url: string, data: any, token?: string): Promise<AxiosResponse> {
    // Si un token est renseigné, on le rajoute à l'entête
    let config;
    if (token) {
      config = {
        headers: {
          Authorization: "Bearer " + token
        }
      };
    }

    return this.client.post(url, data, config);
  }

  /**
   * Appel HTTP PUT
   * @param url URL de la requête HTTP
   * @param data Body de la requête HTTP
   * @param token Token Bearer à ajouter à l'entête
   */
  put(url: string, data: any, token?: string): Promise<AxiosResponse> {
    // Si un token est renseigné, on le rajoute à l'entête
    let config;
    if (token) {
      config = {
        headers: {
          Authorization: "Bearer " + token
        }
      };
    }

    return this.client.put(url, data, config);
  }

  /**
   * Appel HTTP GET
   * @param url URL de la requête HTTP
   * @param token Token Bearer à ajouter à l'entête
   */
  get(url: string, token?: string): Promise<AxiosResponse> {
    // Si un token est renseigné, on le rajoute à l'entête
    let config;
    if (token) {
      config = {
        headers: {
          Authorization: "Bearer " + token
        }
      };
    }

    return this.client.get(url, config);
  }
}

export default AxiosClient;
