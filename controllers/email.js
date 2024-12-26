import nodemailer from "nodemailer";
import { google } from "googleapis";

// OAuth2 Configuration
const oAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://misc-api-three.vercel.app/email/send"
);


oAuth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN, // Refresh token generated
});

export const sendEmail = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if ((name == null || !name) || (email == null || !email) || (subject == null || !subject) || (message == null || !message)) {
            return res.status(500).json({ isError: true, error: 2, message: "Fill All Forms" });
        }

        if (email.length < 8) {
            return res.status(500).json({ isError: true, error: 3, message: "Email Too Short" });
        }

        if (message.length < 8) {
            return res.status(500).json({ isError: true, error: 4, message: "Message Too Short" });
        }

        // Get a new access token using the refresh token
        const accessToken = await oAuth2Client.getAccessToken();

        console.log("Access Token:", accessToken.token);

        /* SEND EMAIL WITH NODEMAILER */
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_ADDRESS,
                clientId: process.env.OAUTH_CLIENT_ID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
                accessToken: accessToken.token
            }
        });

        const mailOptions = {
            from: email,
            replyTo: email,
            to: "alantomaz.dev@gmail.com",
            subject: `Contato de ${name} - ${subject}`,
            text: `
            Você recebeu uma mensagem de contato.

            Nome: ${name}
            E-mail: ${email}
            Assunto: ${subject}
        
            Mensagem:
            ${message}
            `
        };

        transporter.sendMail(mailOptions, (error, data) => {
            if (error) {
                console.log("Error sending email: ", error)
                return res.status(500).json({ isError: true, error: 5, message: "Error in Email Sent" });
            }

            console.log("Message sent: %s", data.messageId);
            res.status(200).json({ isError: false });
        });
    } catch (error) {
        console.error("Error to Send Email: ", error);
        res.status(500).json({ isError: true, error: 6, message: "Internal Mail Error" });
    }
}