//using ES6
const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');

//initialize the app with an instance of express
const app = express();

//port variable
const port = 3000;

//Middleware for bodyParser
app.use(bodyParser.json());

//home page "get" request 
app.get('/', (req,res,next) => {
    res.send("Please use /api/products"); /*this route : '/api/products' will provide a list of products in the catalog */
});

// ********** GET requests ********** //
//product route "get" all products request
app.get('/api/products', (req,res,next) => {
    res.send("List of Products"); /*this route : '/api/products' will provide a list of products in the catalog */
});

//product route "get" item by id request
app.get('/api/products/:id', (req,res,next) => {
    res.send("Fetch Product " +req.params.id)  
});

// ********** POST requests ********** //
//product is being submitted/added to the database
app.post('/api/products', (req,res,next) => {
    console.log("Add product");
});

// ********** PUT requests ********** //
//update a product already in the database using id
app.put('/api/products/:id', (req,res,next) => {
  console.log("Update Product " +req.params.id);
});

// ********** DELETE requests ********** //
//delete item from database using id
app.delete('/api/products/:id', (req,res,next) => {
  console.log("Delete Product " +req.params.id);
});

//To run the server:
//callback function is anonymous in this method.
app.listen(port, () =>{
  console.log("Server started on: ", port);
});

