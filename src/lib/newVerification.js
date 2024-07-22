const prisma = require("../../prisma/prisma");
const { existingUser } = require("./userHelper");
const { getVerificationTokenByToken } = require("../lib/verificationToken")


const newVerification = async (token) => {
  const existingToken = await getVerificationTokenByToken(token);

  console.log(existingToken)

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const user = await existingUser(existingToken.email);

  if (!user) {
    return { error: "Email does not exist" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await prisma.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified!" };
};


module.exports = {
  newVerification
}