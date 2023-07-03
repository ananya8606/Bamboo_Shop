const dotenv = require('dotenv');
const users = require('./data/users.js');
const products = require('./models/User.js');
const Product = require('./models/Product.js');
const Order = require('./models/Order.js');
const connectDB = require('./config/db.js');

dotenv.config()

connectDB()
/*1. The await Order.deleteMany() statement deletes all documents in the Order collection.
2. The await Product.deleteMany() statement deletes all documents in the Product collection.
3. The await User.deleteMany() statement deletes all documents in the User collection.
4. The await User.insertMany(users) statement inserts multiple user documents into the User collection. The users variable likely contains an array of user objects.
5. The adminUser variable is assigned the _id of the first user created (assuming the first user is 
   an admin user).
6. The newProductList variable is created by mapping over the products array and modifying each 
   product object. The user property of each product is set to adminUser, and the discountedCost 
   property is calculated based on the discount and cost properties of the product.
7. The await Product.insertMany(newProductList) statement inserts multiple product documents into the
   Product collection. The newProductList array contains the modified product objects.
8. Finally, console logs are used to indicate that the data import is successful, and the process is
   exited.*/ 
const importData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    const createdUsers = await User.insertMany(users)

    const adminUser = createdUsers[0]._id
    const newProductList = products.map((product) => {
      const discount = product.discount
      const cost = product.cost
      return {
        ...product,
        user: adminUser,
        discountedCost: discount ? cost - (discount * cost) / 100 : cost,
      }
    })
    console.log(newProductList)

    await Product.insertMany(newProductList)

    console.log('Data Imported!')
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    console.log('Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1) //the process.exit() function is called to terminate the Node.js process
  }
}
/*1.process.argv is an array that contains the command-line arguments provided when running the script.
2. process.argv[2] refers to the third element in the process.argv array, which is the argument at 
index 2.
3. The conditional statement checks if process.argv[2] is equal to '-d', indicating that the script 
was run with the -d flag.
4. If process.argv[2] is equal to '-d', the code calls the destroyData() function.
5. If process.argv[2] is not equal to '-d', indicating that the script was run without the -d flag, 
the code calls the importData() function.
This allows you to control the behavior of the script based on the command-line arguments provided. 
If the script is run with the -d flag, it will destroy existing data. Otherwise, it will import new 
data. */
if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
