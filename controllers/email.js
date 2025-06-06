import nodemailer from "nodemailer";

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
            host: process.env.HOST,
            port: process.env.SEND_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_ADDRESS,
                pass: process.env.MAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: `"alantomaz.dev" ${process.env.MAIL_ADDRESS}`,
            to: "alantomaz.dev@gmail.com",
            subject: `Contato de ${name} - ${subject}`,
            text: `
            Você recebeu uma mensagem de contato.

            Nome: ${name}
            E-mail: ${email}
            Assunto: ${subject}
        
            Mensagem:
            ${message}
            `,
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'High'
            }
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