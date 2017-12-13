const Location = require('../models/Location');
const User = require('../models/User');
const Evt = require('../models/Event');

/**
 * GET /locations
 * Location info page.
 */
exports.getLocations = (req, res) => {

  Location.find({ active:true })
    .sort({updatedAt: -1})
    .exec((err, allLocations) => {
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
exports.getLocationDashboard = (req, res) => {
	
	var sample = 7,
    Days = 7,
    OneDay = ( 1000 * 60 * 60 * 24 ),
    now = Date.now(),
    Today = now - ( now % OneDay ) ,
    nDaysAgo = Today - ( OneDay * Days ),
    startDate = new Date( nDaysAgo ),
    //endDate = new Date( Today + OneDay ),
    endDate = new Date( Today ),
    store = {};
	
	
  const locationuserid = req.user._id;
  //req.flash('errors', { msg: 'Could not find that location.'+locationid });

  Location.findOne({ locationuserid:locationuserid }, (err, location) => {
    if (err) { return next(err); }
    if (!location) {
			console.log('no location');
      req.flash('errors', { msg: 'Create your account.' });
      location = {}, checkedInUsers = {}, store = {};
			return res.render('location/profile', {
      	title: 'Restaurant Profile',
      	location, 
				checkedInUsers, 
				store
      });
			
    }

    //find checked in users for location
    console.log('running here:' + locationuserid);
    console.log('loc id:' + location._id);
    User.find({ checkInLocation:location._id })
    .sort({checkInTime: -1})
    //.populate('checkInLocation')
    .exec((err, checkedInUsers) => {
      console.log('inside query' + checkedInUsers.toString());
      if (err) { return next(err); }
      if (!checkedInUsers) {
        req.flash('errors', { msg: 'No members checked in.' });
        //return res.redirect('/locations');
      }

      


var thisDay = new Date( nDaysAgo );
while ( thisDay < endDate ) {
    store[thisDay] = 0;
    thisDay = new Date( thisDay.valueOf() + OneDay );
    console.log('******'+thisDay);
}

Evt.aggregate([
    { "$match": { "createdAt": { "$gte": startDate }, "type": "checkin", "locationid": location._id }},
    { "$group": {
        "_id": {
            "$add": [
                { "$subtract": [
                    { "$subtract": [ "$createdAt", new Date(0) ] },
                    { "$mod": [
                        { "$subtract": [ "$createdAt", new Date(0) ] },
                        OneDay
                    ]}
                ]},
                new Date(0)
            ]
        },
        "count": { "$sum": 1 }
    }}
]).exec(function(err,result){
                	//if(!err) {}
								//console.log('group metros:'+docs);
								result.forEach( function(myResult) { 
                  store[myResult._id] = myResult.count;
                  console.log('***' + myResult.count + ' date ' + myResult._id);
                });      
      
      
      


      res.render('location/dashboard', {
        title: 'Restaurant Dashboard',
        location, 
				checkedInUsers, 
				store
      });
    });
    });
    

  });

};



/**
 * GET /locations/account/profile
 * Profile page for locations after logging in.
 */
exports.getLocationProfile = (req, res) => {
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
      title: 'Restaurant Profile',
      location
    });
  });

};


/**
 * GET /locations/account/profile
 * Profile page for locations after logging in.
 */
exports.getLocationAccountUser = (req, res) => {
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

    res.render('location/user', {
      title: 'Restaurant User',
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
 * GET /locations/accountnew2
 * Profile page for locations after logging in.
 */
exports.getLocationAccountNew2 = (req, res) => {
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

    res.render('location/dashboard2', {
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
      loc.offer1desc = req.body.offer1desc || loc.offer1desc;      
      loc.offer2 = req.body.offer2 || loc.offer2;      
      loc.offer2desc = req.body.offer2desc || loc.offer2desc;      
      loc.feature1 = req.body.feature1 || loc.feature1;      
      loc.feature1desc = req.body.feature1desc || loc.feature1desc;      
      loc.feature2 = req.body.feature2 || loc.feature2;      
      loc.feature2desc = req.body.feature2desc || loc.feature2desc;   
      loc.feature3 = req.body.feature3 || loc.feature3;      
      loc.feature3desc = req.body.feature3desc || loc.feature3desc;   
      loc.longdescription = req.body.longdescription || loc.longdescription;      
			loc.seats = req.body.seats || loc.seats;      
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
      offer1desc: req.body.offer1desc,
      offer2: req.body.offer2,
      offer2desc: req.body.offer2desc,
      feature1: req.body.feature1,
      feature1desc: req.body.feature1desc,
      feature2: req.body.feature2,
      feature2desc: req.body.feature2desc,
			feature3: req.body.feature3,
			feature3desc: req.body.feature3,
			longdescription: req.body.longdescription
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

