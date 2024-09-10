-- DropForeignKey
ALTER TABLE "AIChatRoomUser" DROP CONSTRAINT "AIChatRoomUser_roomId_fkey";

-- DropForeignKey
ALTER TABLE "AIChatRoomUser" DROP CONSTRAINT "AIChatRoomUser_userId_fkey";

-- AddForeignKey
ALTER TABLE "AIChatRoomUser" ADD CONSTRAINT "AIChatRoomUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIChatRoomUser" ADD CONSTRAINT "AIChatRoomUser_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "AIChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
