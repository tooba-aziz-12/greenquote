/*
  Warnings:

  - You are about to drop the column `email` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Quote` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "monthlyConsumptionKwh" REAL NOT NULL,
    "systemSizeKw" REAL NOT NULL,
    "downPayment" REAL NOT NULL DEFAULT 0,
    "systemPrice" REAL NOT NULL,
    "principalAmount" REAL NOT NULL,
    "riskBand" TEXT NOT NULL,
    "offers" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Quote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Quote" ("address", "createdAt", "downPayment", "id", "monthlyConsumptionKwh", "offers", "principalAmount", "riskBand", "systemPrice", "systemSizeKw", "updatedAt", "userId") SELECT "address", "createdAt", "downPayment", "id", "monthlyConsumptionKwh", "offers", "principalAmount", "riskBand", "systemPrice", "systemSizeKw", "updatedAt", "userId" FROM "Quote";
DROP TABLE "Quote";
ALTER TABLE "new_Quote" RENAME TO "Quote";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
