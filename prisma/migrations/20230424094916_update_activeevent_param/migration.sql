/*
  Warnings:

  - You are about to drop the `ActiveEvent` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug,isActive]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
DROP TABLE "ActiveEvent";

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_isActive_key" ON "Event"("slug", "isActive");
