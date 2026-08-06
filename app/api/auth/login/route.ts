import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

import { comparePassword } from "@/lib/auth/password";
import { signUserToken } from "@/lib/auth/jwt";
import { setUserCookie } from "@/lib/auth/cookies";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input.",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = signUserToken({
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
    });

    await setUserCookie(token);

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}