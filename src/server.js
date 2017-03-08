var express = require('express');
var app = express();
var fetch = require('node-fetch');
var cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient, assert = require('assert');

var mongoUrl = process.env.MONGODB_URI;

var bodyParser = require('body-parser')
app.use( bodyParser.json() ); 

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/static'));

app.get('/', function(request, response) {
  response.render('static/index');
});

// strip HTML from memory when web scraping
function reduceString(s) { return (' ' + s).substr(1); }

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

			// pick a random book from the list
			var allBooks = $('.abaproduct-details');
			var i = Math.floor(Math.random()*allBooks.length);
			var choice = allBooks[i];

			// get book details
			var data = $(choice);
			var title = reduceString(data.children('.abaproduct-title').text());
			var author = reduceString(data.children('.abaproduct-authors').text().replace('By ',''));
			var isbn = reduceString(data.children('.abaproduct-isbn').text().replace('ISBN: ',''));

			var source = reduceString($('title').text())

			var recommendation = { 
			  title, 
			  author, 
			  isbn, 
			  url, 
			  source};

			// clear variables
			$=null;
			allBooks=null;
			choice=null;
			data=null;
			title=null;
			author=null;
			isbn=null;
			source=null

			// send to client
			console.log('getting staff pick')
			response.send(recommendation);

		})

});


app.get('/bestsellers', function(request, response) {

	var url = 'http://www.barnesandnoble.com/b/the-new-york-times-bestsellers/_/N-1p3n';
	var source = 'New York Times Best Sellers'

	fetch(url)
		.then(function(result){
			return result.text();
		}).then(function(body) {
		    var $ = cheerio.load(body);

		    // get the bestseller selection
		    var book = $('.primary-content')
				.children('#hotBooksWithDesc')
				.first()
				.children('#book-carousel')
				.children('li').first();
		    
		    // get book details
		    var title = reduceString(book.children('p').text());
		    var author = reduceString(book.children('a').last().text());
		    var isbn = reduceString(book.children('a').first().attr('href')).split("ean=")[1];

		    var recommendation = { 
		        title, 
		        author, 
		        isbn, 
		        url, 
		        source};

		    // send to client
		    console.log('getting bestseller')
		    response.send(recommendation);

		})

});

app.get('/awards', function(request, response) {

	var url = 'http://www.keplers.com/national_book_award';

	fetch(url)
		.then(function(result){
			return result.text();
		}).then(function(body) {

			var $ = cheerio.load(body);

			// pick a random book from the list
			var allBooks = $('.abaproduct-details');
			var i = Math.floor(Math.random()*allBooks.length);
			var choice = allBooks[i];

			// get book details
			var data = $(choice);
			var title = reduceString(data.children('.abaproduct-title').text());
			var author = reduceString(data.children('.abaproduct-authors').text().replace('By ',''));
			var isbn = reduceString(data.children('.abaproduct-isbn').text().replace('ISBN: ',''));

			var source = reduceString($('title').text())

			var recommendation = { 
			  title, 
			  author, 
			  isbn, 
			  url, 
			  source};

			// clear variables
			$=null;
			allBooks=null;
			choice=null;
			data=null;
			title=null;
			author=null;
			isbn=null;
			source=null

			// send to client
			console.log('getting award winner')
			response.send(recommendation);

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

	Promise.all(urls.map(getFeed))
		.then(function(value) {
			console.log('getting news feed'); 
			response.send(value)
		})

});

app.get('/books/:isbn', function(request, response) {

	isbn = request.params.isbn;

	url = `http://lx2.loc.gov:210/lcdb?version=1.1&operation=searchRetrieve&query=bath.isbn=${isbn}&maximumRecords=1&recordSchema=mods`;

	console.log('looking up book');

	fetch(url)
	.then(function(result) {
		return result.text();
	}).then(function(body) {
	    response.send(body);
	});

});

app.get('/srecs/:genre/:topic', function(request,response){

	var genre = request.params.genre;
	var topic = request.params.topic;
	console.log(genre, topic);

	var url = `http://lx2.loc.gov:210/lcdb?version=1.1&operation=searchRetrieve&query=bath.subject=${genre}%20AND%20bath.subject=${topic}%20AND%20bath.any=text%20AND%20bath.any=eng&startRecord=1&maximumRecords=1&recordSchema=mods`;

	console.log('searching LOC by subject')

	fetch(url)
	.then(function(result) {
	    return result.text();
	}).then(function(body) {
	    response.send(body);
	});

});

app.get('/arecs/:author', function(request,response){

	var author = request.params.author;
	console.log(author);

	var url = `http://lx2.loc.gov:210/lcdb?version=1.1&operation=searchRetrieve&query=bath.author=${author}%20AND%20bath.any=text%20AND%20bath.any=eng&startRecord=1&maximumRecords=1&recordSchema=mods`;

	console.log('searching LOC by author')

	fetch(url)
	.then(function(result) {
	    return result.text();
	}).then(function(body) {
	    response.send(body);
	});

});

app.get('/lists', function(request, response) {

  MongoClient.connect(mongoUrl, function(err, db) {
    assert.equal(null, err);
    var findDocuments = function(db,callback) {
      // Get the documents collection
      var collection = db.collection('readers');
      // Find some documents
      collection.distinct('userid', function(err, docs) {
        assert.equal(err, null);
        callback(docs);
      });   
    }

    findDocuments(db, function(list){
    	console.log('getting reading lists')
      	response.send(list)});

    db.close();
  });

});

app.get('/addlist/:listname', function(request, response, next) {

	var listname = request.params.listname;

	MongoClient.connect(mongoUrl, function(err, db) {
		assert.equal(null, err);

		var updateDocument = function(db,callback) {
			// Get the documents collection
			var collection = db.collection('readers');
			// Update document
			collection.insertOne({ 'userid' : listname, 'books' : [] }
			, function(err, result) {
				assert.equal(err, null);
				console.log("added new list");
				callback()
			});  
		}

		updateDocument(db, function(){
			response.send("added new list");
			next();
		})

		db.close();
	});

});


app.get('/user/:userid/:listype', function(request, response) {

	var userid = request.params.userid;
	var listype = request.params.listype;

	MongoClient.connect(mongoUrl, function(err, db) {
		assert.equal(null, err);
		var findDocuments = function(db,callback) {
			// Get the documents collection
			var collection = db.collection('readers');
			// Find some documents
			collection.find({'userid': userid}).toArray(function(err, docs) {
				assert.equal(err, null);
				var userList = docs[0][listype];
				callback(userList);
		  	});   
		}

		findDocuments(db, function(userList){
			console.log('getting list data')
			response.send(userList)});
			db.close();
	});

});

app.post('/bookshelf/:userid', function(request, response, next) {

	var userid = request.params.userid;
	var book = request.body.book;

	MongoClient.connect(mongoUrl, function(err, db) {
		assert.equal(null, err);

		var updateDocument = function(db,callback) {
			// Get the documents collection
			var collection = db.collection('readers');
			// Update document
			collection.updateOne({ 'userid' : userid }
			, { $push: { 'books' : book } }, function(err, result) {
				assert.equal(err, null);
				console.log("added book to shelf");
				callback()
			});  
		}

		updateDocument(db, function(){
			response.send("added book to shelf");
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
			// Update document
			collection.updateOne({ 'userid' : userid }
			, { $pull: { 'books' : {'isbn' : isbn} } }, function(err, result) {
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

