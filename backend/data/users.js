const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Admin',
    email: 'a@gmail.com',
    password:bcrypt.hashSync('123456', 10),
    isAdmin:false,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
]

module.exports = users
