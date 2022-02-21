import { AxiosResponse } from "axios";
import { LicencesNationalesApiService } from "@/core/service/licencesnationales/LicencesNationalesApiService";

export class IPService extends LicencesNationalesApiService {
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

  updateIP(token: string, siren: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/ip/gerer/" + siren, data, token);
  }

  deleteIP(token: string, id): Promise<AxiosResponse> {
    return this.client.delete("/ip/" + id, token);
  }

  getWhoIs(token: string, ip): Promise<AxiosResponse> {
    return this.client.get("/ip/whois/" + ip, token);
  }
}

export const iPService = new IPService();

/* JSON entrée / sortie */
