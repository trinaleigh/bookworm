import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import Bubbles from './Bubbles.js';

export default class BookSelector extends React.Component {
	constructor(props) {
	    super(props);

	    this.state = {
	      bookshelf: []
	    };

	    this.refreshData = this.refreshData.bind(this);
	    this.handleUpdate = this.handleUpdate.bind(this);
  	}	

  	componentDidMount() {
  		this.refreshData();
  	}

  	handleUpdate() {
  		this.setState({bookshelf: []});
  		this.refreshData();
  	}

  	refreshData() {

	  	function parseData(rawData){ 
		    var $xml = $(rawData);

		    var $article = $xml.find('nonSort').slice(0,1);
		    var $title = $xml.find('title').slice(0,1);
		    var $author = $xml.find('namePart').slice(0,1);
		    var $dob = $xml.find('namePart').slice(1,2);
		    var $genres = $xml.find('genre')
		    var $topics = $xml.find('topic')

		    var title = $article.text().toUpperCase() + " " + $title.text().toUpperCase();
		    var author = $author.text();
		    var dob = $dob.text();
		    var genres = []
		    var topics = []

		    $genres.each(function() {
		    	if (this.innerHTML != "text" && ! genres.includes(this.innerHTML)) {  // ignore generic "text" tag and de-dupe
		    		genres.push(this.innerHTML);
		    	}
		    })

		    $topics.each(function() {
		    	if (this.innerHTML != "text" && ! topics.includes(this.innerHTML)) {
		    		topics.push(this.innerHTML);
		    	}
		    })

		    var book = {
		        title, 
		        author,
		        dob,
		        genres,
		        topics };

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

  		this.props.isbns.map (isbn => {
  				library(isbn)
        		.then(parseData)
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

	    return (
	    	<div> 
		    	<h2>Titles</h2>

				{this.state.bookshelf.map(book => {
				  	return <p>{book.title}: {book.author} ({book.dob})</p> 
				}
				)}

				<h2>Genres</h2>

				{this.state.bookshelf.map(book => {

				  	return <p>{book.genres.join(', ')}</p> 
				  	
				}
				)}

				<Bubbles keywords={allGenres}/>

				<h2>Themes</h2>

				{this.state.bookshelf.map(book => {

				  	return <p>{book.topics.join(', ')}</p> 
				  	
				}
				)}

				<Bubbles keywords={allThemes}/>

				<button onClick={this.handleUpdate}>
		    		Refresh
				</button>
				
			</div>
	    );
  	}
}
