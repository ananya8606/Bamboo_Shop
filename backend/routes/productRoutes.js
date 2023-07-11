const Product = require('../models/Product.js');
const asyncHandler = require('express-async-handler');
const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const { protect, admin } = require('../middleware/authMiddleware.js');
const cloudinary = require('cloudinary');
dotenv.config()
const cloudinaryconfig = cloudinary.v2

cloudinaryconfig.config({
  cloud_name:'ananyaiiitr',
  api_key:'574957229525692',
  api_secret:'uZ_gRY43x6b2MCBNYPGcLR75RjM',
});
/*destination: Specifies the directory where uploaded files should be stored. In this case, the 
destination is set to 'Images', indicating that the uploaded files will be saved in a directory 
named "Images". The cb callback function is invoked with null as the error parameter and the 
destination directory as the second parameter.
filename: Specifies the filename for the uploaded file. In this case, the filename is set to the 
current timestamp concatenated with the original file extension. The cb callback function is invoked 
with null as the error parameter and the generated filename as the second parameter.
The multer.diskStorage() function is used to create a new disk storage engine for multer. This engine
provides control over where files are stored and how their filenames are determined.*/ 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('value', path.extname(file.originalname))
    console.log('file', file)
    cb(null, 'Images')
  },
  filename: function (req, file, cb) {
    console.log('path', path)
    // console.log('value', path.extname(file.originalname))
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

/*implementing a file filter function to determine which files should be accepted and which ones 
should be rejected during the file upload process using multer middleware in Node.js.
1. allowedFileTypes: An array of allowed file types. In this case, it includes the MIME types for 
JPEG (image/jpeg), JPG (image/jpg), and PNG (image/png) files.
2. The file filter function is defined as an async function with three parameters: req (the request 
  object), file (the file being uploaded), and cb (the callback function).
3. Inside the file filter function, it checks if the mimetype of the uploaded file is included in 
the allowedFileTypes array. If it is, the file is considered valid and the callback function cb is 
invoked with null as the error parameter and true as the second parameter. This indicates that the 
file should be accepted.
4. If the mimetype is not included in the allowedFileTypes array, it sets req.filevalidationerror to 
the message 'Unsupported file format'. This can be used later to handle the validation error in 
subsequent middleware or route handlers.
5. Finally, it invokes the callback function cb with null as the error parameter, 
req.filevalidationerror as the second parameter (indicating the validation error), and false as the 
third parameter. This indicates that the file should be rejected.
The file filter function allows you to specify the types of files that are allowed for upload based 
on their MIME types. If a file's MIME type matches one of the allowed types, it is considered valid 
and will be accepted. Otherwise, it is rejected with an appropriate error message.
*/ 
const fileFilter = async (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (allowedFileTypes.includes(file.mimetype)) {
    console.log('reached inside multer')
    cb(null, true)
  } else {
    req.filevalidationerror = 'Unsupported file format'
    return cb(null, req.filevalidationerror, false)
  }
}
/*The upload variable is assigned the configured multer instance, which can be used as middleware in 
your routes to handle file uploads.
By configuring multer with the storage and fileFilter options, you can control where and how the 
uploaded files are stored and enforce validation on the file types to ensure that only allowed file 
types are accepted.*/ 
let upload = multer({ storage, fileFilter })

const router = express.Router()
/*1. The route handler is defined using router.route('/uploadImage').post(...), indicating that it 
handles the POST method for the '/uploadImage' URL.
2. upload.single('image') is a multer middleware that processes the file upload. It expects a single 
file with the field name 'image' in the request payload. The uploaded file is then stored in the 
destination directory specified in the multer configuration.
3. The route handler function is an asyncHandler, which is an error handling wrapper for asynchronous 
route handlers. It allows you to handle any errors that occur during asynchronous operations.
4. Inside the route handler function, the uploaded file's path is retrieved from req.file.path.
5. If req.filevalidationerror exists, it means that the file did not pass the file filter validation 
in the multer configuration. In that case, the uploaded file is deleted using fs.unlink, and a 401 
status response with an error message is sent.
6. If there are no validation errors, the uploaded file is uploaded to the Cloudinary service using 
the cloudinary.uploader.upload function. Upon successful upload, the uploaded file's URL is extracted 
from the result and stored in the url variable.
7. The uploaded file on the server is then deleted using fs.unlink, and a 201 status response with the 
uploaded file's URL is sent as a JSON response.
8.If any errors occur during the file upload or Cloudinary upload process, a 400 status response with 
an error message is sent.
Overall, this route handler allows clients to upload an image file, validate it, upload it to the 
Cloudinary service, and respond with the uploaded image's URL.*/
router.route('/uploadImage').post(
  upload.single('image'),
  protect,
  admin,
  asyncHandler(async (req, res) => {
    console.log('reached here')

    const photopath = req.file.path

    if (req.filevalidationerror) {
      fs.unlink(photopath, function (err) {
        console.log('reached here')
        if (err) return console.log(err)
        console.log('file deleted successfully')
      })
      res.status(401).json({ msg: req.filevalidationerror })
    } else {
      try {
        await cloudinary.uploader.upload(photopath, function (result, error) {
          console.log('result', result)
          const url = result.url
          fs.unlink(photopath, function (err) {
            console.log('reached here')
            if (err) return console.log(err)
            console.log('file deleted successfully')
          })
          res.status(201)
          res.json(url)
        })
      } catch (error) {
        res.status(400).json({ msg: error })
      }
    }
  })
)
router.get(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const data = await Product.find()
      if (data) {
        res.status(200).json(data)
      }
    } catch (error) {
      res.status(403).json(error)
    }
  })
)

