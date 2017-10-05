const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: String,
  locationuserid   : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  locationid: { type: String, unique: true }, //url value
  description: String,
  longdescription: String,
  hours: String,
  address: String,
  city: String,
  state: String,
  active: Boolean,
  mainimage: String,
  previewimage: String,
  image3: String,
  image4: String,
  image5: String,
  phone: String,
  email: String,
  website: String,
  announcement: String,
  wifipassword: String,
  offer1: String,
  offer1desc: String,
  offer2: String,
  offer2desc: String,
  feature1: String,
  feature1desc: String,
  feature2: String,
  feature2desc: String,
  feature3: String,
  feature3desc: String,
  offer2title: String,
  seats: {type: Number, default: 0},
  seatsTaken: {type: Number, default: 0, validate: {
        validator: function (value) {
            return value <= this.seats;
        }, message: 'No seats remain.'
    } 
  }
}, { timestamps: true });


const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
