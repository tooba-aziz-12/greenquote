"use client";

import { useEffect, useMemo, useState } from "react";

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadQuotes() {
      const response = await fetch(
        "/api/admin/quotes"
      );

      const data = await response.json();

      setQuotes(data);
      setLoading(false);
    }

    loadQuotes();
  }, []);

  const filteredQuotes = useMemo(() => {
    if (!search.trim()) {
      return quotes;
    }

    const searchTerm =
      search.toLowerCase();

    return quotes.filter((quote) => {
      const fullName =
        quote.user?.fullName?.toLowerCase() ??
        "";

      const email =
        quote.user?.email?.toLowerCase() ??
        "";

      return (
        fullName.includes(searchTerm) ||
        email.includes(searchTerm)
      );
    });
  }, [quotes, search]);

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
          Admin Quotes
        </h1>

        <p className="mt-2 text-gray-600">
          View and search quotes across all
          users.
        </p>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by user name or email..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded border p-3"
        />
      </div>

      {filteredQuotes.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p>No quotes found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuotes.map((quote) => (
            <div
              key={quote.id}
              className="rounded-lg border bg-white p-5 shadow-sm"
            >
              <div className="mb-4">
                <h2 className="font-semibold">
                  {quote.address}
                </h2>

                <p className="text-sm text-gray-500">
                  {new Date(
                    quote.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="mb-4 rounded bg-gray-50 p-3">
                <p className="font-medium">
                  {quote.user?.fullName}
                </p>

                <p className="text-sm text-gray-600">
                  {quote.user?.email}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <strong>
                    Risk Band:
                  </strong>{" "}
                  {quote.riskBand}
                </p>

                <p>
                  <strong>
                    System Price:
                  </strong>{" "}
                  $
                  {quote.systemPrice.toLocaleString()}
                </p>

                <p>
                  <strong>
                    System Size:
                  </strong>{" "}
                  {quote.systemSizeKw} kW
                </p>

                <p>
                  <strong>
                    Consumption:
                  </strong>{" "}
                  {
                    quote.monthlyConsumptionKwh
                  }{" "}
                  kWh
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}