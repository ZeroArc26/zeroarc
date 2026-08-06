import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "admin_token";
const USER_COOKIE_NAME = "token";

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function removeAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function getAdminCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value;
}

export async function setUserCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(USER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days — customers stay logged in longer than admins
  });
}

export async function removeUserCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_COOKIE_NAME);
}

export async function getUserCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(USER_COOKIE_NAME)?.value;
}