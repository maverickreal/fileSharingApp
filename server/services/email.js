const nodemailer = require('nodemailer');

const sendMail = async (sender, recipient, html) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        auth: {
            user: process.env.SENDGRID_USERNAME,
            pass: process.env.SENDGRID_PASSWORD
        },
        port: process.env.SENDGRID_PORT,
        secure: true
    });

    await transporter.sendMail({
        from: `fileSharingApp <${sender}>`,
        to: recipient,
        subject: `${recipient} has shared a file with you.`,
        html
    });
};
module.exports = { sendMail };