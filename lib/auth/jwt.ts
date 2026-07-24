import jwt, { Secret, SignOptions } from "jsonwebtoken";

export interface AdminJWTPayload {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "STAFF";
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in .env.local");
}

const secret: Secret = JWT_SECRET;

const signOptions: SignOptions = {
  expiresIn: "7d",
};

export function signAdminToken(payload: AdminJWTPayload): string {
  return jwt.sign(payload, secret, signOptions);
}

export function verifyAdminToken(token: string): AdminJWTPayload {
  return jwt.verify(token, secret) as AdminJWTPayload;
}