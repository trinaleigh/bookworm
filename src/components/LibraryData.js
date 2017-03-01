import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import Bubbles from './Bubbles.js';
import CounterStack from './CounterStack.js';

export default class LibraryData extends React.Component {
	constructor(props) {
	    super(props);

	    this.state = {
	      bookshelf: []
	    };

	    this.removeItem = this.removeItem.bind(this);
	    this.refreshData = this.refreshData.bind(this);
  	}	

  	componentDidMount() {
  		this.refreshData(this.props);
  	}

  	componentWillReceiveProps(nextProps) {
  		this.setState({bookshelf: []});
  		this.refreshData(nextProps);
  	}

  	removeItem(event) {

		function pullList(userid, isbn){
		    // access user's isbns from mongodb
		    return $.ajax({
		            url: `/remove/${userid}/${isbn}`,
			})
		}; 

		pullList(this.props.userid, event.target.id)
			.then(this.props.handler(this.props));

	}

  	refreshData(props) {

	  	function parseData(rawData, id){ 
		    var $xml = $(rawData);

		    var $article = $xml.find('nonSort').slice(0,1);
		    var $title = $xml.find('title').slice(0,1);
		    var $author = $xml.find('namePart').slice(0,1);
		    var $dob = $xml.find('namePart').slice(1,2);
		    var $genres = $xml.find('genre')
		    var $topics = $xml.find('topic')
		    var $extent = $xml.find('extent')

		    var title = $article.text().toUpperCase() + " " + $title.text().toUpperCase();
		    var author = $author.text().replace('.','');
		    var dob = $dob.text() == '' || ["1","2"].includes($dob.text()[0]) ? 
		    			$dob.text() : ''; // check for valid DOB;
		    var genres = [];
		    var topics = [];
		    var extent = $extent.text();
		    var pageStart = extent.search(/\d/);
		    var pageEnd = extent.search("p") - 1;
		    var pages = extent.slice(pageStart,pageEnd) != "" ? extent.slice(pageStart,pageEnd) : "0"; // catch empty value
		    var isbn = id;

		    $genres.each(function() {
		    	if (! ["text","novel","bibliography"].includes(this.innerHTML) && ! genres.includes(this.innerHTML)) {  // ignore generic tags and de-dupe
		    		genres.push(this.innerHTML.replace('.',''));  // remove trailing period
		    	}
		    })

		    $topics.each(function() {
		    	if (this.innerHTML != "text" && ! topics.includes(this.innerHTML)) {
		    		topics.push(this.innerHTML
		    			.replace('FICTION / ','')
		    			.replace('&amp;','and')
		    			.replace('/;','-')); //remove leading text and problematic characters
		    	}
		    })

		    var book = {
		    	isbn,
		        title, 
		        author,
		        dob,
		        genres,
		        topics,
		        pages };

		    return new Promise(function(resolve, reject) {      

		        if (book) {
		            resolve(book);
		        }
		        else {
		            reject(Error("parsing failed"));
		        }
		    })
		};

	  	function library(isbn){
		    // access Library of Congress online catalog
		    return $.ajax({
		            url: `/books/${isbn}`,
		            dataType: 'xml'         
			})
		};

  		props.isbns.map (isbn => {
  				library(isbn)
        		.then(result => parseData(result, isbn))
        		.then(result => this.setState({bookshelf : this.state.bookshelf.concat([result])}));
	  	})
  	}

	render() {

		// create full list of genres for downstream visualization
		var allGenres = []
		this.state.bookshelf.forEach(book => {
			book.genres.forEach(genre => {
				allGenres.push(genre);
			})
		})

		// create full list of themes for downstream visualization
		var allThemes = []
		this.state.bookshelf.forEach(book => {
			book.topics.forEach(topic => {
				allThemes.push(topic);
			})
		})

		// add user's topics and genres to db
		function recordPrefs(userid, genres, themes){
		    // access user's history from mongodb

		    return $.ajax({
		    		type: 'POST',
					data: JSON.stringify({ genres : genres, themes: themes}),
					contentType: 'application/json',
		            url: `/record/${userid}`
			})
		};

		// count page total to display
		var allBooks = Array.from(this.state.bookshelf)
		var pageTotal = 0
  		if (allBooks.length > 0) {
  			pageTotal = allBooks.map(a => a.pages)
  							.reduce(function(a,b){
				  				return parseInt(a) + parseInt(b);
  							},"0")
  		}

  		// trigger loading screen while waiting for results
  		var flag = "waiting"
  		if (this.props.isbns.length === this.state.bookshelf.length) {
  			flag = "loaded"
  			if (this.state.bookshelf.length > 0){
  				recordPrefs(this.props.userid, allGenres, allThemes);
  			}
  		}

	    return (
	    	<div>

	    		<div className={flag}>
	    		<p>loading...</p>
	    		</div>

	    		<div className="data-text">
					{this.state.bookshelf.map(book => {
					  	return <div className = "text-container">
					  	<p><strong>{book.title}</strong><br/> 
					  	{book.author} {book.dob != "" ? `(${book.dob})` : ""}</p>
					  	<p><span>{book.isbn}</span> <button id={book.isbn} onClick={this.removeItem}>X</button></p>
					  	</div>
					})}
				</div>


				<div className="data-viz">
					<h2>Genres</h2>
					<div className="viz-container">
						<Bubbles keywords={allGenres}/>
					</div>

					<h2>Themes</h2>
					<div className="viz-container">
						<Bubbles keywords={allThemes}/>
					</div>

					<h2>Pages</h2>
					<div className="viz-container" id="book-stack">
						<CounterStack counts={this.state.bookshelf} total={pageTotal}/>
						<span className="count">{pageTotal} p.</span>
					</div>

				</div>

			</div>

				
	    );
  	}
}