router.get(
  '/category/:categoryName/:cost',
  asyncHandler(async (req, res) => {
    try {
      const data = await Product.find({
        category: req.params.categoryName,

        discountedCost: { $lt: req.params.cost },
      })
      if (data) {
        res.status(200).json(data)
      }
    } catch (error) {
      res.status(403).json(error)
    }
  })
)

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    try {
      const data = await Product.findOne({ _id: req.params.id })
      if (data) {
        res.status(200).json(data)
      }
    } catch (error) {
      res.status(403).json(error)
    }
  })
)

router.get(
  '/subcategory/:subcategoryName/:cost',
  asyncHandler(async (req, res) => {
    try {
      const data = await Product.find({
        subCategory: req.params.subcategoryName,

        discountedCost: { $lt: req.params.cost },
      })
      if (data) {
        res.status(200).json(data)
      }
    } catch (error) {
      res.status(403).json(error)
    }
  })
)
/*The Product.find() method is used to search for products in the database. It searches for products 
where the brandName field matches the regular expression provided. The $regex operator is used for
 pattern matching, and the $options operator with the value '$i' is used to perform a 
 case-insensitive search. */
 router.get(
  '/search/:productName',
  asyncHandler(async (req, res) => {
    try {
      const data = await Product.find({
        brandName: { $regex: req.params.productName, $options: 'i' },
      })
      if (data) {
        res.status(200).json(data)
      } else {
        res.status(404).json({ message: 'No products found' })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
);



//delete product

router.delete(
  '/product/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    try {
      await Product.findByIdAndDelete({ _id: req.params.id })

      res.status(200).json('success')
    } catch (error) {
      res.status(403).json(error)
    }
  })
)
//update product

router.put(
  '/product/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    try {
      const {
        brandName,
        image,
        brand,
        category,
        subCategory,
        description,
        discount,
        cost,
        quantity,
      } = req.body
      console.log('id', req.params.id)
      console.log(req.body)
      const product = await Product.findById({ _id: req.params.id })
      // console.log('product is', product)
      if (product) {
          (product.brandName = brandName),
          (product.image = image || product.image),
          (product.brand = brand),
          (product.category = category),
          (product.subCategory = subCategory),
          (product.description = description),
          (product.discount = discount),
          (product.cost = cost),
          (product.quantity = quantity),
          (product.discountedCost = product.discount
            ? product.cost - (product.discount * product.cost) / 100
            : product.cost)
        const updatedProduct = await product.save()
        if (updatedProduct) {
          res.status(201).json('Successfully updated')
        } else {
          res.status(401).json(error)
        }
      }
    } catch (error) {
      res.status(403).json(error)
    }
  })
)

