import { prisma } from "@/lib/prisma";

export class QuoteRepository {
  create(data: any) {
    return prisma.quote.create({
      data,
    });
  }

  findById(id: string) {
    return prisma.quote.findUnique({
      where: { id },
    });
  }

  findByUserId(userId: string) {
    return prisma.quote.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  findAll() {
    return prisma.quote.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
