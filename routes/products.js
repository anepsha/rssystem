var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var helpers = require('handlebars-helpers');

var Departments = require('../models/department');
var User = require('../models/user');
var Products = require('../models/product');

 //list of products for admin
router.get('/add_product', userAuthenticated, function (req, res, next) {

	var departmentname;

	Departments.find(function(err, departments) {
		if (err) {
			throw err;
		} else {
			name = departments.name;
			Products.find(function (err, products) {
			if (err) {
				throw err;
			}
			res.render('add_product', {title:'Products', products: products, departments: departments, departmentname: name})
			})
		}
	})
});

// list of products for user
router.get('/view_products/:id', userAuthenticated, function (req, res, next) {
    Products.find({ departmentId: req.params.id }, function (err, products) {
        if (err) {
            throw err;
        } else {
            if (isEmpty(products)) {
                Departments.findOne({ _id: req.params.id }, function (err, departments) {
                    if (err) {
                        throw err;
                    } else {
                        req.flash('info_msg', 'No products found');
                        res.locals.info_msg = req.flash('info_msg');
                        res.render('view_products', { title: 'Products', name: departments.name });
                    }
                })
            } else {
                res.render('view_products', { title: 'Products', products: products, name: products[0].departmentName });
            }
        }
    })
});

function isEmpty(obj) {
    return !Object.keys(obj).length > 0;
}

// Add new product for admin
router.post('/create_product', userAuthenticated, function (req, res, next) {
    var productName = req.body.inputProductName;
    var departmentId = req.body.departments;
    var productDescription = req.body.inputProductDescription;

    if (departmentId == null) {
        req.flash('error_msg', 'Please create department first');
        res.redirect('/products/add_product');
    } else {
        Departments.findOne({ _id: departmentId }, function (err, departments) {
            if (err) {
                throw err;
            } else {
                if (productName != "") {
                    var newProduct = new Products({ name: productName, description: productDescription, departmentId: departmentId, departmentName: departments.name });
                    newProduct.save(function (err, departments) {
                        if (err) {
                            throw err;
                        } else {
                            req.flash('success_msg', 'New product added');
                            res.redirect('/products/add_product');
                        }
                    })
                } else {
                    req.flash('error_msg', 'Product name cannot be empty');
                    res.redirect('/products/add_product');
                }
            }
        })
    }
});

// Load product to update
router.get('/view_product/:id', userAuthenticated, function (req, res, next) {
    Products.findOne({ _id: req.params.id }, function (err, result) {
        Departments.find({}, function (err, departments) {
            res.render('edit_product', { title: 'Edit Project', product: result, departments: departments });
        })
    })
})

// Update existing products
router.post('/update_product', userAuthenticated, function (req, res, next) {
    var productName = req.body.productName;
    var departmentName = req.body.departmentList;
    var productId = req.body.productId;
    var productDescription = req.body.productDescription;
    Departments.findOne({ name: departmentName }, function (err, department) {
        var dataToUpdate = {
            name: productName,
            departmentName: departmentName,
            description: productDescription,
            departmentId: department._id
        }
        Products.update({ _id: productId }, dataToUpdate, function (err, affected) {
            if (err) {
                throw err;
            } else {
                req.flash('success_msg', 'Product:  was succesfully removed');
                res.redirect('/products/add_product');
            }
        })
    })
})

// Remove existing products
router.post('/remove_product', function (req, res, next) {
    var _id = req.body.productId;
    Products.findByIdAndRemove(_id, function (err, product) {
        if (err) {
            throw err;
        } else {
            req.flash('success_msg', 'Product: ' + product.name + ' was succesfully removed');
            res.redirect('/products/add_product');
        }
    })
})

function userAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/users/login');
	}
}

module.exports = router;