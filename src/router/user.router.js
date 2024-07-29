const { Router } = require("express");
const validator = require('express-joi-validation').createValidator({});

const {
    getAllUsers,
    createUser,
    signIn,
    getUser,
    editUser,
    updateUserAvatar,
    uploadUserFile,
    getUserStorage,
    getFileId
} = require("../controller/user.controller");

const {
    createUserSchema,
    signInSchema,
    UpdateSchema,
    avatarSchema,
    uploadToStorageSchema
} = require("../validator/index");


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

// to update user avatar
// 1: User will upload the image directly to the upload service
// 2: the upload service will return the path of the image
// 3: the user will send the path to the user service
UserRouter.put("/avatar/:id", validator.body(avatarSchema), updateUserAvatar);

// add user storage file
UserRouter.post("/storage/:id", validator.body(uploadToStorageSchema), uploadUserFile);

UserRouter.get("/storage/:id", getUserStorage);

UserRouter.get("/storage/file/:fileId", getFileId);


module.exports = UserRouter