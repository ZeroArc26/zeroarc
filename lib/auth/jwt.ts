import jwt, { Secret, SignOptions } from "jsonwebtoken";

export interface AdminJWTPayload {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "STAFF";
}

export interface UserJWTPayload {
  id: string;
  email: string;
  fullName: string;
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

export function signUserToken(payload: UserJWTPayload): string {
  return jwt.sign(payload, secret, signOptions);
}

export function verifyUserToken(token: string): UserJWTPayload {
  return jwt.verify(token, secret) as UserJWTPayload;
}