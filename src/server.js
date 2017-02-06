var express = require('express');
var app = express();
var fetch = require('node-fetch');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/static'));

app.get('/', function(request, response) {
  response.render('static/index');
});

app.get('/books/:isbn', function(request, response) {

	isbn = request.params.isbn;

	url = `http://lx2.loc.gov:210/lcdb?version=1.1&operation=searchRetrieve&query=bath.isbn=${isbn}&maximumRecords=1&recordSchema=mods`;

	fetch(url)
    .then(function(result) {
        return result.text();
    }).then(function(body) {
    	console.log(body);
        response.send(body);
    });

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

