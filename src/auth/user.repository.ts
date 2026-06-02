import { prisma } from "@/lib/prisma";

export class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  create(data: { fullName: string; email: string; passwordHash: string }) {
    return prisma.user.create({
      data,
    });
  }
}
