import { NextResponse } from "next/server";

import { auth } from "@/auth/auth";
import { QuoteRepository } from "@/quotes/quote.repository";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const quoteRepository =
    new QuoteRepository();

  const quotes =
    await quoteRepository.findAll();

  return NextResponse.json(quotes);
}