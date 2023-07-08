const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    cartItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String },
      city: { type: String},
      postalCode: { type: String},
      country: { type: String},
      phoneNumber: { type: String},
    },
    paymentMethod: {
      type: String
    },
    paymentInfo:{
      cardholderName: { type: String },
      cardNumber: { type: String },
      expiry: { type: String },
      paidAmount: { type: Number },
    },
  },
  {
    /*the timestamps: true option is passed as the second argument to the mongoose.Schema 
    constructor. This instructs Mongoose to automatically add createdAt and updatedAt fields to the 
    documents based on their creation and modification times.*/
    timestamps: true,
  }
)
/*1. mongoose.model: This method is used to create a new Mongoose model.
  2. 'Order': The first argument to mongoose.model is the singular name of the collection that the 
  model represents. In this case, the model represents the "Order" collection.
  3. orderSchema: The second argument is the schema object that defines the structure and behavior 
  of the documents in the collection. orderSchema is the schema object used to define the "Order" 
  schema.*/ 
const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart

