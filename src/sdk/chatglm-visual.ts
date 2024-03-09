import { genToken, autoUpdateToken } from './auth';
import { Completions } from './completions';
import { Stream } from 'stream';
import { CHATGLM_API_URL } from './constants';
import { adapt } from './helpers';

export type Message = {
  role: 'user';
  content: Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
      url: string;
    };
  }>;
} | {
  role: 'assistant',
  content: string;
};

export type RequestOptions = {
  model: 'glm-4v';
  messages: Array<Message>;
  request_id: string;
  do_sample: boolean;
  stream?: boolean;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
}

export type Delta = {
  role: string;
  content: string;
};

export type Response = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    finish_reason: 'stop' | 'length' | 'sensitive' | 'network_error';
    message: Delta;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type ResponseStream = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    finish_reason: 'stop' | 'length' | 'sensitive' | 'network_error';
    delta: Delta;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export class ChatGLMVisual {
  private token: string;

  completions: Completions<RequestOptions, Response | Stream>;

  constructor(apiKey: string) {
    this.token = genToken(apiKey);
    autoUpdateToken(apiKey, 0, (token: string) => this.token = token);
    this.completions = new Completions({ token: this.token, apiUrl: CHATGLM_API_URL });
  }

  static adapt = adapt;
}
