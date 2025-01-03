import axios from "axios";

export const checkCaptcha = async (req, res, next) => {
    try {
        const recaptchaToken = req.body.recaptchaToken;

        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
        );

        if (!response.data.success) {
            console.log(`Invalid Captcha Return, error: ${JSON.stringify(response.data)}`);
            return res.status(400).json({ isError: true, error: 1, message: "Invalid Captcha Return" });
        } else {
            next();
        }
    } catch (error) {
        console.log({ message: "Erro Interno do Servidor", error })
        res.status(500).json({ isError: true, error: 0, message: "Internal Captcha Check Error" });
    }
}