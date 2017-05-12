var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');

var Departments = require('../models/department');
var User = require('../models/user');
var Products = require('../models/product');

// List of departments for user
router.get('/view_department', userAuthenticated, function(req, res, next) {
	Departments.find(function(err, departments) {
		if (err) {
			throw err;
		}
		res.render('view_department', {title:'Departments', departments: departments, name: departments.name})
	})
});

// List of departments for admin
router.get('/add_department', userAuthenticated, function(req, res, next) {
	Departments.find(function(err, departments) {
		if (err) {
			throw err;
		}
		res.render('add_department', { title: 'Add New Department', departments: departments, name: departments.name, id: departments._id });
	})
});

// Add new department
router.post('/create_department', userAuthenticated, function(req, res, next) {
	var departmentName = req.body.departmentName;
	if (departmentName != "") {
		var newDepartment = new Departments({name: departmentName});
		newDepartment.save(function(err, departments) {
			if (err) {
				throw err;
			} else{
				req.flash('success_msg', 'New department added');
				res.redirect('/departments/add_department');
			}
		})
	} else{
		req.flash('error_msg', 'Department name cannot be empty');
		res.redirect('/departments/add_department');
	}
});

// Edit department
router.get('/edit_department/:id', userAuthenticated, function(req, res, next) {
	var departmentName = "";
	Departments.findById(req.params.id).exec(function(err, department) {
		if (err) {
			throw err;
		} else {
			res.redirect('/departments/add_department');
		}
	})
});

// Remove department
router.delete('/remove_department/:id', function(req, res) {
	Departments.findById(req.params.id).exec(function(err, doc) {
		if (err) {
			res.statusCode = 404;
			throw err;
		} else {
			doc.remove(function(err) {
				if (err) {
					res.statusCode = 404;
					throw err;
				} else {
					res.redirect('/departments/add_department')
				}
			})
		}
	})
})

// Remove existing department
router.post('/remove_department', function (req, res, next) {
    var departmentId = req.body.departmentId;
    Departments.findByIdAndRemove(departmentId, function (err, department) {
        if (!err) {

            Products.remove({ departmentId: departmentId }, function (err) {
                if (err) {
                    throw err;
                } else {
                    req.flash('success_msg', 'Department: ' + department.name + ' was succesfully removed');
                    res.redirect('/departments/add_department');
                }
            })

        }
    })
})

// Load department to update
router.get('/view_department/:id', userAuthenticated, function (req, res, next) {
    Departments.findOne({ _id: req.params.id }, function (err, result) {
        res.render('edit_department', { title: 'Edit Project', department: result});
    })
})

router.post('/update_department', userAuthenticated, function (req, res, next) {
    var departmentId = req.body.departmentId;
    var departmentName = req.body.departmentName;
    var dataToUpdate = { name: departmentName };
    if (departmentName != null && departmentName != "") {
        Departments.update({ _id: departmentId }, dataToUpdate, function (err) {
            if (err) {
                throw err;
            } else {
                Products.update({ departmentId: departmentId }, { departmentName: departmentName }, { multi: true }, function (err) {
                    if (err) {
                        throw err;
                    } else {
                        req.flash('success_msg', 'Department was succesfully updated');
                        res.redirect("/departments/add_department");
                    }
                })
            }
        })
    }
})

function userAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/users/login');
	}
}


module.exports = router;