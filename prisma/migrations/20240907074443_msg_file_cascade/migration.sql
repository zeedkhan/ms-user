-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_messageId_fkey";

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
