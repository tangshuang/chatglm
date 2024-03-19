import { chat, chatSync } from 'chatglmjs';
import { Stream, Duplex } from 'stream';

type ChatParams = {
  stream: boolean;
  prompt: string;
  /** @default 0.95 */
  temperature?: number;
  /** @default 0.7 */
  top_p?: number;
  /** @default 0 */
  top_k?: number;
};

export class Chat {
  constructor(private model_bin_path: string) {}

  create(params: ChatParams): Stream | string {
    const { stream, ...args } = params;
    if (stream) {
      const st = new Duplex({
        read() { },
        write() { },
      });

      chat({
        model_bin_path: this.model_bin_path,
        ...args,
        onmessage(msg) {
          st.emit('data', msg);
        },
        onend() {
          st.emit('end');
        },
        onerror(e) {
          st.emit('error', e);
        },
      });

      return st;
    }
    return chatSync({ model_bin_path: this.model_bin_path, ...args });
  }
}
