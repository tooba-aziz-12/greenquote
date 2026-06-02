"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuotes() {
      const response = await fetch("/api/quotes");
      const data = await response.json();

      setQuotes(data);
      setLoading(false);
    }

    loadQuotes();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-8">
        <p>Loading quotes...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          My Quotes
        </h1>

        <p className="mt-2 text-gray-600">
          Review your previously generated solar quotes.
        </p>
      </div>

      {quotes.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p>No quotes found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="rounded-lg border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4">
                <h2 className="text-lg font-semibold">
                  {quote.address}
                </h2>

                <p className="text-sm text-gray-500">
                  {new Date(
                    quote.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">
                    Risk Band:
                  </span>{" "}
                  {quote.riskBand}
                </p>

                <p>
                  <span className="font-semibold">
                    System Price:
                  </span>{" "}
                  $
                  {quote.systemPrice.toLocaleString()}
                </p>

                <p>
                  <span className="font-semibold">
                    System Size:
                  </span>{" "}
                  {quote.systemSizeKw} kW
                </p>

                <p>
                  <span className="font-semibold">
                    Consumption:
                  </span>{" "}
                  {quote.monthlyConsumptionKwh} kWh
                </p>
              </div>

              <Link
                href={`/quotes/${quote.id}`}
                className="mt-4 inline-block rounded bg-black px-4 py-2 text-sm text-white"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}