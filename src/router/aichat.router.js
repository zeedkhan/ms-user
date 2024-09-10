const { Router } = require("express");
const { getUserChat, createAIChatRoom, updateAIChatRoom, getAIChatRoom, deleteAIChatRoom } = require("../controller/aichat.controller");
const AIChatRouter = Router();


AIChatRouter.get("/user/:userId", getUserChat);
AIChatRouter.post("/", createAIChatRoom);
AIChatRouter.put("/:roomId", updateAIChatRoom);
AIChatRouter.get("/:roomId", getAIChatRoom);
AIChatRouter.delete("/:roomId", deleteAIChatRoom);

module.exports = AIChatRouter