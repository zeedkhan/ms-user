const prisma = require("../../prisma/prisma");

const updateChat = async (req, res) => {
    const { roomId } = req.params;
    const body = req.body;
    const room = await prisma.aIChatRoom.update({
        where: {
            id: roomId
        },
        data: {
            ...body
        }
    })
}

const getUserChat = async (req, res) => {
    const { userId } = req.params;
    const rooms = await prisma.aIChatRoom.findMany({
        orderBy: {
            updatedAt: 'desc'
        },
        where: {
            users: {
                some: {
                    userId: userId
                }
            },
        }
    });
    return res.json({ rooms }).status(200);
};

const getAIChatRoom = async (req, res) => {
    const { roomId } = req.params;
    const room = await prisma.aIChatRoom.findUnique({
        where: {
            id: roomId
        },
        include: {
            users: true
        }
    });
    return res.json({ room }).status(200);
}

const createAIChatRoom = async (req, res) => {
    const { name, userIds } = req.body;
    try {
        const room = await prisma.aIChatRoom.create({
            data: {
                name: name,
                users: {
                    create: userIds.map((userId) => ({
                        user: {
                            connect: { id: userId }
                        }
                    }))
                }
            },
            include: {
                users: true,
            }
        });
        return res.status(200).json({ room });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to create chat room" });
    }
};

const updateAIChatRoom = async (req, res) => {
    const { roomId } = req.params;
    const { message, avatar, name } = req.body;

    const payload = {};
    if (message) {
        payload.messages = {
            push: message
        }
    }
    if (avatar) {
        payload.avatar = avatar;
    }
    if (name) {
        payload.name = name;
    }

    try {
        const room = await prisma.aIChatRoom.update({
            where: {
                id: roomId
            },
            data: payload
        });
        return res.status(200).json({ room });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to update chat room" });
    }
};

const deleteAIChatRoom = async (req, res) => {
    const { roomId } = req.params;
    try {
        await prisma.aIChatRoom.delete({
            where: { id: roomId },
        });
        return res.status(200).json({ message: "Room deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to delete chat room" });
    }
};

module.exports = {
    updateChat,
    getUserChat,
    getAIChatRoom,
    deleteAIChatRoom,
    updateAIChatRoom,
    createAIChatRoom
}