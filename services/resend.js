import { Resend } from 'resend';

/* SEND EMAIL FUNCTION */
export const sendEmailWithResend = async (RESEND_API_KEY, RESEND_SENDER, MAIL_DESTINATION, name, subject, emailBody) => {

    try {
        /* MAIL STRUCTURE */
        const resend = new Resend(RESEND_API_KEY);

        const resendEmailBody = {
            from: `"alantomaz.dev" <${RESEND_SENDER}>`,
            to: MAIL_DESTINATION,
            subject: `Contato de ${name} - ${subject}`,
            html: emailBody
        }

        try {
            const data = await resend.emails.send(resendEmailBody);

            console.log(`Email sent successfully to ${MAIL_DESTINATION}`);

            return data;
        } catch (error) {
            console.log("Error sending email: ", error);
            throw { isError: true, error: 5, message: "Error in Email Sent" };
        }
    } catch (error) {
        throw error;
    }
}