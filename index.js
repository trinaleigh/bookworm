var express = require('express');
var app = express();
var fetch = require('node-fetch');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/page'));

app.get('/', function(request, response) {
  response.render('page/index');
});

app.get('/books', function(request, response) {

	fetch('http://lx2.loc.gov:210/lcdb?version=1.1&operation=searchRetrieve&query=bath.isbn=9780486415918&maximumRecords=1&recordSchema=mods')
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

