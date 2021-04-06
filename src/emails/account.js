const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'pakehe8627@0pppp.com',
        subject: 'Welcome, thanks for joining!',
        text: `Hey there ${name}. Thanks for joining and hope you enjoy using our app!`
    })
}
const cancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'pakehe8627@0pppp.com',
        subject: 'Sorry to see you go',
        text: `Hey there ${name}. Sorry to see you go. I hope you enjoyed using our app and wish you can stay longer. Is there anything we can improve on? We'd love to hear your feedback.`
    })
}

module.exports = {
    sendWelcomeEmail,
    cancelEmail
}
