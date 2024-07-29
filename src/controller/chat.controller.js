const prisma = require("../../prisma/prisma");


const getAllChatRooms = async (req, res) => {
    const rooms = await prisma.roomUser.findMany();
    return res.json({ rooms }).status(200);
}

const getChatRoom = async (req, res) => {
    const { roomId } = req.params;
    try {
        const room = await prisma.room.findUnique({
            where: {
                id: roomId
            },
            include: {
                users: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                email: true,
                            }
                        },
                    }
                },
                messages: {
                    include: {
                        files: true,
                    }
                }
            },
        });
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        return res.status(200).json({ room });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// get user's chat room
const getUserChatRoom = async (req, res) => {
    const { userId } = req.params;
    const rooms = await prisma.room.findMany({
        orderBy: {
            updatedAt: 'desc'
        },
        where: {
            users: {
                some: {
                    userId: userId
                }
            },
        },
        include: {
            messages: true,
            users: {
                select: {
                    userId: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            email: true
                        }
                    }
                },
            }
        }
    })
    return res.json({ rooms }).status(200);
}

const createChatRoom = async (req, res) => {
    const { name, userIds } = req.body;

    try {
        const room = await prisma.room.create({
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

// Delete chat room
const deleteChatRoom = async (req, res) => {
    const { roomId } = req.params;
    const room = await prisma.room.delete({
        where: {
            id: roomId
        }
    });
    return res.json({ room }).status(200);
}

const createMessageFiles = async (
    { text, userId, chatRoomId, type, files }
) => {
    const msg = await prisma.message.create({
        data: {
            text: "",
            userId: userId,
            chatRoomId: chatRoomId,
            type: "FILE",
            files: {
                create: files
            }
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    id: true
                }
            },
            files: {
                select: {
                    name: true,
                    size: true,
                    key: true,
                    url: true,
                    createdAt: true
                }
            }
        }
    });
    return msg
}

const createMessageText = async ({ text, userId, chatRoomId, type }) => {
    const msg = await prisma.message.create({
        data: {
            text: text,
            userId: userId,
            chatRoomId: chatRoomId,
            type: type,
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    id: true
                }
            }
        }
    });

    const updateRoom = await prisma.room.update({
        where: {
            id: chatRoomId,
        },
        data: {
            updatedAt: new Date()
        }
    })

    return msg
}

const createMessage = async (req, res) => {
    const payload = req.body;
    try {
        let msg;
        if (payload.type === "FILE" && payload.files) {
            msg = await createMessageFiles({
                text: payload.text,
                userId: payload.userId,
                chatRoomId: payload.chatRoomId,
                type: payload.type,
                files: payload.files
            });
        } else {
            msg = await createMessageText({
                text: payload.text,
                userId: payload.userId,
                chatRoomId: payload.chatRoomId,
                type: payload.type
            });
        }

        const newPayload = {
            text: payload.text,
            type: payload.type,
            createdAt: payload.createdAt,
            id: payload.id,
            chatRoomId: payload.chatRoomId,
            userId: payload.userId,
        }

        if (payload.type === "FILE") {
            newPayload.file = payload.file;
        }

        return res.json({ message: msg }).status(200);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to create message" });
    }

}

const updateChatRoomImage = async (req, res) => {
    const { roomId } = req.params;
    const { path } = req.body;
    const room = await prisma.room.update({
        where: {
            id: roomId
        },
        data: {
            avatar: path
        }
    });
    return res.json({ room }).status(200);
}

const getUsersInChatRoom = async (req, res) => {
    const { roomId } = req.params;
    const users = await prisma.roomUser.findMany({
        where: {
            roomId: roomId
        },
    });
    return res.json({ users }).status(200);
}


module.exports = {
    createMessage,
    getAllChatRooms,
    createChatRoom,
    getChatRoom,
    getUserChatRoom,
    deleteChatRoom,
    updateChatRoomImage,
    getUsersInChatRoom
}