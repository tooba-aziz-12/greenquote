import { notFound } from "next/navigation";

import { auth } from "@/auth/auth";
import { QuoteRepository } from "@/quotes/quote.repository";

type QuotePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function QuoteDetailsPage({
  params,
}: QuotePageProps) {
  const session = await auth();

  if (!session?.user) {
    notFound();
  }

  const { id } = await params;

  const quoteRepository =
    new QuoteRepository();

  const quote =
    await quoteRepository.findById(id);

  if (
    !quote ||
    quote.userId !== session.user.id
  ) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-4xl font-bold">
        Quote Details
      </h1>

      <div className="rounded-lg border p-6 shadow-sm">
        <div className="space-y-2">
          <p>
            <strong>Address:</strong>{" "}
            {quote.address}
          </p>

          <p>
            <strong>System Price:</strong> $
            {quote.systemPrice.toLocaleString()}
          </p>

          <p>
            <strong>Principal Amount:</strong> $
            {quote.principalAmount.toLocaleString()}
          </p>

          <p>
            <strong>Risk Band:</strong>{" "}
            {quote.riskBand}
          </p>

          <p>
            <strong>
              Monthly Consumption:
            </strong>{" "}
            {quote.monthlyConsumptionKwh} kWh
          </p>

          <p>
            <strong>System Size:</strong>{" "}
            {quote.systemSizeKw} kW
          </p>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">
            Loan Offers
          </h2>

          <div className="space-y-4">
            {quote.offers.map(
              (offer, index) => (
                <div
                  key={index}
                  className="rounded border p-4"
                >
                  <p>
                    <strong>
                      {offer.termYears}
                      -Year Loan
                    </strong>
                  </p>

                  <p>
                    APR: {offer.apr}%
                  </p>

                  <p>
                    Monthly Payment: $
                    {
                      offer.monthlyPayment
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
}