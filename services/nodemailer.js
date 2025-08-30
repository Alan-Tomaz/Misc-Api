import nodemailer from "nodemailer";

export const sendEmailWithNodemailer = async (host, sendPort, mailAdress, mailDestination, mailPass, name, subject, emailBody) => {
    try {
        /* SEND EMAIL WITH NODEMAILER */
        const transporter = nodemailer.createTransport({
            host: host,
            port: sendPort,
            secure: true,
            auth: {
                user: mailAdress,
                pass: mailPass,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: `"alantomaz.dev" ${mailAdress}`,
            to: mailDestination,
            subject: `Contato de ${name} - ${subject}`,
            text: emailBody,
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'High'
            }
        };

        try {
            const data = await transporter.sendMail(mailOptions);

            console.log("Message sent: %s", data.messageId);

            return data;
        } catch (error) {
            console.log("Error sending email: ", error);
            throw { isError: true, error: 5, message: "Error in Email Sent" };
        }
    } catch (error) {
        throw error;
    }
}