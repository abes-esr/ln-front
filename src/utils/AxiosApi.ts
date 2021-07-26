import { AxiosResponse } from "axios";
import ApiService from "./ApiService";

export class AxiosApi {
  static creationCompte(data: Record<string, any>): Promise<AxiosResponse> {
    return ApiService.apiPublicPostRequest(
      "/ln/etablissement/creationCompte",
      data
    );
  }

  static ajouterAcces(
    url: string,
    data: Record<string, any>
  ): Promise<AxiosResponse> {
    return ApiService.apiPostRequest(url, data);
  }

  static changePassword(data: Record<string, any>): Promise<AxiosResponse> {
    return ApiService.apiPostRequest(
      "/ln/reinitialisationMotDePasse/updatePassword",
      data
    );
  }

  static fusion(data: Record<string, any>): Promise<AxiosResponse> {
    return ApiService.apiPostRequest("ln/etablissement/fusion", data);
  }

  static scission(data: Record<string, any>): Promise<AxiosResponse> {
    return ApiService.apiPostRequest("ln/etablissement/division", data);
  }

  static listeEtab(): Promise<AxiosResponse> {
    return ApiService.apiGetRequest("ln/etablissement/getListEtab");
  }

  static getInfosEtab(): Promise<AxiosResponse> {
    return ApiService.apiGetRequest("/ln/etablissement/getInfoEtab");
  }

  static updateProfile(data: Record<string, any>): Promise<AxiosResponse> {
    return ApiService.apiPostRequest("/ln/etablissement/modification", data);
  }

  static deleteEtab(
    siren: string,
    data: Record<string, any>
  ): Promise<AxiosResponse> {
    return ApiService.apiPostRequest(
      "ln/etablissement/suppression/" + siren,
      data
    );
  }

  static getListIP(siren): Promise<AxiosResponse> {
    return ApiService.apiGetRequest("ln/ip/" + siren);
  }

  static getListIPEtab(siren): Promise<AxiosResponse> {
    return ApiService.apiGetRequest("ln/ip/ipsEtab/" + siren);
  }

  static getIPInfos(data: Record<string, any>): Promise<AxiosResponse> {
    return ApiService.apiPostRequest("/ln/ip/getIpEntity", data);
  }

  static addIP(url: string, data: Record<string, any>): Promise<AxiosResponse> {
    return ApiService.apiPostRequest(url, data);
  }

  static deleteIP(
    url: string,
    data: Record<string, any>
  ): Promise<AxiosResponse> {
    return ApiService.apiPostRequest(url, data);
  }

  static createEditeur(data: Record<string, any>): Promise<AxiosResponse> {
    return ApiService.apiPostRequest("ln/editeur/creationEditeur", data);
  }

  static updateEditeur(data: Record<string, any>): Promise<AxiosResponse> {
    return ApiService.apiPostRequest("/ln/editeur/modificationEditeur", data);
  }

  static getEditeurs(): Promise<AxiosResponse> {
    return ApiService.apiGetRequest("/ln/editeur/getListEditeurs");
  }

  static fetchEditeur(data: Record<string, any>): Promise<AxiosResponse> {
    return ApiService.apiPostRequest("/ln/ip/getEditeurEntity", data);
  }

  static deleteEditeur(data: Record<string, any>): Promise<AxiosResponse> {
    return ApiService.apiPostRequest("/ln/editeur/suppression", data);
  }

  static resetPassword(data: Record<string, any>): Promise<AxiosResponse> {
    return ApiService.apiPublicPostRequest(
      "/ln/reinitialisationMotDePasse/resetPassword",
      data
    );
  }

  static checkToken(data: Record<string, any>): Promise<AxiosResponse> {
    return ApiService.apiPublicPostRequest(
      "ln/reinitialisationMotDePasse/verifTokenValide",
      data
    );
  }

  static saveNewPassword(data: Record<string, any>): Promise<AxiosResponse> {
    return ApiService.apiPublicPostRequest(
      "ln/reinitialisationMotDePasse/enregistrerPassword",
      data
    );
  }
}