// create a new product

router.post(
  '/productCreate',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    try {
      console.log('reached')
      const {
        brandName,
        image,
        brand,
        category,
        subCategory,
        description,
        discount,
        cost,
        quantity,
      } = req.body
      console.log(req.body)

      const discountedCost = discount ? cost - (discount * cost) / 100 : cost

      await Product.create({
        user: req.user,
        brandName,
        image,
        brand,
        category,
        subCategory,
        description,
        discount,
        cost,
        quantity,
        discountedCost,
      })

      res.status(201).json('Product created successfully')
    } catch (error) {
      res.status(403).json(error)
    }
  })
)

router.post(
  '/:id/reviews',
  protect,
  asyncHandler(async (req, res) => {
    const { stars, description } = req.body
    const product = await Product.findById(req.params.id)
    if (product) {
      const review = {
        reviewedBy: req.user.name,
        stars: Number(stars),
        description,
        user: req.user._id,
      }
      product.reviews.push(review)
    /*1. product.reviews is an array of reviews associated with the product.
      2. The code uses the reduce() method on the product.reviews array to calculate the sum of all 
         the star ratings in the reviews.
      3. The initial value of the accumulator (acc) is set to 0.
      4. In each iteration of the reduce() method, the star rating (item.stars) of the current review 
         is added to the accumulator (acc).
      5. The result of the reduce() method is the sum of all the star ratings.
      6. The sum of the star ratings is divided by the length of the product.reviews array to 
         calculate the average star rating.
      7. The calculated average star rating is assigned to product.stars, updating the stars property 
         of the product object with the new value.
       By performing this calculation, the code determines the average star rating for a product 
       based on its associated reviews. The resulting average is stored in the product.stars property 
       for further use or display.*/ 
      product.stars =
        product.reviews.reduce((acc, item) => item.stars + acc, 0) /
        product.reviews.length
      await product.save()
      res.status(201).json({ message: 'Review added' })
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  })
)

router.post('/uploadCSV', protect, admin, upload.single('file'), async (req, res) => {
  const csvFilePath = req.file.path;

  try {
    const results = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => {
          console.log(data);
          results.push(data);
        })
        .on('end', () => {
          resolve(); // Resolve the promise when the CSV processing is finished
        })
        .on('error', (error) => {
          reject(error); // Reject the promise if there's an error during CSV processing
        });
    });

    // Process the CSV data and save it to the database
    for (const item of results) {
      const product = new Product({
        user: req.user._id,
        brandName: item.brandName,
        image: item.image,
        brand: item.brand,
        category: item.category,
        subCategory: item.subCategory,
        description: item.description,
        discount: item.discount,
        cost: item.cost,
        quantity: item.quantity,
        discountedCost: item.discount
          ? item.cost - (item.discount * item.cost) / 100
          : item.cost,
      });

      // Save the product to the database
      try {
        await product.save();
      } catch (error) {
        console.error('Error saving product to database:', error);
        continue; // Skip saving the product if there's an error saving it to the database
      }
    }

    res.status(201).json({ message: 'CSV file uploaded successfully' });
  } catch (error) {
    // Delete the uploaded CSV file on error
    fs.unlink(csvFilePath, (err) => {
      if (err) {
        console.error('Error deleting CSV file:', err);
      }
    });
    res.status(400).json({ message: 'CSV file upload failed' });
  }
});


module.exports = router
