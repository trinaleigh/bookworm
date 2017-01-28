var express = require('express');
var app = express();
var fetch = require('node-fetch');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/page'));

app.get('/', function(request, response) {
  response.render('page/index');
});

app.get('/books', function(request, response) {

	result = 'book data here'
	response.send(result);

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

