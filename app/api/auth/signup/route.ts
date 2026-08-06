import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

import { hashPassword } from "@/lib/auth/password";
import { signUserToken } from "@/lib/auth/jwt";
import { setUserCookie } from "@/lib/auth/cookies";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { fullName, email, password } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = signUserToken({
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
    });

    await setUserCookie(token);

    return NextResponse.json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 }
    );
  }
}