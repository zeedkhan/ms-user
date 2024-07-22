const prisma = require("../../prisma/prisma")

const existingUser = async (identifier) => {
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const payload = {};
    if (String(identifier).match(re)) {
        payload.email = identifier
    } else {
        payload.id = identifier
    }
    const user = await prisma.user.findUnique({
        where: payload,
    });


    return user;
};




module.exports = {
    existingUser
}