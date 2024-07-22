const prisma = require("../../prisma/prisma")
const { getVerificationTokenByEmail } = require("../lib/verificationToken")
const { v4 } = require("uuid");

const getResetPasswordTokenById = async (tokenId) => {
    if (!tokenId) {
        return { error: "Missing Token Id" }
    }

    const token = await prisma.passwordResetToken.findUnique({
        where: {
            id: tokenId
        }
    });

    if (!token) {
        return {
            error: "Token Id not found"
        }
    };

    return {
        success: "Found token",
        token: token
    }
}


const getPasswordResetTokenByToken = async (token) => {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
        });

        return passwordResetToken;
    } catch (error) {
        console.error(error)
        return null;
    }
};

const getPasswordResetTokenByEmail = async (email) => {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findFirst({
            where: { email },
        });

        return passwordResetToken;
    } catch (error) {
        console.error(error)
        return null;
    }
};

const generatePasswordResetToken = async (email) => {
    const token = v4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
        await prisma.passwordResetToken.delete({
            where: {
                id: existingToken.id,
            },
        });
    }

    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    console.log("passwordResetToken", passwordResetToken)

    return passwordResetToken;
};

const generateVerificationToken = async (email) => {
    const token = v4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await prisma.verificationToken.delete({
            where: {
                id: existingToken.id,
            },
        });
    }

    const verificationToken = await prisma.verificationToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    return verificationToken;
};


module.exports = {
    getPasswordResetTokenByEmail,
    getPasswordResetTokenByToken,
    generatePasswordResetToken,
    generateVerificationToken,
    getResetPasswordTokenById
}