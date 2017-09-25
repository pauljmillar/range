const Location = require('../models/Location');

/**
 * GET /locations
 * Location info page.
 */
exports.getLocations = (req, res) => {

  Location.find({ active:true }, (err, allLocations) => {
    if (err) { return next(err); }
    if (!allLocations) {
      req.flash('errors', { msg: 'Found no locations.' });
      return res.redirect('/locations');
    }
    res.render('locations', {
      title: 'Locations',
      allLocations
    });
  });

};

/**
 * GET /locations/:locationid
 * Location info page.
 */
exports.getLocation = (req, res) => {
  const locationid = req.params.locationid;
  //req.flash('errors', { msg: 'Could not find that location.'+locationid });

  Location.findOne({ locationid:locationid, active:true }, (err, location) => {
    if (err) { return next(err); }
    if (!location) {
      req.flash('errors', { msg: 'Could not find that location.' });
      return res.redirect('/locations');
    }
   //req.flash('errors', { msg: 'Location.'+location });

    res.render('location', {
      title: 'Location',
      location
    });
  });

};


/**
 * GET /locations/account
 * Profile page for locations after logging in.
 */
exports.getLocationAccount = (req, res) => {
  const locationuserid = req.user._id;
  //req.flash('errors', { msg: 'Could not find that location.'+locationid });

  Location.findOne({ locationuserid:locationuserid }, (err, location) => {
    if (err) { return next(err); }
    if (!location) {
      req.flash('errors', { msg: 'Create your account.' });
      location = {};
      //return res.redirect('/login');
    }
   //req.flash('errors', { msg: 'Location.'+location });

    res.render('location/profile', {
      title: 'Location Account',
      location
    });
  });

};


/**
 * GET /locations/accountnew
 * Profile page for locations after logging in.
 */
exports.getLocationAccountNew = (req, res) => {
  const locationuserid = req.user._id;
  //req.flash('errors', { msg: 'Could not find that location.'+locationid });

  Location.findOne({ locationuserid:locationuserid }, (err, location) => {
    if (err) { return next(err); }
    if (!location) {
      req.flash('errors', { msg: 'Create your account.' });
      location = {};
      //return res.redirect('/login');
    }
   //req.flash('errors', { msg: 'Location.'+location });

    res.render('location/dashboard', {
      title: 'Restaurant Dashboard',
      location
    });
  });

};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postLocationProfile = (req, res, next) => {
  //req.assert('email', 'Please enter a valid email address.').isEmail();
  //req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  //const errors = req.validationErrors();

  //if (errors) {
  //  req.flash('errors', errors);
  //  return res.redirect('/account');
  // }
   
  //update if not a new location
  if (req.body.id) { 
    Location.findById(req.body.id, (err, loc) => {
      if (err) { return next(err); }
      loc.locationuserid = req.body.locationuserid || loc.locationuserid; 
      loc.name = req.body.name || loc.name; 
      loc.hours = req.body.hours || loc.hours;      
      loc.locationid = req.body.locationid || loc.locationid;      
      loc.active = req.body.active || loc.active;      
      loc.city = req.body.city || loc.city;      
      loc.state = req.body.state || loc.state;      
      loc.address = req.body.address || loc.address;      
      loc.email = req.body.email || loc.email;      
      loc.phone = req.body.phone || loc.phone;      
      loc.website = req.body.website || loc.website;      
      loc.description = req.body.description || loc.description;      
      loc.announcement = req.body.announcement || loc.announcement;      
      loc.wifipassword = req.body.wifipassword || loc.wifipassword;      
      loc.offer1 = req.body.offer1 || loc.offer1;      
      loc.offer1title = req.body.offer1title || loc.offer1title;      
      loc.offer2 = req.body.offer2 || loc.offer2;      
      loc.offer2title = req.body.offer2title || loc.offer2title;      
      loc.save((err) => {
        if (err) {
          if (err.code === 11000) {
            req.flash('errors', { msg: 'The shortname you have entered is already associated with an account.' });
            return res.redirect('/locations/account');
          }
          return next(err);
        }
        req.flash('success', { msg: 'Profile information has been updated.' });
        res.redirect('/locations/account');
      });
    });
  } else {
    //saving new record
    var newlocation = new Location({
      locationuserid: req.body.locationuserid,
      name: req.body.name,
      hours: req.body.hours,
      locationid: req.body.locationid,
      active: req.body.active,
      city: req.body.city,
      state: req.body.state, 
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      website: req.body.website,
      description: req.body.description,
      announcement: req.body.announcement,
      wifipassword: req.body.wifipassword,
      offer1: req.body.offer1,
      offer1title: req.body.offer1title,
      offer2: req.body.offer2,
      offer2title: req.body.offer2title
    });
    
    newlocation.save((err) => {
    if (err) {
      if (err.code === 11000) {
        req.flash('errors', { msg: 'The shortname you have entered is already associated with an account.' });
        return res.redirect('/locations/account');
      }
      return next(err);
    }
      req.flash('success', { msg: 'Profile information has been saved.' });
      res.redirect('/locations/account');
    });
    
  }  
};


/**
 * GET /join
 * Explains rules of joining as a location
 */
exports.getLocationJoin = (req, res) => {
  res.render('locationjoin', {
    title: 'Join'
  });
};

