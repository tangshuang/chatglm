import { genToken, autoUpdateToken } from './auth';
import { CHARACTER_GLM_SSE_API_URL } from './constants';
import axios, { AxiosResponse } from 'axios';

export type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export type RequestOptions = {
    model: 'charglm-3';
    prompt: Message[];
    meta: {
        user_info: string;
        bot_info: string;
        user_name: string;
        bot_name: string;
    };
    request_id: string;
    return_type: 'json_string' | 'text';
    incremental: boolean;
};

export type Response = {
    id: string;
    /** add 增量，finish 结束，error 错误，interrupted 中断 */
    event: 'add' | 'finish' | 'error' | 'interrupted';
    data: {
        meta: {
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
        };
    };
};

class SSE {
    private token: string;
    private apiUrl: string;

    constructor(options: { token: string; apiUrl: string }) {
        const { token, apiUrl } = options;
        this.token = token;
        this.apiUrl = apiUrl;
    }
    invoke(params: RequestOptions): Promise<AxiosResponse<Response>> {
        const { token, apiUrl } = this;
        // @ts-ignore
        const headers = {
            'Content-Type': 'application/json',
            Authorization: token,
        };

        const { return_type = 'json_string', incremental = true, ...others } = params;
        const postData = { return_type, incremental, ...others };

        return axios.post(apiUrl, postData, { headers, responseType: 'stream' });
    }
}

export class CharacterGLM {
    private token: string;

    sse: SSE;

    constructor(apiKey: string) {
        this.token = genToken(apiKey);
        autoUpdateToken(apiKey, 0, (token: string) => this.token = token);
        this.sse = new SSE({ token: this.token, apiUrl: CHARACTER_GLM_SSE_API_URL });
    }
}
