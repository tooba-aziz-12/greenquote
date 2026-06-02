"use client";

import { useState } from "react";

export default function QuotePage() {
  const [address, setAddress] = useState("");
  const [monthlyConsumptionKwh, setMonthlyConsumptionKwh] = useState("");
  const [systemSizeKw, setSystemSizeKw] = useState("");
  const [downPayment, setDownPayment] = useState("");

  const [quote, setQuote] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    const response = await fetch("/api/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        monthlyConsumptionKwh: Number(monthlyConsumptionKwh),
        systemSizeKw: Number(systemSizeKw),
        downPayment: Number(downPayment),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Failed to generate quote");
      return;
    }

    setQuote(data);
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Solar Quote</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full rounded border p-2"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          className="w-full rounded border p-2"
          type="number"
          placeholder="Monthly Consumption (kWh)"
          value={monthlyConsumptionKwh}
          onChange={(e) => setMonthlyConsumptionKwh(e.target.value)}
        />

        <input
          className="w-full rounded border p-2"
          type="number"
          placeholder="System Size (kW)"
          value={systemSizeKw}
          onChange={(e) => setSystemSizeKw(e.target.value)}
        />

        <input
          className="w-full rounded border p-2"
          type="number"
          placeholder="Down Payment"
          value={downPayment}
          onChange={(e) => setDownPayment(e.target.value)}
        />

        <button
          type="submit"
          className="w-full rounded bg-black p-2 text-white"
        >
          Generate Quote
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {quote && (
        <div className="mt-8 rounded border p-4">
          <h2 className="mb-4 text-xl font-bold">Quote Result</h2>

          <p>
            <strong>System Price:</strong> ${quote.systemPrice}
          </p>

          <p>
            <strong>Principal Amount:</strong> ${quote.principalAmount}
          </p>

          <p>
            <strong>Risk Band:</strong> {quote.riskBand}
          </p>

          <div className="mt-4">
            <h3 className="mb-2 font-semibold">Loan Offers</h3>

            {quote.offers.map((offer: any, index: number) => (
              <div key={index} className="mb-2 rounded border p-2">
                <p>{offer.termYears} Year Loan</p>

                <p>APR: {offer.apr}%</p>

                <p>Monthly Payment: ${offer.monthlyPayment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
