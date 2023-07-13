const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required:true,
      default:false,
    },
    language: {
      type: String,
      required: true,
      default: "en",
        },
    country: {
      type: String,
      required: true,
      default:"in"
      },
    currency:{
      type:String,
      required:true,
      default: "inr"
    },
    queries:[{
      type:{type:String},
      query:{type:String},
      active:{type:Boolean, default: false}
    }]
  },
  {
    timestamps: true,
  }
)
/*The code userSchema.methods.matchPassword is defining an instance method matchPassword on a 
userSchema schema object. This method is used to compare an entered password with the hashed 
password stored in the user document.
1. userSchema.methods: The methods property allows you to add custom instance methods to a Mongoose 
schema.
2. matchPassword: This is the name of the custom method you're defining, which you can choose based 
on your preference.
3. async function (enteredPassword): This defines the method as an asynchronous function that takes 
the enteredPassword as a parameter. It represents the password entered by a user during a login or 
authentication process.
4. bcrypt.compare: This is an asynchronous function provided by the bcrypt library. It is used to 
compare a plain text password (enteredPassword) with a hashed password stored in the user document 
(this.password).
5. await bcrypt.compare(enteredPassword, this.password): This line compares the enteredPassword with 
the hashed password (this.password) asynchronously using bcrypt.compare. It returns a promise that 
resolves to a boolean value indicating whether the passwords match or not.
The userSchema.methods.matchPassword method is defined as an instance method on the userSchema. 
You can call this method on a user instance to compare an entered password with the stored hashed 
password.The matchPassword method can be called on a user instance at any time to compare passwords.*/
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}
/*userSchema.pre('save'): This function is a pre-save middleware defined on the userSchema. It runs 
before saving a user document and performs certain actions. In this case, it checks if the password 
field has been modified (using this.isModified('password')). If the password hasn't been modified, 
it calls next() to move to the next middleware. If the password has been modified, it generates a 
salt (bcrypt.genSalt) and hashes the password (bcrypt.hash) using the generated salt. Finally, it 
assigns the hashed password to this.password.*/
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  /*In this case, 10 is the number of rounds or iterations used to generate the salt. The higher the 
  number of rounds, the more secure the salt will be, but it will also require more computational 
  resources and time. A value of 10 is a commonly used and recommended value for the bcrypt algorithm.
  By awaiting the genSalt function, the code ensures that the salt is generated before proceeding to 
  the next line. The generated salt (salt) is then used in the password hashing process to securely 
  hash the password.*/ 
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})
const User = mongoose.model('User', userSchema)
module.exports = User
