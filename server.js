/**
 * Created by presspage-joaobarradas on 4/30/16.
 */

// set up ========================
var express = require('express');
var app = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================

mongoose.connect('mongodb://root:root@jello.modulusmongo.net:27017/dariT3uj');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");

//I INSTALLED NODEMON SO THE THE SERVER WILL RESTART WHEN CHANGES ARE MADE
// TO START THE SERVER WITH NODEMON USE NODEMON SERVER.JS


var Todo = mongoose.model('Todo', {

    text: String,
    categorie: String
    //this is just the text of the to-do item
    //MongoDb will automatically generate a _id for each of to-do that we create
});

//EXPRESS ROUTES TO HANDLE THE API CALL

//get all todos
app.get('/api/todos', function (req, res) {

    //use mongoose to get all todos in the db

    Todo.find(function (err, todos) {

        //if there is an error retrieving data , send the error , nothing will be executed after res.send
        if (err)
            res.send(err)


        // return all todos in json format
        console.log(todos);
        res.json(todos)

    });


});


//create a to-do and send back all todos after creation

app.post('/api/todos', function (req, res) {

    Todo.create({

        text: req.body.text,
        categorie: req.body.categorie,
        done: false


    }, function (err, todo) {

        if (err)
            res.send(err);
            console.log(todo);

        //get all todos after you create another

        Todo.find(function (err, todos) {

            if (err)
                res.send(err)
            res.json(todos);

        });

    });

});

//delete todo
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

// application -------------------------------------------------------------

//this is needed to display our index.html at our front page
// and will load the index.html file when we hit the localhost:8080
app.get('*', function(req, res) {
    res.sendFile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)

});



