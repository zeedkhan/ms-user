const { Router } = require("express");
const { createResetPasswordToken, getAllPasswordResetToken, getResetPasswordTokenByIdRoute } = require("../controller/token.controller");
const validator = require('express-joi-validation').createValidator({});
const { ResetSchema, NewPasswordSchema } = require("../validator/index");
const { newPassword } = require("../controller/user.controller");


const PasswordRouter = Router();
// create reset password token
PasswordRouter.post("/", validator.body(ResetSchema), createResetPasswordToken)
// get all password reset tokens
PasswordRouter.get("/", getAllPasswordResetToken)

// Reset password by user id
PasswordRouter.put("/:tokenId", validator.body(NewPasswordSchema), newPassword);

PasswordRouter.get("/:tokenId", getResetPasswordTokenByIdRoute)


module.exports = PasswordRouter