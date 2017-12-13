const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');
const path = require('path');
const Location = require('../models/Location');
const Evt = require('../models/Event');
const sendgridTransport = require('nodemailer-sendgrid-transport');
var fs = require('fs');

/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/account');
  }
  res.render('account/login', {
    title: 'Login'
  });
  //res.sendFile(path.join(__dirname + '/../public/login.html'), {
  //  title: 'Log In'
  //});  
};

/**
 * GET /join
 * Explains rules of joining
 */
exports.getJoin = (req, res) => {
  res.render('join', {
    title: 'Join'
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }
   

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      //req.flash('success', { msg: 'Success! You are logged in.' });
      if (user.isLocation) {res.redirect('/locations/account')}
      else { res.redirect('/account')}
      //res.redirect(req.session.returnTo || '/account');
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/account');
  }
  res.render('account/signup', {
    title: 'Create Account'
  });
};

/**
 * GET /signup
 * Signup page.
 */
exports.getLocationSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/locations/account');
  }
  res.render('location/signup', {
    title: 'Create Account'
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password
  });
  
  const sendSignupEmail = (user) => {   
       
    const transporter = nodemailer.createTransport(
      sendgridTransport({
        auth: {
          api_key: process.env.SENDGRID_PASSWORD, // SG password
        },
      })
    );
    
    const mailOptions = {
      to: 'paul.millar@gmail.com',
      from: 'signup@rangeco.work',
      subject: `New Range Signup: ${user.email}`,
      text: `Hello,\n\nRange user ${user.email} has just signed up.\n`
    };
    
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('success', { msg: 'Welcome to Range.' });
      }); 
  };  

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/login');
    }
    user.save((err, usr) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        //alert admin of new signupsendSignupEmail;

				//create folder and file
				var dirpath = "./public/uploads/"+usr._id;
					
				fs.mkdir(dirpath, function(err) {
    			if (err) throw err;									
    			console.log("The directory was succesfully created!");
          
          sendSignupEmail(user);
          return res.redirect('/account');
        }); 	        
      });
    });
  });
};


/**
 * POST /location/signup
 * Create a new restaraunt account.
 */
exports.postLocationSignup = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/locations/signup');
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    isLocation: true
  });

  const sendSignupEmail = (user) => {   
       
    const transporter = nodemailer.createTransport(
      sendgridTransport({
        auth: {
          api_key: process.env.SENDGRID_PASSWORD, // SG password
        },
      })
    );
    
    const mailOptions = {
      to: 'paul.millar@gmail.com',
      from: 'signup@rangeco.work',
      subject: `New Range Restaurant Signup: ${user.email}`,
      text: `Hello,\n\nRange user ${user.email} has just signed up.\n`
    };
    
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('success', { msg: 'Welcome to Range.' });
      }); 
  };  
  

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/locations/signup');
    }
    user.save((err, usr) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }     

				//create folder and file
				var dirpath = "./public/uploads/"+usr._id;
					
				fs.mkdir(dirpath, function(err) {
    			if (err) throw err;									
    			console.log("The directory was succesfully created!");
          
          sendSignupEmail(user);
          return res.redirect('/locations/account');
        });       
      
      });
    });
  });
};



/**
 * GET /account
 * Dashboard page.
 */
