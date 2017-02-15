var express = require('express');
var app = express();
var fetch = require('node-fetch');
var cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var mongoUrl = process.env.MONGODB_URI;

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/static'));

app.get('/', function(request, response) {
  response.render('static/index');
});

app.get('/user', function(request, response) {

  MongoClient.connect(mongoUrl, function(err, db) {
    assert.equal(null, err);
    var findDocuments = function(db,callback) {
      // Get the documents collection
      var collection = db.collection('readers');
      // Find some documents
      collection.find({'userid': '001'}).toArray(function(err, docs) {
        assert.equal(err, null);
        var userISBNs = docs[0].isbns;
        callback(userISBNs);
      });   
    }
    findDocuments(db, function(isbns){
      response.send(isbns)});
    db.close();
  });


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

  urls = ["http://www.greenlightbookstore.com/staffpicks",
              "http://www.bookpeople.com/staff-picks", 
              "http://www.inkwoodbooks.com/storepicks",
              "http://www.tatteredcover.com/tc-staff-picks"];

  var n = Math.floor(Math.random()*urls.length);
  url = urls[n];

  fetch(url)
      .then(function(result){
          return result.text();
      }).then(function(body) {
            var $ = cheerio.load(body);

            var store = $('title').text()

            var bookList = [];

            // get details for staff picks
            $('.abaproduct-details').filter(function(){

                var data = $(this);

                var recommendation = { title : "", author : "", isbn: "", url: url, store: store};

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

