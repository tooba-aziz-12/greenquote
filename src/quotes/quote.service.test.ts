import { QuoteService } from "./quote.service";

describe("QuoteService", () => {
  const service = new QuoteService();

  it("should generate an A risk quote", () => {
    const result = service.generateQuote({
      address: "Berlin",
      monthlyConsumptionKwh: 500,
      systemSizeKw: 5,
      downPayment: 1000,
    });

    expect(result.systemPrice).toBe(6000);
    expect(result.principalAmount).toBe(5000);
    expect(result.riskBand).toBe("A");
    expect(result.offers).toHaveLength(3);
  });

  it("should generate a B risk quote", () => {
    const result = service.generateQuote({
      address: "Berlin",
      monthlyConsumptionKwh: 300,
      systemSizeKw: 8,
      downPayment: 1000,
    });

    expect(result.riskBand).toBe("B");
  });

  it("should generate a C risk quote", () => {
    const result = service.generateQuote({
      address: "Berlin",
      monthlyConsumptionKwh: 100,
      systemSizeKw: 5,
      downPayment: 1000,
    });

    expect(result.riskBand).toBe("C");
  });

  it("should calculate principal correctly", () => {
    const result = service.generateQuote({
      address: "Berlin",
      monthlyConsumptionKwh: 500,
      systemSizeKw: 10,
      downPayment: 2000,
    });

    expect(result.systemPrice).toBe(12000);
    expect(result.principalAmount).toBe(10000);
  });
});