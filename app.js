const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;
  console.log(req.body);

 var user = req.body.username;
    var password = req.body.password;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: user, // generated ethereal user
        pass: password  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });
  var subject = req.body.subject;
  var receiver = req.body.toemail;

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Nodemailer Contact" <mikeulloa97@gmail.com.com>', // sender address
      to: receiver, // list of receivers
      subject: subject, // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  });
 var port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server started...'));