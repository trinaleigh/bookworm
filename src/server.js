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

app.get('/staffpicks', function(request, response) {

  urls = ["http://www.greenlightbookstore.com/staffpicks","http://www.bookpeople.com/staff-picks"];

  var n = Math.floor(Math.random()*urls.length);
  url = urls[n];

  fetch(url)
      .then(function(result){
          return result.text();
      }).then(function(body) {
            var $ = cheerio.load(body);

            var bookList = [];

            // get details for staff picks
            $('.abaproduct-details').filter(function(){

                var data = $(this);

                var recommendation = { title : "", author : "", isbn: "", url: url};

                recommendation.title = data.children('.abaproduct-title').text();
                recommendation.author = data.children('.abaproduct-authors').text();
                recommendation.isbn = data.children('.abaproduct-isbn').text();

                bookList.push(recommendation);

            })

            // display a random book from the list
            var i = Math.floor(Math.random()*bookList.length);
            response.send(bookList[i]);

      })

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

