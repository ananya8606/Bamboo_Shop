const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const productRoutes = require('./routes/productRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const path = require('path');
const orderRoutes = require('./routes/orderRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');
const cors = require("cors");
dotenv.config()
connectDB()

const app = express()

const corsOptions = {
  origin: "https://bamboo-shop-zh9v.onrender.com" // frontend URI (ReactJS)
}

/* Moved the app.use(cors(corsOptions)) middleware above app.use(express.json()) to ensure
 that the CORS headers are set correctly before processing the request body.*/
 
app.use(cors(corsOptions));

/*When using express.json(), any incoming request with a Content-Type header of 'application/json' 
will be parsed by Express and the resulting JSON data will be available in req.body property.
By calling app.use(express.json()), you are instructing your Express application to use this 
middleware for all incoming requests.*/
app.use(express.json())

/*app.use('/api/products', productRoutes) is configuring the Express application to use the 
productRoutes middleware for any requests that match the /api/products path.*/
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/cart', cartRoutes)
/*app.use(express.static(path.join(__dirname, '/frontend/build'))): This line sets up a static file 
server to serve the static files located in the /frontend/build directory. 
It uses the express.static middleware to serve the files.
 The app.get('*') route is defined to handle all GET requests. It uses the res.sendFile function to 
 send the index.html file from the frontend/build directory in response. path.resolve is used to 
 generate the absolute path of the index.html file.
 If the NODE_ENV is not set to 'production', which means the application is running in a development 
 or non-production environment, the following action is performed:
 The app.get('/') route is defined to handle the root route. It sends a simple response of 
'API is running...' to indicate that the API is up and running.*/
if (process.env.NODE_ENV === 'production') {
  /*A static server is a web server that serves static files to clients upon request. Static files 
  are files that are delivered to the client as they are, without any server-side processing. These 
  files are typically HTML, CSS, JavaScript, images, videos, or any other files that make up the 
  structure and content of a website or web application.
Static files are called "static" because their content remains the same regardless of the user or 
the context in which they are requested. They are pre-existing files that are stored on the server 
and can be directly served to the client without any modification.
When a client makes a request for a static file, the static server retrieves the file from the 
specified location on the server's file system and sends it back to the client as the response. 
The client's web browser then interprets and renders the static file according to its file type.
Static files are an essential part of web development and are commonly used to deliver the front-end 
resources required to build the user interface and functionality of a website or web application. 
They are often stored in specific directories (such as /public or /static) within the project's file 
structure to distinguish them from server-side code files.*/
  app.use(express.static(path.join(__dirname, '../frontend/build')))
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running...')
  })
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://bamboo-shop-zh9v.onrender.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use((req, res, next) => {
  const error = new Error(`Not found -${req.originalUrl}`)
  res.status(404)
  next(error)
})
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  console.log('err', err)
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})
