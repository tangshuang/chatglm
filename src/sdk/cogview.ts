import { genToken } from './auth';
import { COGVIEW_API_URL } from './constants';
import axios, { AxiosResponse } from 'axios';

export type RequestOptions = {
  model: 'cogview-3',
  prompt: string;
};

export type Response = {
  created: string;
  data: {
    url: string;
  };
};

class Images {
  private token: string;
  private apiUrl: string;

  constructor(options: { token: string; apiUrl: string }) {
    const { token, apiUrl } = options;
    this.token = token;
    this.apiUrl = apiUrl;
  }
  generations(params: RequestOptions): Promise<AxiosResponse<Response>> {
    const { token, apiUrl } = this;
    // @ts-ignore
    const headers = {
      'Content-Type' : 'application/json',
      Authorization: token,
    };

    return axios.post(apiUrl, params, { headers });
  }
}

export class CogView {
  private token: string;

  images: Images;

  constructor(apiKey: string) {
    this.token = genToken(apiKey);
    this.images = new Images({ token: this.token, apiUrl: COGVIEW_API_URL });
  }
}
