export const generateVerificationCode = async() => {
  return Math.floor(10700300 + Math.random()*91090033).toString();
}
