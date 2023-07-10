const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect } = require("../middleware/authMiddleware");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const router = express.Router();

router.post('/cartItems', protect, asyncHandler(async (req, res) => {
  const { id, qty } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = new Cart({
            user: req.user._id,
            cartItems: [],
            shippingAddress: {
              address:null,
              city:null,
              postalCode:null,
              country:null,
              phoneNumber:null,
            },
            paymentMethod: null,
            paymentInfo: {
              cardholderName: null,
              cardNumber: null,
              expiry: null,
              paidAmount: null
            }
          });
    }

    const existingProduct = cart.cartItems.find(item => item.product.toString() === id);

    if (existingProduct) {
      existingProduct.qty += qty;
      const product = await Product.findById(id);
      product.stockSold +=qty;
      await product.save();
    } else {
      const product = await Product.findById(id);

      if (product) {
        cart.cartItems.push({
          product: product._id,
          name: product.brandName,
          image: product.image,
          price: product.discountedCost,
          countInStock: product.quantity,
          qty,
          category: product.category,
          subCategory: product.subCategory,
        });
        product.stockSold +=qty;
        await product.save();
      } else {
        throw new Error('Product not found');
      }
    }

    const updatedCart = await cart.save();
    res.status(201).json(updatedCart.cartItems);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}));

router.post('/removeItem', protect, asyncHandler(async (req, res) => {
    const { id } = req.body;
    try {
      let cart = await Cart.findOne({ user: req.user._id });
  
      // Update the cartItems array using the $pull operator to remove the item with the specified product ID
      cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { cartItems: { product: id } } },
        { new: true }
      );
  
      res.status(201).json(cart.cartItems);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }));
  
  router.put('/saveShippingAddress', protect, asyncHandler(async (req, res) => {
    const { data } = req.body;
    try {
        const cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            {
              $set: {
                'shippingAddress.address' : data.address,
                'shippingAddress.city' : data.city,
                'shippingAddress.postalCode' : data.postalCode,
                'shippingAddress.country' : data.country,
                'shippingAddress.phoneNumber' : data.phoneNumber
                  
              },
            },
            { new: true }
          );
  
      // Update the cartItems array using the $pull operator to remove the item with the specified product ID
      
      res.status(201).json(cart.shippingAddress);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }));

  router.put('/savePaymentMethod', protect, asyncHandler(async (req, res) => {
    const { data } = req.body;
    try {
      let cart = await Cart.findOne({ user: req.user._id });
      cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        {
          $set: {
            paymentMethod: data,
            'paymentInfo.cardholderName':'',
            'paymentInfo.cardNumber':'',
            'paymentInfo.expiry':'',
            'paymentInfo.paidAmount':'',
          },
        },
        { new: true }
      );
      res.status(201).json(cart.paymentMethod);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }));
  

  router.put('/savePaymentInfo', protect, asyncHandler(async (req, res) => {
    const { paymentInfo } = req.body;
    try {
        const cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            {
              $set: {
                'paymentInfo.cardholderName':paymentInfo.cardholderName,
                'paymentInfo.cardNumber':paymentInfo.cardNumber,
                'paymentInfo.expiry':paymentInfo.expiry,
                'paymentInfo.paidAmount':paymentInfo.paidAmount,
              },
            },
            { new: true }
          );
  
      // Update the cartItems array using the $pull operator to remove the item with the specified product ID
      
      res.status(201).json(cart.paymentInfo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }));

  router.get('/fetchCartItems', protect, asyncHandler(async (req, res) => {
    try {
      let cart = await Cart.findOne({ user: req.user._id });
  
      if (!cart) {
        cart = new Cart({
          user: req.user._id,
          cartItems: [],
          shippingAddress: {
            address: null,
            city:null,
            postalCode:null,
            country:null,
            phoneNumber:null,
          },
          paymentMethod: null,
          paymentInfo: {
            cardholderName: null,
            cardNumber: null,
            expiry: null,
            paidAmount: null
          }
        });
        await cart.save();
      }
  
      res.status(200).json(cart);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }));
  
module.exports = router;