exports.getAccount = (req, res) => {
  
    Location.find({ active:true }, (err, allLocations) => {
    if (err) { return next(err); }
    if (!allLocations) {
      req.flash('errors', { msg: 'Found no locations.' });
      //return res.redirect('/locations');
    }
    res.render('account/dashboard', {
      title: 'Mange Account',
      allLocations
    });
  });
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccountUser = (req, res) => {
  
    Location.find({ active:true }, (err, allLocations) => {
    if (err) { return next(err); }
    if (!allLocations) {
      req.flash('errors', { msg: 'Found no locations.' });
      //return res.redirect('/locations');
    }
    res.render('account/user', {
      title: 'Mange User Profile',
      allLocations
    });
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    user.profile.name = req.body.name || user.profile.name;
    user.profile.gender = req.body.gender || user.profile.gender;
    user.profile.homelocation = req.body.homelocation || user.profile.homelocation;
    user.profile.website = req.body.website || user.profile.website;
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
          return res.redirect('/account');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Profile information has been updated.' });
      if (user.isLocation)
        res.redirect('/locations/account');
      else
        res.redirect('/account');
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.password = req.body.password;
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/checkin
 * Check in to location.
 */
exports.postUpdateCheckIn = (req, res, next) => {
  
  evt = new Evt();  
  evt.locationid = req.body.locationid;
  evt.userid = req.user.id;
  
  var checkInMsg = 'You are checked in.';
  
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    if (user.checkInTime) {
      user.checkInTime = null;
      user.checkInLocation = null;
      evt.type = 'checkout';
      checkInMsg = 'You are checked out.';
      
      Location.findById(req.body.locationid, (err, loc) => {
        if (err) { return next(err); }
        console.log('about to check out' + loc._id);
        loc.seatsTaken = loc.seatsTaken === 0 ? 0 : loc.seatsTaken - 1;
       // loc.seatsTaken =  loc.seatsTaken - 1;
        loc.save((err) => {
          if (err) { 
            req.flash('error', { msg: 'There was a problem checking out.' });
            return res.redirect('/account');
          }
        
          user.save((err) => {
            if (err) { return next(err); }

            evt.save((err) => {
              if (err) { return next(err); }
              req.flash('success', { msg: checkInMsg });
              res.redirect('/account');
            });    
          });
        });
      });
    } else {
      user.checkInTime = new Date().toISOString();
      user.checkInLocation = req.body.locationid;
      evt.type='checkin';
      
      Location.findById(req.body.locationid, (err, loc) => {
        if (err) { return next(err); }
        console.log('about to check');
        if (loc.seatsTaken + 1 >= loc.seats){
          console.log('seatstaken + 1 > seats ');
          
          req.flash('errors', { msg: 'Sorry, no seats available.' });
          return res.redirect('/account');
        }

        loc.seatsTaken = loc.seatsTaken + 1; 
        loc.save((err) => {
          if (err) { 
            req.flash('error', { msg: 'There was a problem checking in.' });
            return res.redirect('/account');
          }
          
          user.save((err) => {
          if (err) { return next(err); }
      
            evt.save((err) => {
            if (err) { return next(err); }
              req.flash('success', { msg: checkInMsg });
              return res.redirect('/account');
            });    
            });
          
         });
      });
      
      
    }

  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
  User.remove({ _id: req.user.id }, (err) => {
    if (err) { return next(err); }
    req.logout();
    req.flash('info', { msg: 'Your account has been deleted.' });
    res.redirect('/');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
  const provider = req.params.provider;
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user[provider] = undefined;
    user.tokens = user.tokens.filter(token => token.kind !== provider);
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('info', { msg: `${provider} account has been unlinked.` });
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  const resetPassword = () =>
    User
      .findOne({ passwordResetToken: req.params.token })
      .where('passwordResetExpires').gt(Date.now())
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
          return res.redirect('back');
        }
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        return user.save().then(() => new Promise((resolve, reject) => {
          req.logIn(user, (err) => {
            if (err) { return reject(err); }
            resolve(user);
          });
        }));
      });

  const sendResetPasswordEmail = (user) => {
    if (!user) { return; }
    const transporter = nodemailer.createTransport(
      sendgridTransport({
        auth: {
          //api_user: process.env.SENDGRID_USER,    // SG username
          api_key: process.env.SENDGRID_PASSWORD, // SG password
        },
      })
    );
    const mailOptions = {
      to: user.email,
      from: 'passwords@rangeco.work',
      subject: 'Your Range Coworking password has been changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('success', { msg: 'Success! Your password has been changed.' });
      });
  };

  resetPassword()
    .then(sendResetPasswordEmail)
    .then(() => { if (!res.finished) res.redirect('/'); })
    .catch(err => next(err));
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }  
  res.render('account/forgot', {
    title: 'Forgot Password'
  });

};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  const createRandomToken = crypto
    .randomBytesAsync(16)
    .then(buf => buf.toString('hex'));

  const setRandomToken = token =>
    User
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'Account with that email address does not exist.' });
        } else {
          user.passwordResetToken = token;
          user.passwordResetExpires = Date.now() + 3600000; // 1 hour
          user = user.save();
        }
        return user;
      });

  const sendForgotPasswordEmail = (user) => {
    if (!user) { return; }
    const token = user.passwordResetToken;
 //   const transporter = nodemailer.createTransport({
 //     service: 'SendGrid',
 //     auth: {
 //       user: process.env.SENDGRID_USER,
 //       pass: process.env.SENDGRID_PASSWORD
 //     }
 //   });
    
  const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      //api_user: process.env.SENDGRID_USER,    // SG username
      api_key: process.env.SENDGRID_PASSWORD, // SG password
    },
  })
);
    
    const mailOptions = {
      to: user.email,
      from: 'passwords@rangeco.work',
      subject: 'Reset your password on Range Coworking',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        https://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('info', { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
      });
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .then(() => res.redirect('/forgot'))
    .catch(next);
};
