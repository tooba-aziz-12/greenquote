import { CreateQuoteRequest, QuoteResult } from "./quote.types";

export class QuoteService {
  generateQuote(request: CreateQuoteRequest): QuoteResult {
    const systemPrice = request.systemSizeKw * 1200;

    const principalAmount = systemPrice - request.downPayment;

    const riskBand = this.determineRiskBand(
      request.monthlyConsumptionKwh,
      request.systemSizeKw,
    );

    const apr = this.getAprForRiskBand(riskBand);

    return {
      systemPrice,
      principalAmount,
      riskBand,
      offers: [
        {
          termYears: 5,
          apr,
          monthlyPayment: this.calculateMonthlyPayment(principalAmount, apr, 5),
        },
        {
          termYears: 10,
          apr,
          monthlyPayment: this.calculateMonthlyPayment(
            principalAmount,
            apr,
            10,
          ),
        },
        {
          termYears: 15,
          apr,
          monthlyPayment: this.calculateMonthlyPayment(
            principalAmount,
            apr,
            15,
          ),
        },
      ],
    };
  }
  private determineRiskBand(
    monthlyConsumptionKwh: number,
    systemSizeKw: number,
  ): "A" | "B" | "C" {
    if (monthlyConsumptionKwh >= 400 && systemSizeKw <= 6) {
      return "A";
    }

    if (monthlyConsumptionKwh >= 250) {
      return "B";
    }

    return "C";
  }

  private getAprForRiskBand(riskBand: "A" | "B" | "C"): number {
    switch (riskBand) {
      case "A":
        return 6.9;

      case "B":
        return 8.9;

      case "C":
        return 11.9;
    }
  }

  private calculateMonthlyPayment(
    principal: number,
    apr: number,
    termYears: number,
  ): number {
    const monthlyRate = apr / 100 / 12;

    const numberOfPayments = termYears * 12;

    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    return Number(monthlyPayment.toFixed(2));
  }
}
