var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

var indexToDisplay = fs.readFileSync('index.html');
var buf = indexToDisplay.toString();

app.get('/', function(request, response) {
	//response.send('Hello World 22!');
	response.send(buf);
	});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});