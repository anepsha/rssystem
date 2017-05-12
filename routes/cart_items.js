var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Products = require('../models/product');
var Cart = require('../models/cart');

router.get('/add_to_cart/:id', function (req, res, next) {
    var productId = req.params.id;
    var testWord = "";
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Products.findById(productId, function (err, product) {
        if (err) {
            return res.sendStatus(500);
        }

        cart.add(req.user, product, product.id, product.departmentName);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect(req.get('referer'));
    })
})

router.get('/cart', function (req, res, next) {
    if (!req.session.cart) {
        return res.render('cart', {products: null})
    }
    var cart = new Cart(req.session.cart);
    console.log(req.session.cart.items.name);
    res.render('cart', { products: cart.generateArray() });
})

module.exports = router;
