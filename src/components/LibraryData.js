import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import Bubbles from './Bubbles.js';
import Counter from './Counter.js';
import CounterStack from './CounterStack.js';

export default class BookSelector extends React.Component {
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
		    var author = $author.text();
		    var dob = $dob.text();
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
		    		topics.push(this.innerHTML);
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

		var allGenres = []
		this.state.bookshelf.forEach(book => {
			book.genres.forEach(genre => {
				allGenres.push(genre);
			})
		})

		var allThemes = []
		this.state.bookshelf.forEach(book => {
			book.topics.forEach(topic => {
				allThemes.push(topic);
			})
		})

		var pageTotal = 0
  		var allBooks = Array.from(this.state.bookshelf)

  		if (allBooks.length > 0) {
  			pageTotal = allBooks.map(a => a.pages)
  							.reduce(function(a,b){
				  				return parseInt(a) + parseInt(b);
  							},"0")
  		}

	    return (
	    	<div>

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
					<div className="viz-container">
						<h2>Genres</h2>
						<Bubbles keywords={allGenres}/>
					</div>

					<div className="viz-container">
						<h2>Themes</h2>
						<Bubbles keywords={allThemes}/>
					</div>

					<div className="viz-container">
						<h2>Pages</h2>
						<Counter counts={this.state.bookshelf}/>
					</div>

					<div className="viz-container">
						<CounterStack counts={this.state.bookshelf} total={pageTotal}/>
						<span className="count">{pageTotal} p.</span>
					</div>

				</div>

			</div>

				
	    );
  	}
}
