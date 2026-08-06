import { getUserCookie } from "@/lib/auth/cookies";
import { verifyUserToken, UserJWTPayload } from "@/lib/auth/jwt";

export async function getCurrentUser(): Promise<UserJWTPayload | null> {
  const token = await getUserCookie();

  if (!token) {
    return null;
  }

  try {
    return verifyUserToken(token);
  } catch {
    return null;
  }
}