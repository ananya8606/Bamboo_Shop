const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
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
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    paymentInfo:{
      cardholderName: { type: String },
      cardNumber: { type: String },
      expiry: { type: String },
      paidAmount: { type: Number },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
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
const Order = mongoose.model('Order', orderSchema)

module.exports = Order
