const express = require("express")
const cors = require("cors")
const UserRouter = require("../router/user.router");
const TokenRouter = require("../router/token.router");
const PasswordRouter = require("../router/reset.router");
const BlogRouter = require("../router/blog.router");
const ChatRouter = require("../router/chat.router");
const AIChatRouter = require("../router/aichat.router");

const createServer = () => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors())

    app.use("/user", UserRouter);
    app.use("/token", TokenRouter)
    app.use('/reset/pwd', PasswordRouter)
    app.use("/blog", BlogRouter)
    app.use("/chat", ChatRouter)
    app.use("/chat/ai", AIChatRouter)

    return app
}

module.exports = {
    createServer
}