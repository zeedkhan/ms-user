const prisma = require("../../prisma/prisma");
const { deleteFileStorageAndDisconnectDirectory } = require("./user.controller");

const getDirectory = async (req, res) => {
    const { directoryId } = req.params;
    try {
        const directory = await prisma.directory.findUnique({
            where: {
                id: directoryId
            },
            include: {
                children: true,
                files: true
            }
        });

        return res.status(200).json({ data: directory });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getUserDirectory = async (req, res) => {
    const { userId } = req.params;
    const { withParent } = req.query;
    if (withParent === "false") {
        try {
            console.log("Not with parent");
            const directories = await prisma.directory.findMany({
                where: {
                    userId: userId,
                    parentId: null
                }
            });

            return res.status(200).json({ data: directories });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }


    try {
        const directories = await prisma.directory.findMany({
            where: {
                userId: userId
            }
        });

        return res.status(200).json({ data: directories });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * 
 * @param {*} req 
 * - @name
 * @param {*} res 
 */
const createDirectory = async (req, res) => {
    const { name, userId, parentId } = req.body;
    try {
        const createDirectory = await prisma.directory.create({
            data: {
                name: name,
                userId: userId,
                parentId: parentId || null
            }
        });
        return res.status(201).json({ data: createDirectory });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateDirectoryName = async (req, res) => {
    const { directoryId } = req.params;
    const { name } = req.body;
    try {
        const updateDirectory = await prisma.directory.update({
            where: {
                id: directoryId
            },
            data: {
                name: name
            }
        });
        return res.status(201).json({ data: updateDirectory });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const moveStorage = async (req, res) => {
    const { directoryId, ids } = req.body;
    try {
        const request = await prisma.storage.updateMany({
            where: {
                id: {
                    in: ids
                }
            },
            data: {
                directoryId: directoryId
            }
        })

        return res.status(201).json({ data: request });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const moveDirectory = async (req, res) => {
    const { directoryId, ids } = req.body;
    try {
        const request = await prisma.directory.updateMany({
            where: {
                id: {
                    in: ids
                }
            },
            data: {
                parentId: directoryId
            }
        })

        return res.status(201).json({ data: request });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const search = async (req, res) => {
    const { q, after, type } = req.query;
    let searchParam = {};
    if (q) {
        searchParam.name = {
            contains: q,
            mode: "insensitive"
        }
    };

    if (after) {
        searchParam.updatedAt = {
            gte: new Date(after)
        }
    };

    try {
        if (type === "directory") {
            const directories = await prisma.directory.findMany({
                where: {
                    AND: [searchParam]
                }
            });
            return res.json({ directories: directories, fiels: [] });
        };

        const directories = await prisma.directory.findMany({
            where: {
                AND: [searchParam]
            }
        });
        const files = await prisma.storage.findMany({
            where: {
                AND: [searchParam]
            }
        });

        return res.json({ directories: directories, files: files });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const searchDirectoryAndStorage = async (req, res) => {
    const { searchTerm } = req.params;
    console.log("searchDirectoryAndStorage", searchTerm);
    try {
        const search = await prisma.directory.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive"
                        }
                    },
                ]
            }
        });
        const searchFiles = await prisma.storage.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive"
                        }
                    },
                    {
                        url: {
                            contains: searchTerm,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });
        return res.status(200).json({ data: [...searchFiles, ...search] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const disconnectDirectory = async (parent, child) => {
    try {
        const directory = await prisma.directory.update({
            where: {
                id: parent
            },
            data: {
                children: {
                    disconnect: {
                        id: child
                    }
                }
            }
        });
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

const removeDirectoryTask = async (directoryId) => {
    try {
        const directory = await prisma.directory.findUnique({
            where: {
                id: directoryId
            },
            select: {
                children: {
                    select: {
                        id: true
                    }
                },
                files: {
                    select: {
                        id: true
                    }
                }
            }
        });
        if (!directory) {
            return res.status(404).json({ error: "Directory not found" });
        };

        if (directory.children.length > 0) {
            const allRequests = directory.children.map((child) => removeDirectoryTask(child.id));
            await Promise.all(allRequests);
        };

        if (directory.files.length > 0) {
            const allRequests = directory.files.map((file) => deleteFileStorageAndDisconnectDirectory(file.id));
            await Promise.all(allRequests);
        }

        if (directory.parentId) {
            await disconnectDirectory(directory.parentId, directoryId);
        };

        await prisma.directory.delete({
            where: {
                id: directoryId
            }
        })

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

const removeDirectory = async (req, res) => {
    const { directoryId } = req.params;
    try {
        const task = await removeDirectoryTask(directoryId);
        if (task) {
            return res.status(200).json({ success: "Directory removed" });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    search,
    getDirectory,
    moveStorage,
    moveDirectory,
    removeDirectory,
    createDirectory,
    getUserDirectory,
    updateDirectoryName,
    searchDirectoryAndStorage
}