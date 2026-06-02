import { NextResponse } from "next/server";

import { auth } from "@/auth/auth";
import { QuoteService } from "@/quotes/quote.service";
import { QuoteRepository } from "@/quotes/quote.repository";
import { createQuoteSchema } from "@/quotes/quote.validator";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const result = createQuoteSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const quoteService = new QuoteService();

  const quoteRepository = new QuoteRepository();

  const quoteResult = quoteService.generateQuote(result.data);

  const quote = await quoteRepository.create({
    userId: session.user.id,
    ...result.data,
    ...quoteResult,
  });

  return NextResponse.json(quote, { status: 201 });
}

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const quoteRepository =
    new QuoteRepository();

  const quotes =
    await quoteRepository.findByUserId(
      session.user.id
    );

  return NextResponse.json(quotes);
}
