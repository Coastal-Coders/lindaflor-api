import * as bcrypt from 'bcrypt';

export async function generateResetToken(): Promise<string> {
  const randomString = Math.random().toString(36).substring(2) + new Date().getTime().toString(36);
  const saltRounds = 10;
  const hashedToken = await bcrypt.hash(randomString, saltRounds);
  return hashedToken;
}
