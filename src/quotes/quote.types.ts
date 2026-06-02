export interface CreateQuoteRequest {
  address: string;
  monthlyConsumptionKwh: number;
  systemSizeKw: number;
  downPayment: number;
}

export interface LoanOffer {
  termYears: number;
  apr: number;
  monthlyPayment: number;
}

export interface QuoteResult {
  systemPrice: number;
  principalAmount: number;
  riskBand: "A" | "B" | "C";
  offers: LoanOffer[];
}

export interface StoredQuote extends QuoteResult {
  id: string;
  userId: string;
  address: string;
  monthlyConsumptionKwh: number;
  systemSizeKw: number;
  downPayment: number;
  createdAt: Date;
}
