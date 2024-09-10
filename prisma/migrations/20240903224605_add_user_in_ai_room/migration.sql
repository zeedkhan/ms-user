-- CreateTable
CREATE TABLE "AIChatRoomUser" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "AIChatRoomUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AIChatRoomUser_userId_roomId_key" ON "AIChatRoomUser"("userId", "roomId");

-- AddForeignKey
ALTER TABLE "AIChatRoomUser" ADD CONSTRAINT "AIChatRoomUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIChatRoomUser" ADD CONSTRAINT "AIChatRoomUser_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "AIChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
