const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: String,
  locationuserid   : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  locationid: { type: String, unique: true }, //url value
  description: String,
  hours: String,
  address: String,
  city: String,
  state: String,
  active: Boolean,
  mainimage: String,
  previewimage: String,
  phone: String,
  email: String,
  website: String,
  announcement: String,
  wifipassword: String,
  offer1: String,
  offer1title: String,
  offer2: String,
  offer2title: String,
  seats: {type: Number, default: 0},
  seatsTaken: {type: Number, default: 0}

}, { timestamps: true });


const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
