var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send('Hello World 2!');
  }); 

//var indexToDisplay = fs.readFileSync('index.html');
//console.log(indexToDisplay);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});