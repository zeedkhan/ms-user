-- CreateTable
CREATE TABLE "AIChatRoom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "messages" JSONB[],

    CONSTRAINT "AIChatRoom_pkey" PRIMARY KEY ("id")
);
