/*
  Warnings:

  - A unique constraint covering the columns `[slug,eventCreatorId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_eventCreatorId_key" ON "Event"("slug", "eventCreatorId");
