const nodeMailer = require('nodemailer');
const { options } = require('../routes/post');


const sendEmail = async (options) => {
    // mail trap starts
    // var transport = nodemailer.createTransport({
    //     host: "smtp.mailtrap.io",
    //     port: 2525,
    //     auth: {
    //       user: "60029bf8ebf5c3",
    //       pass: "4e6f7e42c8f8e8"
    //     }
    //   });
    // mail trap ends
    
    
    // gmail starts
    const transporter = nodeMailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },

        service: process.env.SMPT_SERVICE,
    });

    // gmail ends


    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;