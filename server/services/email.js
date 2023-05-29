const nodemailer = require('nodemailer');

const sendMail = async (sender, recipient, html) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        auth: {
            user: process.env.SENDGRID_USERNAME,
            pass: process.env.SENDGRID_API_KEY
        },
        port: process.env.SENDGRID_PORT,
        secure: true
    });

    const res = await transporter.sendMail({
        from: `fileSharingApp <${process.env.SENDGRID_VERIFIED_SENDER}>`,
        to: recipient,
        subject: `${sender} has shared a file with you.`,
        html
    });
};
module.exports = { sendMail };