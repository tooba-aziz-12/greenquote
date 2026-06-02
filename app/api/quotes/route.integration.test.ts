import { PrismaClient } from "@prisma/client";

import { POST } from "./route";

jest.mock("@/auth/auth", () => ({
  auth: jest.fn(),
}));

const { auth } = require("@/auth/auth");

const prisma = new PrismaClient();

describe("POST /api/quotes", () => {
  let userId: string;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        fullName: "Route Test User",
        email: `route-${Date.now()}@test.com`,
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

  it("should create a quote", async () => {
    auth.mockResolvedValue({
      user: {
        id: userId,
      },
    });

    const request = new Request(
      "http://localhost:3000/api/quotes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: "Berlin",
          monthlyConsumptionKwh: 500,
          systemSizeKw: 5,
          downPayment: 1000,
        }),
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(201);

    const body = await response.json();

    expect(body.address).toBe("Berlin");

    expect(body.riskBand).toBe("A");

    const quoteInDatabase =
      await prisma.quote.findUnique({
        where: {
          id: body.id,
        },
      });

    expect(quoteInDatabase).not.toBeNull();
  });
});