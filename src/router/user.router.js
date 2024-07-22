const { Router } = require("express");
const validator = require('express-joi-validation').createValidator({});
const { getAllUsers, createUser, signIn, getUser, editUser, updateUserAvatar } = require("../controller/user.controller");
const { createUserSchema, signInSchema, UpdateSchema, avatarSchema } = require("../validator/index")
const UserRouter = Router();

// Get all users
UserRouter.get("/", getAllUsers);
// create new user
UserRouter.post("/", validator.body(createUserSchema), createUser)
// Edit user
UserRouter.put("/:id", validator.body(UpdateSchema), editUser)
// sign in
UserRouter.post("/signIn", validator.body(signInSchema), signIn)
// get by id or email
UserRouter.get("/:id", getUser);

UserRouter.put("/avatar/:id", validator.body(avatarSchema), updateUserAvatar)


module.exports = UserRouter