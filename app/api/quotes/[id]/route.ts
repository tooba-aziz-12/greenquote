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
  { params }: RouteContext
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const quoteRepository =
    new QuoteRepository();

  const quote =
    await quoteRepository.findById(id);

  if (!quote) {
    return NextResponse.json(
      { error: "Quote not found" },
      { status: 404 }
    );
  }

  if (quote.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  return NextResponse.json(quote);
}