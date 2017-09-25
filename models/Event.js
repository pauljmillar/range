const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  type: String,
  userid   : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  locationid   : {type: mongoose.Schema.Types.ObjectId, ref: 'Location'}
  
}, { timestamps: true });


const Evt = mongoose.model('Event', eventSchema);

module.exports = Evt;
