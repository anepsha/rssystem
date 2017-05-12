var express = require('express');
var router = express.Router();


router.get('/', userAuthenticated, function(req, res) {
	res.render('index');
});


function userAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/users/login');
	}
}
module.exports = router;