var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function(req, res, next) {
	res.render('register', { title : 'Register'});
});

// Login
router.get('/login', function(req, res, next) {
	res.render('login', { title : 'Login'});
});

// Register user
router.post('/register', function(req, res, next) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var confirmedPassword = req.body.confirmedPassword;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('confirmedPassword', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	} else {
		var newUser = new User({
			name: name,
			email: email,
			password: password,
			admin: false,
			active: false
		});

		User.createUser(newUser, function (err, user) {
		    if (err) {
		        throw err;
		    }
		});

		req.flash('success_msg', 'You are registerd and can now login');
		res.redirect('/users/login');
	}
});

// Local Strategy
passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
},
  function(email, password, done) {
  	User.getUserByEmail(email, function(err, user) {
  		if (err) {
  			throw err;
  		}

  		if (!user) {
  			return done(null, false, {message: 'Unknown User'});
  		}

  		User.comparePassword(password, user.password, function(err, isMatch) {
  			if (err) {
  				throw err;
  			}
  			if (isMatch) {
  				return done(null, user);
  			} else {
  				return done(null, false, {message: 'Invalid password'});
  			}
  		})
  	})
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

router.post('/login',
	function(req, res, next) {
		if (req.body.rememberMe) {
			req.session.cookie.maxAge = 30 * 24 * 3600 * 1000;
		}
		next();
	},
	passport.authenticate('local', {successRedirect: '/departments/view_department', failureRedirect:'/users/login', failureFlash: true}),
	function(req, res) {
		res.redirect('/departments/view_department');
	}
);

router.get('/logout', function(req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
})

// List of users for admin
router.get('/users_list', function (req, res) {

    User.find(function (err, users) {
        if (err) {
            throw err;
        } else {
            res.render('users_list', { title: 'Users', users: users });
        }
    })
})

// Remove existing user
router.post('/remove_user', function (req, res, next) {
    var userId = req.body.userId;
    User.findByIdAndRemove(userId, function (err, user) {
        if (!err) {
            req.flash('success_msg', 'User: ' + user.name + ' was succesfully removed');
            res.redirect('/users/users_list');
        }
    })
})

// Activate user
router.post('/activate_user/:id', function (req, res) {
    User.findOneAndUpdate({ _id: req.params.id }, { $set: {active: true} }, function (err, result) {
        if (err) {
            throw err;
        }
        req.flash('success_msg', 'User: ' + result.name + " successfully activated");
        res.redirect('/users/users_list');
    })
})

// Deactivate user
router.post('/deactivate_user/:id', function (req, res) {
    console.log(req.user.active);
    User.findOneAndUpdate({ _id: req.params.id }, { $set: { active: false } }, function (err, result) {
        if (err) {
            throw err;
        }
        req.flash('success_msg', 'User:' + result.name + ' successfully deactivated');
        res.redirect('/users/users_list');
    })
})

module.exports = router;