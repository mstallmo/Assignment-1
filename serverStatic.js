var express = require("express"),
app = express(),
bodyParser = require('body-parser'),
errorHandler = require('errorhandler'),
methodOverride = require('method-override'),
hostname = process.env.HOSTNAME || 'localhost',
port = parseInt(process.env.PORT, 10) || 4567;
port = 8080;
app.get("/", function (req, res) {
  res.redirect("/index.html");
});

var db = require('mongoskin').db('mongodb://user:password@localhost:27017/todo');

var todos = [];

app.get("/addtodo", function (req, res){
  var x = req.query;
  var callback = function(error, result){
    if(!error)
    {
      res.end("added");
    }
  }
  db.collection("todo").insert(x, callback);
});

app.get("/deletetodo", function(req, res){
  var i = req.query.index;
  todos.splice(i,1);
  res.end("deleted");
});

app.get("/listtodos", function(req, res){
  db.collection("todo").find().toArray(function(err, result){
    if (result)
    {
      res.end(JSON.stringify(result));
    }
  });
});

app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/client'));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));

console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port, hostname);
