var express = require('express');
var app = express();
var fetch = require('node-fetch');
var cheerio = require('cheerio');

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
        response.send(body);
    });

});

app.get('/explore/store', function(request, response) {

  url = "http://www.greenlightbookstore.com/staffpicks";

  fetch(url)
      .then(function(result){
          return result.text();
      }).then(function(body) {
            var $ = cheerio.load(body);

            var title;
            var json = { title : ""};

            $('.abaproduct-title').filter(function(){

                var data = $(this);

                title = data.children().first().children().first().text();

                json.title = title;

            })

            response.send(json);

      })

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

