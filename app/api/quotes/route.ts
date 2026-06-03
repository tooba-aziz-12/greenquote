import { NextResponse } from "next/server";

import { auth } from "@/auth/auth";
import { QuoteService } from "@/quotes/quote.service";
import { QuoteRepository } from "@/quotes/quote.repository";
import { createQuoteSchema } from "@/quotes/quote.validator";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    console.warn("Unauthorized quote creation attempt");

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await request.json();

  const result = createQuoteSchema.safeParse(body);

  if (!result.success) {
    console.warn("Quote validation failed", {
      userId: session.user.id,
    });

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 },
    );
  }

  console.info("Quote creation requested", {
    userId: session.user.id,
  });

  const quoteService = new QuoteService();

  const quoteRepository = new QuoteRepository();

  const quoteResult = quoteService.generateQuote(result.data);

  const quote = await quoteRepository.create({
    userId: session.user.id,
    ...result.data,
    ...quoteResult,
  });

  console.info("Quote created successfully", {
    quoteId: quote.id,
    userId: session.user.id,
    riskBand: quote.riskBand,
  });

  return NextResponse.json(
    quote,
    { status: 201 },
  );
}

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    console.warn("Unauthorized quote list access attempt");

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  console.info("Quote list requested", {
    userId: session.user.id,
  });

  const quoteRepository = new QuoteRepository();

  const quotes = await quoteRepository.findByUserId(
    session.user.id,
  );

  console.info("Quote list returned", {
    userId: session.user.id,
    quoteCount: quotes.length,
  });

  return NextResponse.json(quotes);
}