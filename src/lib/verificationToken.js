const prisma = require("../../prisma/prisma")

const getVerificationTokenByEmail = async (email) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  } catch (error) {
    console.error(error)
    return null;
  }
};

const getVerificationTokenByToken = async (tokenId) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { id: tokenId },
    });


    return verificationToken;
  } catch (error) {
    console.error(error)
    return null;
  }
};

module.exports = {
  getVerificationTokenByEmail,
  getVerificationTokenByToken
}