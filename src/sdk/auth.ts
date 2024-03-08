import jwt from 'jsonwebtoken';

export function genToken(apiKey: string, expireSeconds = 24 * 3600) {
  const [api_key, secret] = apiKey.split('.');

  const now = Date.now();

  const payload = {
    api_key,
    exp: now + expireSeconds * 1000,
    timestamp: now,
  };

  const options = {
    algorithm: 'HS256',
    header: {
      alg: "HS256",
      sign_type: "SIGN",
    },
  };

  const token = jwt.sign(payload, secret, options);
  return token;
}

export function autoUpdateToken(apiKey: string, expireSeconds: number, onGen: Function) {
  expireSeconds = expireSeconds || 24 * 3600;

  const update = () => {
    const token = genToken(apiKey, expireSeconds);
    onGen(token);
  };

  setInterval(update, expireSeconds - 120);
}