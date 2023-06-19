let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    name: { type: String, unique: true },
    email: { type: String, unique: true },
    address: {
      city: { type: String },
      state: { type: String },
      country: { type: String },
      pin: { type: String },
    },
  },
  { timestamps: true }
);

userSchema.index({ name: 1 }, { unique: true });

// to be created in mongoDb
// db.users.createIndex({'address.country':1,'address.state':1},{ unique: true })

module.exports  = mongoose.model('User', userSchema);