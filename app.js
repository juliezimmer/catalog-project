//using ES6
const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');

//This variable defines the database.
//The 1st parameter is the name of the database, catalog.
//The 2nd parameter is an array of collection(s) used in db.
//This db has only one collection, products.
const db = mongojs('catalog',['products']);

//initialize the app with an instance of express
const app = express();

//port variable; where the app will run: localhost:3000
const port = 3000;

//middleware for bodyParser
app.use(bodyParser.json());

//middleware for cors (cross-origin resource sharing).
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//home page "get" request 
app.get('/', (req,res,next) => {
    res.send("Please use /api/products"); /*this route : '/api/products' will provide a list of products in the catalog */
});

// ********** GET requests ********** //
//product route "get" all products request
app.get('/api/products', (req,res,next) => {
  /*the database query goes in the function.
    find() has a callback function that takes two parameters.
    The 1st parameter is err.
    The 2nd parameter is docs, which is what will be returned from the db query if successful. */
    db.products.find((err, docs) => {
      //check for the error
      if (err) {
        //send the error code
        res.send(err);
      } else { //if the query is successful
        console.log("Products found!");
        //this sends the response back as a JSON file or object
        res.json(docs);
      }
    });//end db query   
  });//end of app.get method

/*product route "get" item by id request
  .findOne() used instead of .find().
  _id: (the ObjectId)is matched to find the item.
  The _id:, which comes from req.params.id, must wrapped in:    mongojs.ObjectId(req.params.id).
  Note that "docs" is changed to "doc" in the callback function in the db query, because only one product is being requested. */
app.get('/api/products/:id', (req,res,next) => {
  db.products.findOne({_id: mongojs.ObjectId(req.params.id)}, (err, doc) =>   {
    if (err) {
      res.send(err);
    } 
    console.log("Product found: ", doc);
    res.json(doc);
  });
});

// ********** POST requests ********** //
/*Product is being submitted/added to the database
  req.body is the entire body of the product that is being added(?) 
  If just a part of the req.body object were being used or submitted, that part of the object being updated would be added to req.body in the form of: req.body.name or req.body.address or req.body.email, etc.  */ 
app.post('/api/products', (req,res,next) => {
   db.products.insert(req.body, (err, doc) => {
      if (err) {
        res.send(err);
      } else{
        console.log("Adding Product: ", doc);
        res.send(doc);
      }
   });
});

// ********** PUT requests ********** //
//update a product already in the database using id
app.put('/api/products/:id', (req,res,next) => {
  db.products.findAndModify({query: {_id: mongojs.ObjectId(req.params.id)}, update:{
      $set:{
        name: req.body.name, //name of product
        category: req.body.category,
        details: req.body.details,
      }},
      new: true }, /*this is like upsert. It asks if the item isn't there, should it be added? true indicates that it should be added. */
      (err, doc) => {//the callback function
        if (err) {
          res.send(err);
        } else {
          console.log("Updating prodcut: ", doc);
          res.json(doc);
        }
    })
});

// ********** DELETE requests ********** //
//delete item from database using id
app.delete('/api/products/:id', (req,res,next) => {
  db.products.remove({_id: mongojs.ObjectId(req.params.id)}, (err, doc) => {
    if (err) {
      res.send(err);
    } else {
      console.log("Deleting product: ", doc);
      res.json(doc);
    }
  });
});

//To run the server:
//callback function is anonymous in this method.
app.listen(port, () =>{
  console.log("Server started on: ", port);
});

