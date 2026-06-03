import { NextResponse } from "next/server";

import { auth } from "@/auth/auth";
import { QuoteRepository } from "@/quotes/quote.repository";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext,
) {
  const session = await auth();

  if (!session?.user) {
    console.warn("Unauthorized quote access attempt");

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id } = await params;

  console.info("Quote details requested", {
    quoteId: id,
    userId: session.user.id,
  });

  const quoteRepository = new QuoteRepository();

  const quote = await quoteRepository.findById(id);

  if (!quote) {
    console.warn("Quote not found", {
      quoteId: id,
      userId: session.user.id,
    });

    return NextResponse.json(
      { error: "Quote not found" },
      { status: 404 },
    );
  }

  if (quote.userId !== session.user.id) {
    console.warn("Forbidden quote access", {
      quoteId: id,
      userId: session.user.id,
      ownerId: quote.userId,
    });

    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  console.info("Quote details returned", {
    quoteId: quote.id,
    userId: session.user.id,
  });

  return NextResponse.json(quote);
}