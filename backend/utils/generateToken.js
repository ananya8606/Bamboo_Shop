const jwt = require('jsonwebtoken');
/*1.The function takes an id parameter, which represents the identifier of the user or entity for 
which the token is being generated.
2. The jwt.sign() function is called to create the JWT. It takes three arguments:
a. The first argument is an object containing the payload to be included in the token. In this case, 
it includes the id as the payload.
b. The second argument is the secret key used to sign and verify the token. It is retrieved from the 
environment variable process.env.JWT_SECRET.
c. The third argument is an options object that can specify additional configurations for the token. 
In this case, the expiresIn property is set to '30d', indicating that the token will expire after 30 
days.
3. The jwt.sign() function returns the generated token as a string.
4. The generateToken function then returns the token as the output.*/
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = generateToken
