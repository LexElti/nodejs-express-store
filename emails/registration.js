const keys = require('../keys')

module.exports = function(email) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Аккаунт создан',
    html: `
      <h1>Добро пожаловать в наш магазин</h1>
      <p>Вы успешно создали аккаунт c email - ${email}</p>
      <hr />
      <a href="${keys.BASE_URL}">Магазин курсов</a>
    `
  }
}

// const nodemailer = require('nodemailer')

// const config = require('../config')

// module.exports = function(email, subject, message) {
//  const mailTransport = nodemailer.createTransport({
//    service: 'gmail',
//    secure: false,
//    port: 25,
//    auth: { 
//      user: config.email.user, 
//      pass: config.email.pass 
//    },
//    tls: { rejectUnauthorized: false }
//  })

//  mailTransport.sendMail(
//    {
//      from: 'Your company',
//      to: email,
//      subject: subject,
//      text: message
//    }, 
//    function(err, info) {}
//  )
// }