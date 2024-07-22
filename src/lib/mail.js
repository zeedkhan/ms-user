const { Resend } = require("resend");
const dotenv = require("dotenv");

dotenv.config();

const resend = new Resend(process.env.RESEND_API);

const sendVerificationEmail = async (domain, email, token) => {
    if (!token) {
        return {
            error: "Missing token"
        }
    }

    if (!email) {
        return {
            error: "Missing email"
        }
    }

    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your email",
        html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
    });
}

const sendPasswordResetEmail = async (domain, email, token) => {
    const resetLink = `${domain}/auth/new-password?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
    });
};



module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
}