-- CreateTable
CREATE TABLE "ActiveEvent" (
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "ActiveEvent_pkey" PRIMARY KEY ("slug","isActive")
);
