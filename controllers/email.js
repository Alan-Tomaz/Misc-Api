import { sendEmailWithNodemailer } from "../services/nodemailer.js";
import { sendEmailWithResend } from "../services/resend.js";

export const sendEmail = async (req, res) => {
    try {
        const HOST = process.env.HOST;
        const SEND_PORT = process.env.SEND_PORT;
        const MAIL_ADDRESS = process.env.MAIL_ADDRESS;
        const MAIL_DESTINATION = process.env.MAIL_DESTINATION;
        const MAIL_PASS = process.env.MAIL_PASS;
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        const RESEND_SENDER = process.env.RESEND_SENDER;

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

        const emailBody = `
            Você recebeu uma mensagem de contato.

            Nome: ${name}
            E-mail: ${email}
            Assunto: ${subject}
        
            Mensagem:
            ${message}
            `;

        /* await sendEmailWithNodemailer(HOST, SEND_PORT, MAIL_ADDRESS, MAIL_DESTINATION, MAIL_PASS, name, subject, emailBody); */
        await sendEmailWithResend(RESEND_API_KEY, RESEND_SENDER, MAIL_DESTINATION, name, subject, emailBody)

        res.status(200).json({ isError: false });

    } catch (error) {
        if (error.error && error.error === 5) {
            console.log("Error sending email: ", error)
            return res.status(500).json({ isError: true, error: 5, message: "Error in Email Sent" });
        }
        console.error("Error to Send Email: ", error);
        return res.status(500).json({ isError: true, error: 6, message: "Internal Mail Error" });
    }
}