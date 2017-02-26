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

app.get('/staffpicks', function(request, response) {

  var urls = ['http://www.greenlightbookstore.com/staffpicks',
              'http://www.bookpeople.com/staff-picks', 
              'http://www.inkwoodbooks.com/storepicks',
              'http://www.tatteredcover.com/tc-staff-picks',
              'http://www.elliottbaybook.com/',
              'http://www.goldennotebook.com/staff-picks'];

  var n = Math.floor(Math.random()*urls.length);
  var url = urls[n];

  fetch(url)
      .then(function(result){
          return result.text();
      }).then(function(body) {
            var $ = cheerio.load(body);

            var store = $('title').text()

            // get details for staff picks
            var recList = $('.abaproduct-details').map(function(){

                var data = $(this);

                var title = data.children('.abaproduct-title').text();
                var author = data.children('.abaproduct-authors').text();
                var isbn = data.children('.abaproduct-isbn').text();

                var recommendation = { 
                    title, 
                    author, 
                    isbn, 
                    url, 
                    store};

                return recommendation;

            })

            // display a random book from the list
            var i = Math.floor(Math.random()*recList.length);
            var choice = recList[i];

            // clear variables
            recList = null;
            $ = null;
            store = null;
            url = null;

            response.send(choice);

      })

});

app.get('/newsfeed', function(request, response) {

  // check RSS feeds from book news sources
  var urls = ['http://www.npr.org/rss/rss.php?id=1032',
          'http://rss.nytimes.com/services/xml/rss/nyt/Books.xml',
          'http://www.publishersweekly.com/pw/feeds/section/industry-news/index.xml',
          'https://www.buzzfeed.com/books.xml',
          'https://www.bookbrowse.com/rss/book_news.rss'];

  function getFeed(url) {
      feedItem = fetch(url)
          .then(function(result){
              return result.text();
          }).then(function(body) {
                var $ = cheerio.load(body, {xmlMode: true});

                var source = $('title').first().text();
                var sourceLink = $('link').first().text();
                var story = $('item').first().children('title').text();
                var storyLink = $('item').first().children('link').text();
                
                var feedItem = {
                  source,
                  sourceLink,
                  story,
                  storyLink };

                return feedItem;
          })

      return new Promise(function(resolve, reject) {      
          if (feedItem) {
              resolve(feedItem);
          } else {
            reject(Error("newsfeed failed"));
          }

        })
      }

  // send the parsed feed data

  Promise.all(urls.map(getFeed)).then(function(value) {response.send(value)})

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


app.get('/user/:userid', function(request, response) {

  var userid = request.params.userid;

  MongoClient.connect(mongoUrl, function(err, db) {
    assert.equal(null, err);
    var findDocuments = function(db,callback) {
      // Get the documents collection
      var collection = db.collection('readers');
      // Find some documents
      collection.find({'userid': userid}).toArray(function(err, docs) {
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


app.get('/upload/:userid/:isbn', function(request, response, next) {

  var userid = request.params.userid;
  var isbn = request.params.isbn;

  MongoClient.connect(mongoUrl, function(err, db) {
    assert.equal(null, err);

    var updateDocument = function(db,callback) {
      // Get the documents collection
      var collection = db.collection('readers');
      // Update document where a is 2, set b equal to 1
      collection.updateOne({ 'userid' : userid }
        , { $push: { 'isbns' : isbn } }, function(err, result) {
        assert.equal(err, null);
        console.log("added isbn");
        callback()
      });  
    }

    updateDocument(db, function(){
      response.send("added isbn")
      next();
    })

    db.close();
  });

});


app.get('/remove/:userid/:isbn', function(request, response, next) {

  var userid = request.params.userid;
  var isbn = request.params.isbn;

  MongoClient.connect(mongoUrl, function(err, db) {
    assert.equal(null, err);

    var updateDocument = function(db,callback) {
      // Get the documents collection
      var collection = db.collection('readers');
      // Update document where a is 2, set b equal to 1
      collection.updateOne({ 'userid' : userid }
        , { $pull: { 'isbns' : isbn } }, function(err, result) {
        assert.equal(err, null);
        console.log("removed isbn");
        callback()
      });  
    }

    updateDocument(db, function(){
      response.send("removed isbn")
      next();
    })

    db.close();
  });

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

