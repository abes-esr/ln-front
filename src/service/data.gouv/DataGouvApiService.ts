import AxiosClient from "../../utils/AxiosClient";
import { Logger } from "@/utils/Logger";
import { JsonCheckSirenResponse } from "@/service/data.gouv/DataGouvJsonDefinition";
import { HttpRequestError } from "@/exception/HttpRequestError";
import { SirenNotFoundError } from "@/service/data.gouv/SirenNotFoundError";

export class DataGouvApiService {
  // Client HTTP
  client: AxiosClient = new AxiosClient("https://entreprise.data.gouv.fr/api");

  /**
   * Appel API pour se logger et obtenir un token d'identification
   * @param data Json de login à l'API LicencesNationales
   * @return string : La dénomination de l'entreprise
   * @throws SirenNotFoundError si le numéro SIREN n'existe pas dans data.gouv
   * @throws HttpRequestError si la requête retourne une erreur
   */
  checkSiren(num: string): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.client
        .get("/sirene/v3/unites_legales/" + num)
        .then(result => {
          /**
           * Attention, l'assignation de AxiosResponse<any> vers l'interface n'est pas considérée comme fiable à 100%
           * Il conviendrait de tester la présence de chaque champs et de les assigner "à la main".
           */
          const response: JsonCheckSirenResponse = result.data;

          if (response.unite_legale.denomination == null) {
            resolve("Dénomination non renseignée");
          } else {
            resolve(response.unite_legale.denomination);
          }
        })
        .catch(err => {
          if (
            err.response.status == 404 &&
            err.response.data.message == "no results found"
          ) {
            reject(new SirenNotFoundError("SIREN introuvable"));
          } else {
            reject(
              new HttpRequestError(
                err.response.status,
                err.response.data.message
              )
            );
          }
        });
    });
  }
}

export const serviceGouv = new DataGouvApiService();
