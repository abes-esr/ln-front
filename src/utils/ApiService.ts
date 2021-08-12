import axios, { AxiosInstance, AxiosResponse } from "axios";
import store from "../store";

class ApiService {
  client: AxiosInstance = axios.create({
    baseURL: process.env.VUE_APP_ROOT_API,
    headers: {
      Authorization: "Bearer " + store.state.user.token
    }
  });

  publicClient: AxiosInstance = axios.create({
    baseURL: process.env.VUE_APP_ROOT_API
  });

  apiPostRequest(url: string, data: any): Promise<AxiosResponse> {
    return this.client
      .post(url, data)
      .then(response => {
        if (response.status == 200) {
          return response;
        }
      })
      .catch(err => {
        return err;
      });
  }

  apiGetRequest(url: string): Promise<AxiosResponse> {
    return this.client
      .get(url)
      .then(response => {
        if (response.status == 200) {
          return response;
        }
      })
      .catch(err => {
        return err;
      });
  }

  apiPublicPostRequest(url: string, data: any): Promise<AxiosResponse> {
    return this.publicClient
      .post(url, data)
      .then(response => {
        if (response.status == 200 || response.status == 201) {
          return response;
        }
      })
      .catch(err => {
        return err;
      });
  }
}

export default new ApiService();
