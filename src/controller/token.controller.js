const prisma = require("../../prisma/prisma");
const { sendPasswordResetEmail, sendVerificationEmail } = require("../lib/mail");
const { newVerification } = require("../lib/newVerification");
const { generateVerificationToken, generatePasswordResetToken, getResetPasswordTokenById } = require("../lib/resetPassword");
const { existingUser } = require("../lib/userHelper");
const { getVerificationTokenByToken } = require("../lib/verificationToken");


const getTokenById = async (req, res) => {
    const tokenId = req.params.tokenId;

    if (!tokenId) {
        return res.json({ error: "Token missing" }).status(401)
    }

    try {
        const token = await getVerificationTokenByToken(tokenId);

        if (!token) {
            return res.json({ error: "Token not found" }).status(404)
        }

        return res.json(token).status(200)
    } catch (err) {
        console.error(err);
        return res.json({ error: "Error get token" }).status(500)
    }

}

// Retreive token
const verifyEmail = async (req, res) => {
    const tokenId = req.params.tokenId;
    if (!tokenId) {
        return res.json({ error: "Token missing" }).status(401)
    }
    const token = await newVerification(tokenId)

    if (token.error) {
        return res.json({ error: token.error }).status(401)
    }

    if (token.success) {
        return res.json({ success: token.success }).status(201)
    }

    return res.json({error: "Something went wrong!"})
}

const getAllVerifyToken = async (req, res) => {
    const verifications = await prisma.verificationToken.findMany();
    const resetPassword = await prisma.passwordResetToken.findMany();
    return res.json({ verifyToken: {
        verifications,
        resetPassword
    } }).status(200)
}

const createVerificationToken = async (req, res) => {
    const { email, domain } = req.body
    try {
        const user = await existingUser(email);
        if (!user) {
            return res.json({ error: "User not found" }).status(404)
        }
        const token = await generateVerificationToken(email);
        await sendVerificationEmail(domain, email, token.id)
        return res.json(token).status(201)
    } catch (err) {
        console.error(err)
        return res.json({ error: "Error creating verification token" }).status(500)
    }
}

const createResetPasswordToken = async (req, res) => {

    const { email, domain } = req.body
    const user = await existingUser(email);

    if (!user) {
        return res.json({ error: "Email not found!" }).status(404)
    }
    
    const resetPasswordToken = await generatePasswordResetToken(email);

    await sendPasswordResetEmail(domain, email, resetPasswordToken.id)


    return res.json({
        success: "Sent reset password",
        token: resetPasswordToken
    }).status(200)
}


const getAllPasswordResetToken = async (req, res) => {
    const tokens = await prisma.passwordResetToken.findMany();
    return res.json(tokens).status(200)
}


const getResetPasswordTokenByIdRoute = async (req, res) => {
    const tokenId = req.params.tokenId;
    if (!tokenId) {
        return res.json({error: "Missing Token Id"})
    }

    const token = await getResetPasswordTokenById(tokenId);
    
    return res.json(token)
}



module.exports = {
    createResetPasswordToken,
    getAllPasswordResetToken,
    verifyEmail,
    getAllVerifyToken,
    createVerificationToken,
    getTokenById,
    getResetPasswordTokenByIdRoute
}