import crypto from 'crypto';

export const generateWalletAddress = async () => {
  // Generate a random private key
  const privateKey = crypto.randomBytes(32);

  // Create a SHA-256 hash of the private key
  const hash = crypto.createHash('sha256').update(privateKey).digest();

  // Take the first 20 bytes of the hash for the address
  const address = 'x0' + hash.slice(0, 16).toString('hex');
  return address;
}; 