const bcrypt = require("bcrypt");
const prisma = require("../../prisma/prisma");
const { generateVerificationToken, getResetPasswordTokenById } = require("../lib/resetPassword")
const { existingUser } = require("../lib/userHelper");
const { sendVerificationEmail } = require("../lib/mail");

const newPassword = async (req, res) => {
    const { password } = req.body

    const token = req.params.tokenId

    const existingToken = await getResetPasswordTokenById(token);

    if (!existingToken.token) {
        return res.json({ error: "Invalid token" })
    }
    console.log(existingToken)
    const user = await existingUser(existingToken.token.email);

    if (!user) {
        return res.json({ error: "User not found" });
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return res.json({ error: "Token has expired!" })
    }

    await prisma.passwordResetToken.delete({
        where: { id: existingToken.token.id },
    });

    const hashedPassword = await bcrypt.hash(password, 10)

    const updateUser = await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            password: hashedPassword
        },
    });


    return res.json({ success: "Update password successfully" }).status(202)
};


const createUser = async (req, res) => {
    const body = req.body;
    if (!body) {
        res.json({ error: "Missing parameter" }).status(400)
        return;
    }

    const { email, domain, name, } = req.body

    try {
        const checkUser = await existingUser(email);
        if (!checkUser) {
            const hashPassword = await bcrypt.hash(req.body.password, 10)

            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashPassword
                }
            });

            const verificationToken = await generateVerificationToken(email);
            await sendVerificationEmail(domain, email, verificationToken.id)

            res.json({
                success: "Email confirmation sent"
            }).status(201)

        } else {
            res.json({ error: "User existing" }).status(401)
        }
    } catch (error) {
        console.error(error)
        res.json({ error: String(error) }).status(400)

    }
}

const signIn = async (req, res) => {
    const { email, password } = req.body;

    const user = await existingUser(email);

    if (!user) {
        return res.json({ error: "User not found" }).status(200)
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.json({ error: "Password did not match" }).status(401)
    }

    delete user.password

    return res.json({ success: user }).status(200);
}

const getUser = async (req, res) => {
    const id = req.params.id;
    const user = await existingUser(id);

    if (user) {
        delete user.password
    }

    res.json(user).status(200)
}

const editUser = async (req, res) => {
    const id = req.params.id;
    const user = await existingUser(id);
    const { name } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                name: name
            }
        });
        delete updatedUser.password;
        return res.json({
            success: "User updated"
        }).status(201)
    } catch (err) {
        console.error(err);
        return res.json({
            error: "Something went wrong!"
        }).status(400)
    }
}


const updateUserAvatar = async (req, res) => {
    const id = req.params.id;
    const user = await existingUser(id);
    const { path } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                image: path
            }
        });
        delete updatedUser.password;

        console.log(updatedUser);

        return res.json({
            success: "User updated"
        }).status(201)
    } catch (err) {
        console.error(err);
        return res.json({
            error: "Something went wrong!"
        }).status(400)
    }
}


const getAllUsers = async (req, res) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
        }
    });
    res.json({ data: users }).status(200)
}


const uploadUserFile = async (req, res) => {
    const { userId, name, size, key, url } = req.body;
    const uploadFile = await prisma.storage.create({
        data: {
            name: name,
            size: size,
            key: key,
            url: url,
            user: {
                connect: {
                    id: userId
                }
            }
        }
    });
    res.json({ data: uploadFile }).status(200)
}

const getUserStorage = async (req, res) => {
    const userId = req.params.id;
    const userStorage = await prisma.storage.findMany({
        where: {
            userId: userId
        }
    });
    res.json({ data: userStorage }).status(200)
}

const getFileId = async (req, res) => {
    const fileId = req.params.fileId;
    const file = await prisma.storage.findUnique({
        where: {
            id: fileId
        }
    });
    res.json({ data: file }).status(200)
}

module.exports = {
    editUser,
    createUser,
    getAllUsers,
    signIn,
    getUser,
    newPassword,
    updateUserAvatar,
    uploadUserFile,
    getUserStorage,
    getFileId
}