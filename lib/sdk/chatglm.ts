import { genToken } from './auth';
import { CHATGLM_API_URL } from './constants';
import { Completions } from './completions';
import { Stream } from 'stream';

export type Message = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content?: string;
  tool_calls?: Array<{
    id: string;
    type: string;
    function?: {
      name: string;
      arguments: string;
    };
  }>;
  tool_call_id?: string;
};

export type RequestOptions = {
  model: 'glm-4' | 'glm-3-turbo';
  messages: Array<Message>;
  request_id: string;
  do_sample: boolean;
  stream?: boolean;
  temperature?: number;
  top_p?: number;
  stop?: string[];
  max_tokens?: number;
  tools?: Array<{
    type: 'function' | 'retrieval' | 'web_search',
    function?: {
      name: string;
      description: string;
      parameters?: any;
    };
    retrieval?: {
      knowledge_id: string;
      prompt_template: string;
    };
    web_search?: {
      enable: boolean;
      search_query: string;
    };
  }>;
  tool_choice?: 'auto';
}

export type Delta = {
  role: string;
  content: string;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }>;
};

export type Response = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    finish_reason: 'stop' | 'tool_calls' | 'length' | 'sensitive' | 'network_error';
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
    finish_reason: 'stop' | 'tool_calls' | 'length' | 'sensitive' | 'network_error';
    delta: Delta;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export class ChatGLM {
  private token: string;

  completions: Completions<RequestOptions, Response | Stream>;

  constructor(apiKey: string) {
    this.token = genToken(apiKey);
    this.completions = new Completions({ token: this.token, apiUrl: CHATGLM_API_URL });
  }
}
