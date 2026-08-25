import { NextResponse } from "next/server";

import { sendContactFormEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body || {};

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, message: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await sendContactFormEmail({
      name: name.trim(),
      email: email.trim(),
      subject: subject?.trim(),
      message: message.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CONTACT FORM EMAIL ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send your message. Please try again." },
      { status: 500 }
    );
  }
}
