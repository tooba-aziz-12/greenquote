import { AuthService } from "./auth.service";

describe("AuthService", () => {
  it("should register a new user", async () => {
    const mockRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        id: "1",
        fullName: "John Doe",
        email: "john@test.com",
      }),
    };

    const service = new AuthService(
      mockRepository as any
    );

    const result = await service.register(
      "John Doe",
      "john@test.com",
      "password123"
    );

    expect(
      mockRepository.findByEmail
    ).toHaveBeenCalledWith(
      "john@test.com"
    );

    expect(
      mockRepository.create
    ).toHaveBeenCalled();

    expect(result.email).toBe(
      "john@test.com"
    );
  });

  it("should reject duplicate emails", async () => {
    const mockRepository = {
      findByEmail: jest
        .fn()
        .mockResolvedValue({
          id: "1",
        }),
      create: jest.fn(),
    };

    const service = new AuthService(
      mockRepository as any
    );

    await expect(
      service.register(
        "John Doe",
        "john@test.com",
        "password123"
      )
    ).rejects.toThrow(
      "Email already exists"
    );
  });

  it("should login successfully", async () => {
    const passwordHash =
      await require("bcryptjs").hash(
        "password123",
        10
      );

    const mockRepository = {
      findByEmail: jest
        .fn()
        .mockResolvedValue({
          id: "1",
          email: "john@test.com",
          passwordHash,
        }),
    };

    const service = new AuthService(
      mockRepository as any
    );

    const result =
      await service.login(
        "john@test.com",
        "password123"
      );

    expect(result).not.toBeNull();
  });

  it("should reject invalid password", async () => {
    const passwordHash =
      await require("bcryptjs").hash(
        "password123",
        10
      );

    const mockRepository = {
      findByEmail: jest
        .fn()
        .mockResolvedValue({
          id: "1",
          email: "john@test.com",
          passwordHash,
        }),
    };

    const service = new AuthService(
      mockRepository as any
    );

    const result =
      await service.login(
        "john@test.com",
        "wrong-password"
      );

    expect(result).toBeNull();
  });
});