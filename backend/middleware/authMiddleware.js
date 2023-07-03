const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');
/*By wrapping your asynchronous route handlers with asyncHandler, you don't need to explicitly handle
  errors using try-catch blocks. Any errors that occur within the async function will be automatically
  passed to Express's default error handler, allowing you to handle them in a centralized 
  error-handling middleware. */
const protect = asyncHandler(async (req, res, next) => {
  let token;
/*checking if the request has an Authorization header and if the 
value of the header starts with the string "Bearer". This is a common way to authenticate and 
authorize API requests using a Bearer token.
Typically, the Bearer token is included in the Authorization header of the request, following the 
"Bearer" keyword and a space. For example:
Authorization: Bearer your-token-goes-here*/ 
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {

    try {
      /*extracts the token from the Authorization header by splitting the header value at the space 
      character (' '). It assumes that the token is provided after the space character.
      1. req.headers.authorization: Accesses the Authorization header from the request headers object.
      2. split(' '): Splits the header value into an array of substrings based on the space character 
      (' '). This separates the "Bearer" keyword from the token.
      3. [1]: Accesses the second element of the resulting array, which should be the token. The 
      token is retrieved and assigned to the variable token.*/
      token = req.headers.authorization.split(' ')[1] 
      /*The jwt.verify() function takes two parameters: the token itself and the secret key used to 
      sign the token. It verifies the token's signature and decodes its payload.
       The result of the verification operation is assigned to the decoded variable. This variable 
       holds the decoded payload of the JWT, which typically contains information such as the user 
       ID or any other relevant data embedded in the token.
       process.env.JWT_SECRET refers to an environment variable (JWT_SECRET) that should be set with 
       the secret key used to sign and verify your JWT tokens.*/ 
      const decoded = jwt.verify(token, process.env.JWT_SECRET) 
      /*The line req.user = await User.findById(decoded.id).select('-password') retrieves the user 
      information from the database based on the decoded user ID from the JWT payload. It assigns 
      the retrieved user object to the req.user property, which can be accessed in subsequent 
      middleware or route handlers.
      .select('-password'): This part of the code specifies that the password field should be 
      excluded from the retrieved user object. This is a common practice to prevent sending sensitive 
      information, such as passwords, in the response.*/ 
      req.user = await User.findById(decoded.id).select('-password')
      /*The next() function is a callback function that is used to pass control to the next middleware
       function in the request-response cycle. It is typically called at the end of a middleware 
       function to indicate that it has completed its processing and the next middleware or route 
       handler should be called.
       In the context of Express.js, middleware functions are functions that have access to the 
       request (req), response (res), and next parameters. They can perform tasks such as modifying 
       the request or response objects, executing additional logic, or terminating the 
       request-response cycle by sending a response. */
       next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }
/*If the token is falsy, it means that no token was found in the request.*/
  if (!token) {
    res.status(401)
    /*Since the error is thrown within the middleware function, it will trigger Express's error 
    handling middleware, allowing you to handle the error appropriately. The error handling 
    middleware can be defined using app.use with four parameters (err, req, res, next), or using a 
    separate error handling middleware function.*/
    throw new Error('Not authorized, no token')
  }
})

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}

module.exports = { protect, admin }
