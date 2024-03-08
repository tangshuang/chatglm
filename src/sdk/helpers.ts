
import { Stream, Duplex } from 'stream';

export function adapt(stream: Stream) {
    const du = new Duplex({
        read() {},
        write() {},
    });

    let text = '';
    const chunks: any = [];
    stream.on('data', (chunk) => {
        const str = chunk.toString();
        text += str;

        const lines = text.split('\n');
        lines.forEach((line, i) => {
            if (line.indexOf('data: ') === 0) {
                const str = line.replace('data: ', '').trim();
                if (str === '[DONE]') {
                    text = '';
                    lines.length = 0;
                    du.emit('end', JSON.stringify(chunks));
                    return;
                }
                try {
                    const data = JSON.parse(str);
                    du.emit('data', str);
                    chunks.push(data);
                    lines.splice(i, 1);
                }
                catch (e) {
                }
            }
        });
        text = lines.filter(Boolean).join('\n');
    });

    return du;
}