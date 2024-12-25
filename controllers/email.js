import nodemailer from "nodemailer";
import { google } from 'googleapis';


// Function to generate a new Access Token for OAuth2
async function getNewAccessToken() {
    const oauth2Client = new google.auth.OAuth2(
        process.env.OAUTH_CLIENT_ID,
        process.env.OAUTH_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'  // Redirect URL
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.OAUTH_REFRESH_TOKEN
    });

    try {
        const { token } = await oauth2Client.getAccessToken(); // Get a new access token
        return token;
    } catch (error) {
        throw new Error("Failed to refresh access token: " + error.message);
    }
}

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

        /* SEND EMAIL WITH NODEMAILER */
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_ADDRESS,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.OAUTH_CLIENT_ID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN
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

        try {
            // Check if the transpoter is ready
            await transporter.verify();
            console.log("Transporter is ready to send emails!");

            // Send the Email
            transporter.sendMail(mailOptions, (error, data) => {
                if (error) {
                    console.log("Error sending email: ", error)
                    return res.status(500).json({ isError: true, error: 5, message: "Error in Email Sent" });
                }

                console.log("Message sent: %s", data.messageId);
                res.status(200).json({ isError: false });
            });

        } catch (error) {
            console.error("Error during verification or sending email:", error);

            // If the error is associated with the expired token
            if (error.message.includes('invalid_grant') || error.code === 'EAUTH') {
                console.log("Token expired, refreshing token...");

                // Get a new access token
                const newAccessToken = await getNewAccessToken();

                // Update the transpoter with the new token
                transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: process.env.MAIL_ADDRESS,
                        pass: process.env.MAIL_PASSWORD,
                        clientId: process.env.OAUTH_CLIENT_ID,
                        clientSecret: process.env.OAUTH_CLIENT_SECRET,
                        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
                        accessToken: newAccessToken // New Access Token
                    }
                });

                // Check if the transpoter is ready
                await transporter.verify();
                console.log("Transporter is ready to send emails!");

                // Try to send email again after the new token is generated
                transporter.sendMail(mailOptions, (error, data) => {
                    if (error) {
                        console.log("Error sending email: ", error)
                        return res.status(500).json({ isError: true, error: 5, message: "Error in Email Sent" });
                    }

                    console.log("Message sent: %s", data.messageId);
                    res.status(200).json({ isError: false });
                });
            }

            // Se o erro for diferente, retorna um erro genérico
            res.status(500).json({ isError: true, error: 6, message: "Internal Server Error" });
        }
    } catch (error) {
        console.error("Error to Send Email: ", error);
        res.status(500).json({ isError: true, error: 6, message: "Internal Server Error" });
    }
}