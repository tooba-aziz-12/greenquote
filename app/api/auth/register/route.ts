import { NextResponse } from "next/server";

import { registerSchema } from "@/auth/register.validator";
import { AuthService } from "@/auth/auth.service";

export async function POST(request: Request) {
  const body = await request.json();

  const result = registerSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  const { fullName, email, password } = result.data;

  const authService = new AuthService();

  try {
    const user = await authService.register(
      fullName,
      email,
      password
    );

    return NextResponse.json(
      {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 409 }
    );
  }
}