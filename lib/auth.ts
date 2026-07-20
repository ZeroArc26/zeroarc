import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type UserPayload = {
  id: string;
  email: string;
  fullName: string;
};

export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  console.log("TOKEN =", token);

  if (!token) {
    return null;
  }

  try {
    const user = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as UserPayload;

    console.log("USER =", user);

    return user;
  } catch (err) {
    console.log("JWT ERROR =", err);
    return null;
  }
}