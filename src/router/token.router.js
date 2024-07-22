const { Router } = require("express");
const { verifyEmail, getTokenById, getAllVerifyToken, createVerificationToken, createResetPasswordToken, getAllPasswordResetToken } = require("../controller/token.controller");
const validator = require('express-joi-validation').createValidator({});
const { ResetSchema } = require("../validator/index")

const TokenRouter = Router();

// TokenRouter.use
TokenRouter.get("/", getAllVerifyToken);
// Verify email
TokenRouter.put('/:tokenId', verifyEmail);

TokenRouter.get("/:tokenId", getTokenById);

// create a verification email 
TokenRouter.post("/", validator.body(ResetSchema), createVerificationToken);



module.exports = TokenRouter