import { NextResponse } from "next/server";

import { auth } from "@/auth/auth";
import { QuoteRepository } from "@/quotes/quote.repository";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    console.warn("Unauthorized admin quote access attempt");

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (session.user.role !== "ADMIN") {
    console.warn("Forbidden admin quote access attempt", {
      userId: session.user.id,
      role: session.user.role,
    });

    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  console.info("Admin quote list requested", {
    userId: session.user.id,
  });

  const quoteRepository = new QuoteRepository();

  const quotes = await quoteRepository.findAll();

  console.info("Admin quote list returned", {
    userId: session.user.id,
    quoteCount: quotes.length,
  });

  return NextResponse.json(quotes);
}