import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';

export default class BookSelector extends React.Component {
	constructor(props) {
	    super(props);

	    this.state = {
	      bookshelf: []
	    };

  	}	

  	componentDidMount() {

	  	function parseData(rawData){ 
		    var $xml = $(rawData);

		    var $article = $xml.find('nonSort').slice(0,1);
		    var $title = $xml.find('title').slice(0,1);
		    var $author = $xml.find('namePart').slice(0,1);
		    var $dob = $xml.find('namePart').slice(1,2);

		    var title = $article.text().toUpperCase() + " " + $title.text().toUpperCase();
		    var author = $author.text();
		    var dob = $dob.text();

		    var book = {
		        title, 
		        author,
		        dob };

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
        		.then(result => this.setState({value: '', bookshelf : this.state.bookshelf.concat([result])}));

	  		})
  	}

	render() {

	    return (
	    	<div> 
		    	<h2>Information:</h2>
				{this.state.bookshelf.map( book => {
				  	return <p>{book.title}: {book.author}, {book.dob}</p> 
					}
				)}
			</div>
	    );
  	}
}
