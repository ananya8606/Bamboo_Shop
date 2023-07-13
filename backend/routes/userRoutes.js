const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken.js');
const User = require('../models/User.js');
const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware.js');
const Query = require('../models/Query.js')
const capitalize = require('../utils/capitalize.js');
const router = express.Router()

router.post(
  '/register/:funcNumber',
  asyncHandler(async (req, res) => {
    console.log('hello')
    const { name, email, password } = req.body

    console.log(req.params.funcNumber)
    const operation = req.params.funcNumber
    if (operation == 'formfillup') {
      console.log('formfillup')
      const userExists = await User.findOne({ email })

      if (userExists) {
        res.status(400)
        throw new Error('User already exists')
      }

      const user = await User.create({
        name,
        email,
        password,
      })

      if (user) {
        res.status(201).json({
          _id: user._id,
          name: capitalize(user.name),
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        })
      } else {
        res.status(400)
        throw new Error('Invalid user data')
      }
    } else {
      console.log('googlesignin')
      console.log(req.body)
      const userExists = await User.findOne({ email })
      if (userExists) {
        //code goes here
        console.log('user already exists')
        res.status(201).json({
          _id: userExists._id,
          name: userExists.name,
          email: userExists.email,
          isAdmin: userExists.isAdmin,
          token: generateToken(userExists._id),
        })
      } else {
        const password = user.email+Date.now();
        const user = await User.create({
          name,
          email,
          password,
        })

        if (user) {
          res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
          })
        } else {
          res.status(400)
          throw new Error('Invalid user data')
        }
      }
    }
  })
)

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      res.status(401)
      throw new Error('Invalid email or password')
    }
  })
)
//update user

router.put(
  '/updateUser',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email

      if (req.body.password) {
        user.password = req.body.password
      }
      const updatedUser = await user.save()

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      })
    } else {
      res.status(401)
      console.log(error)
      res.json('error')
    }
  })
)

router.get(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const users = await User.find().select('-password')

    if (users) {
      res.json(users)
    } else {
      res.status(401)
      throw new Error('No users found')
    }
  })
)
router.get(
  '/user/:id',
  protect,
  asyncHandler(async (req, res) => {
    console.log("back")
    const user = await User.findById({ _id: req.params.id }).select('-password')

    if (user) {
      res.json(user)
    } else {
      res.status(401)
      throw new Error('No users found')
    }
  })
)
router.delete(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    try {
      await User.findByIdAndDelete({ _id: req.params.id })
      res.status(201).json('Successfully deleted')
    } catch (error) {
      res.status(401)
      throw new Error('No users found')
    }
  })
)

router.put(
  '/user/updateLanguage',
  protect,
  asyncHandler(async (req, res) => {
    const  {language, country, currency} = req.body;
    const user = await User.findById(req.user._id)
    console.log(user)
    if (user) {
      user.language = language;
      user.country = country;
      user.currency =currency;
      await user.save()
      res.status(201).json(
        {
        language:user.language,
        country:user.country,
        currency:user.currency
        }
      )
    } else {
      res.status(401)
      console.log(error)
      res.json('error')
    }
  })
)

router.get(
  '/fetchLanguage',
  protect,
  asyncHandler(async (req, res) => {
    console.log(req.user._id)
    const user = await User.findById(req.user._id)
    if(user){
      res.status(200).json(
        {
        language:user.language,
        country:user.country,
        currency:user.currency
        }
      )
    }
     else {
      res.status(400)
      console.log(error)
      res.json('error')
    }
  })
)

router.post(
  '/query',
  protect,
  asyncHandler(async (req, res) => {
    const { type, query } = req.body;
    const user = await User.findById(req.user._id);
    if (user) {
      const newQuery = new Query({
        user: req.user._id,
        email: user.email,
        type: type,
        query: query,
        active: true
      });

      await newQuery.save(); // Save the new query
      const active = true;
      user.queries.push({ type, query, active }); // Add the new query to the queries array
      await user.save(); // Save the updated user document
      res.status(201).json("Query Created"); // Return the success message
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  })
);

router.get(
  '/admin/allqueries',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const data = await Query.find()
    if (data) {
      res.status(201).json(data)
    } else {
      res.status(403)
      throw new Error('You have no queries till date admin')
    }
  })
)



router.put(
  '/admin/changequerystatus/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const query = await Query.findOne({ _id: req.params.id });
    const user = await User.findById(query.user._id);
    if (query && user) {
      const queryIndex = user.queries.findIndex(q => {
        const qId = parseInt(q._id.toString(), 16); // Convert q's ObjectId to number
        const queryId = parseInt(query._id.toString(), 16); // Convert query's ObjectId to number
        return qId === queryId + 1;
      });
      console.log(queryIndex)
      if (queryIndex !== -1) {
        query.active = !query.active;
        user.queries[queryIndex].active = query.active
        await query.save();
        await user.save();
        res.status(201).json('Success');
      } else {
        res.status(404).json('Query not found');
      }
    } else {
      res.status(401).json('Unauthorized');
    }
  })
);


module.exports = router
