const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

/**
const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASSWORD
  }
});
**/

// Configure Nodemailer SendGrid Transporter
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      //api_user: process.env.SENDGRID_USER,    // SG username
      api_key: process.env.SENDGRID_PASSWORD, // SG password
    },
  })
);
//const transporter = nodemailer.createTransport('smtps://paul.millar%40gmail.com:ventura123@smtp.gmail.com');

/**
 * GET /contact
 * Contact form page.
 */
exports.getContact = (req, res) => {
  res.render('contact', {
    title: 'Contact'
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postContact = (req, res) => {
console.log('here');
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('message', 'Message cannot be blank').notEmpty();

  const errors = req.validationErrors();
  //const errors = req.getValidationResult();
  //const errors = validationResult(req).throw();
  console.log('here2');

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }
console.log('here3');

  const mailOptions = {
    to: 'paul.millar@gmail.com',
    from: 'hello@rangecoworking.com', //`${req.body.name} <${req.body.email}>`,
    subject: 'Contact Form | Range Coworking',
    text: 'hello:' + req.body.message + ' from: ' + req.body.name + ' at: ' + req.body.email
  };
console.log('here4');

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
    }
    req.flash('success', { msg: 'Email has been sent successfully!' });
    return res.redirect('/contact');
  });
};
