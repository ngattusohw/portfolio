import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

// OWASP's 32 MiB scrypt profile fits comfortably on the free Render instance.
const options = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };

function derive(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, options, (error, key) => error ? reject(error) : resolve(key));
  });
}

export function validPassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 15 && password.length <= 128;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(24).toString("hex");
  const key = await derive(password, salt);
  return `scrypt-v1:${salt}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [version, salt, expected] = hash.split(":");
  if (version !== "scrypt-v1" || !/^[a-f0-9]{48}$/.test(salt ?? "") || !/^[a-f0-9]{128}$/.test(expected ?? "")) return false;
  return timingSafeEqual(await derive(password, salt), Buffer.from(expected, "hex"));
}
