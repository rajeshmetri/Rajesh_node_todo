const express = require("express"); 
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config.js");
var mongoose = require('mongoose');

const app = express();

var corsOptions = {
  origin: "http://localhost:8080"
};
var Todo = mongoose.model('Todo', {
  text : String
});
const server = app.listen(8080, function () {

  let host = server.address().address
  let port = server.address().port
  console.log("App listening at http://%s:%s", host, port)
})

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

//simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to demo application." });
});

app.get('/api/todos', function(req, res) {

  // use mongoose to get all todos in the database
  Todo.find(function(err, todos) {

      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err)
          res.send(err)

      res.json(todos); // return all todos in JSON format
  });
});

// create todo and send back all todos after creation
app.post('/api/todos', function(req, res) {

  // create a todo, information comes from AJAX request from Angular
  Todo.create({
      text : req.body.text,
      done : false
  }, function(err, todo) {
      if (err)
          res.send(err);

      // get and return all the todos after you create another
      Todo.find(function(err, todos) {
          if (err)
              res.send(err)
          res.json(todos);
      });
  });

});

// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
  Todo.remove({
      _id : req.params.todo_id
  }, function(err, todo) {
      if (err)
          res.send(err);

      // get and return all the todos after you create another
      Todo.find(function(err, todos) {
          if (err)
              res.send(err)
          res.json(todos);
      });
  });
});


// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);


app.get('*', function(req, res) {
  res.send('./index.html');
});



