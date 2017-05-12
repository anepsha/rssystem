var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true,
        require: true
	},
	password: {
	    type: String,
        require: true
	},
	email: {
	    type: String,
	    lowercase: true,
	    trim: true,
	    index: {
            unique: true,
	    },
	    validate: {
            validator : isEmailExists, msg: 'Email already exists'
	    }
	},
	name: {
		type: String
	},
	admin: Boolean,
    active: Boolean,
});

function isEmailExists(email, callback) {
    if (email) {
        mongoose.models['User'].count({ _id: { '$ne': this._id }, email: email }, function (err, result) {
            if (err) {
                return callback(err);
            }
            callback(!result);
        })
    }
}

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByEmail = function(email, callback) {
	var query = {email: email};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, function(err, res) {
    	if (err) {
    		throw err;
    	} 
    	callback(null, res);
	});
}