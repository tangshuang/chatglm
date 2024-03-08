import axios, { AxiosResponse } from 'axios';

export class Completions<T, U> {
  private token: string;
  private apiUrl: string;

  constructor(options: { token: string, apiUrl: string }) {
    const { token, apiUrl } = options;
    this.token = token;
    this.apiUrl = apiUrl;
  }

  create(params: T): Promise<AxiosResponse<U>> {
    const { token, apiUrl } = this;
    // @ts-ignore
    const { stream } = params;
    const headers = {
      'Content-Type' : 'application/json',
      Authorization: token,
    };

    if (!stream) {
      return axios.post(apiUrl, params, { headers });
    }

    return axios.post(apiUrl, params, { headers, responseType: 'stream' });
  }
}
