import crypto from 'crypto';

export const generateWalletAddress = async () => {
  const privateKey = crypto.randomBytes(32);

  const hash = crypto.createHash('sha256').update(privateKey).digest();

  const address = 'x0' + hash.slice(0, 16).toString('hex');
  return address;
}; 