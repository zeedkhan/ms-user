const { Router } = require("express");
const { getAllChatRooms, getChatRoom, getUserChatRoom, createChatRoom, deleteChatRoom, createMessage, updateChatRoomImage, getUsersInChatRoom } = require("../controller/chat.controller");

const ChatRouter = Router();

// get all chat rooms
ChatRouter.get("/", getAllChatRooms);

// get chat room by id
ChatRouter.get("/:roomId", getChatRoom);

// get chat room by user id
ChatRouter.get("/user/:userId", getUserChatRoom);

// create chat room
ChatRouter.post("/", createChatRoom);

// delete chat room
ChatRouter.delete("/:roomId", deleteChatRoom);

// create a message
ChatRouter.post("/:roomId/message", createMessage);

// get chat room by user id
ChatRouter.get("/:roomId/users", getUsersInChatRoom);

// update chat room image
ChatRouter.put("/avatar/:roomId", updateChatRoomImage);


module.exports = ChatRouter