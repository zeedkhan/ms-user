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
    getStorageFileId,
    getUserStorageWithNoDirectory,
    deleteFileStorage
} = require("../controller/user.controller");

const {
    createUserSchema,
    signInSchema,
    UpdateSchema,
    avatarSchema,
    uploadToStorageSchema,
    createDirectorySchema,
    moveStorageSchema,
    moveDirectorySchema
} = require("../validator/index");
const { getDirectory, createDirectory, getUserDirectory, updateDirectoryName, moveStorage, searchDirectoryAndStorage, moveDirectory, search, removeDirectory } = require("../controller/directory.controller");


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

// move storage
// add user storage file
// get storage file with no directory
// search directory and storage
UserRouter.post("/storage/:id", validator.body(uploadToStorageSchema), uploadUserFile);
UserRouter.get("/storage/:userId", getUserStorage);
UserRouter.get("/storage/file/:fileId", getStorageFileId);
UserRouter.delete("/storage/file/:fileId", deleteFileStorage);
UserRouter.get("/storage/no-directory/:userId", getUserStorageWithNoDirectory);

// get a directory
// create a new directory
// user directory
// update directory name
UserRouter.get("/directory/:directoryId", getDirectory);
UserRouter.delete("/directory/:directoryId", removeDirectory);
UserRouter.post("/directory", validator.body(createDirectorySchema), createDirectory);
UserRouter.get("/directory/user/:userId", getUserDirectory);
UserRouter.put("/directory/:directoryId", updateDirectoryName);

// Search
UserRouter.get("/search/object", search)
UserRouter.get("/search/object/:searchTerm", searchDirectoryAndStorage);

// move object
UserRouter.put("/move/storage", validator.body(moveStorageSchema), moveStorage);
UserRouter.put("/move/directory", validator.body(moveDirectorySchema), moveDirectory);


module.exports = UserRouter