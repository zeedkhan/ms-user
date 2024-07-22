/*
  Warnings:

  - A unique constraint covering the columns `[seoPath]` on the table `Blog` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Blog" ALTER COLUMN "seoPath" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Blog_seoPath_key" ON "Blog"("seoPath");
