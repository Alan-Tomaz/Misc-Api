import express from 'express';
import { sendEmail } from '../controllers/email.js';
import { checkCaptcha } from '../middlewares/checkCaptcha.js'

const router = express.Router();

/* Send Email*/
router.post("/send", checkCaptcha, sendEmail);

export default router;