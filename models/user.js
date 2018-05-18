const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema defines how the user's data will be stored in MongoDB
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// Saves the user's password hashed (plain text password storage is not good)
UserSchema.pre('save', function (next) {
  const user = this;
  console.log("pre save user",user);

  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
    	  console.log("encryp error",err);

        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
      	  console.log("user encryp error",err);

          return next(err);
        }
        user.password = hash;
        console.log("user encryp password",user.password);

         next();
      });
    });
  } else {
    return next();
  }
});

// Create method to compare password input to password saved in database
UserSchema.methods.comparePassword = function(pw, cb) {
	  console.log("user encryp compared",pw);

  bcrypt.compare(pw, this.password, function(err, isMatch) {
    if (err) {
  	  console.log("user encryp compared",err);

      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
