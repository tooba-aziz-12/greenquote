import { PrismaClient } from "@prisma/client";
import { QuoteRepository } from "./quote.repository";

const prisma = new PrismaClient();

describe("QuoteRepository Integration", () => {
  let userId: string;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        fullName: "Integration Test User",
        email: `integration-${Date.now()}@test.com`,
        passwordHash: "hash",
      },
    });

    userId = user.id;
  });

  afterAll(async () => {
    await prisma.quote.deleteMany({
      where: {
        userId,
      },
    });

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    await prisma.$disconnect();
  });

  it("should create and retrieve a quote", async () => {
    const repository = new QuoteRepository();

    const createdQuote =
      await repository.create({
        userId,
        address: "Berlin",
        monthlyConsumptionKwh: 500,
        systemSizeKw: 5,
        downPayment: 1000,
        systemPrice: 6000,
        principalAmount: 5000,
        riskBand: "A",
        offers: [
          {
            termYears: 5,
            apr: 6.9,
            monthlyPayment: 98.77,
          },
        ],
      });

    const retrievedQuote =
      await repository.findById(
        createdQuote.id
      );

    expect(retrievedQuote).not.toBeNull();

    expect(
      retrievedQuote?.address
    ).toBe("Berlin");

    expect(
      retrievedQuote?.riskBand
    ).toBe("A");
  });
});