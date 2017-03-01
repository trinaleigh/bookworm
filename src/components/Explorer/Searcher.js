import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import Recommendation from './Recommendation.js';

export default class Searcher extends React.Component {
	constructor(props) {
	    super(props);

	    this.state = {
	      recommendation: "",
	      author: "",
	      isbn: "",
	      url: "",
	      source: ""
	    };

	    this.refreshData = this.refreshData.bind(this);
  	}

  	componentWillReceiveProps(nextProps) {
  		this.refreshData(nextProps);
  	}

  	refreshData(props) {

	  	var parseData = function(rawData){ 
		    var $xml = $(rawData);

		    var $article = $xml.find('nonSort').slice(0,1);
		    var $title = $xml.find('title').slice(0,1);
		    var $author = $xml.find('namePart').slice(0,1);
		    var $isbn = $xml.find('identifier').slice(0,1);

		    var title = $article.text() + " " + $title.text();
		    var author = $author.text().replace('.','');
		    var isbn = $isbn.text().replace(/\D/g,'');

		    var book = {
		    	isbn,
		        title, 
		        author};

		    var handler = this.props.handler;

		    return new Promise(function(resolve, reject) {      

		       	if (book.title != ' ') {
		            resolve(book);
		        }
		        else {
		        	handler();
		            reject(Error("no result"));
		        }
		    })
		};

		parseData = parseData.bind(this);

	  	function rec(genre,topic){
		    // access Library of Congress online catalog
		    return $.ajax({
		            url: `/recs/${genre}/${topic}'`,
		            dataType: 'xml'         
			})
		};

		if (props.genre !='' && props.topic !='') {
			console.log(`query: ${props.genre} + ${props.topic}`);
			//remove parens for search query
	  		rec(props.genre.replace("(","").replace(")",""), props.topic.replace("(","").replace(")",""))
	    		.then(result => parseData(result))
	    		.then(result => this.setState({recommendation : result.title, 
											author: result.author, 
											isbn: result.isbn, 
											url: "https://www.loc.gov", 
											source: "Library of Congress"}));
    	}
	  	
  	}

	render() {

	    return (
			<Recommendation book={this.state} title={this.props.title}/>				
	    );
  	}
}