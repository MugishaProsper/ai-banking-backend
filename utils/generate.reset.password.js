import crypto from 'crypto';

export const generateResetPassword = async () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  return resetToken;
};