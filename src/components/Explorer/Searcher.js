import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import Recommendation from './Recommendation.js';
var data = require('./Categories.js');
var refGenres = data.refGenres;
var refThemes = data.refThemes;

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

  	componentDidMount() {
      this.refreshData(this.props);
    }

  	refreshData(props) {

  		var genre = '';
  		var theme = '';
  		var author = '';
  		// define the genre and theme search terms

  		if (props.mode == 'similar') {
	  		// get a random genre and theme from user history
	  		let i1 = Math.floor(Math.random()*props.genres.length);
	  		let i2 = Math.floor(Math.random()*props.themes.length);
	  		genre = props.genres[i1]; 
	  		theme = props.themes[i2];
  		} else if (props.mode == 'dissimilar') {
  			// select anti-patterns from list
  			function getAnti(refArray, userArray){
	  			var flag = true;
	  			while (flag) {
	  				let i = Math.floor(Math.random()*refArray.length);
	  				var draw = refArray[i];
	  				if (! userArray.includes(draw)) {
	  					flag = false;
	  				}
	  			}
	  			return draw
  			}
  			genre = getAnti(refGenres,props.genres); 
  			theme = getAnti(refThemes,props.themes);
  		} else {
  			let i = Math.floor(Math.random()*props.authors.length);
  			author = props.authors[i];
  		}

  		console.log(`${props.mode} query: ${props.mode == 'author' ? author : genre + " + " + theme}`);

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

		    var handler = this.refreshData;;

		    return new Promise(function(resolve, reject) {      

		       	if (book.title != ' ') {
		            resolve(book);
		        }
		        else {
		        	console.log("no result - retrying")
		        	handler(props);
		            reject(Error("no result"));
		        }
		    })
		};

		parseData = parseData.bind(this);

	  	function subjectRec(genre,topic){
		    // access Library of Congress online catalog
		    return $.ajax({
		            url: `/srecs/${genre}/${topic}`,
		            dataType: 'xml'         
			})
		};

		function authorRec(author){
		    // access Library of Congress online catalog
		    return $.ajax({
		            url: `/arecs/${author}`,
		            dataType: 'xml'         
			})
		};

		if (genre !='' && theme !='') {
			//remove parens for search query
	  		subjectRec(genre.replace(/\(|\)/g,''), theme.replace(/\(|\)/g,''))
	    		.then(result => parseData(result))
	    		.then(result => this.setState({recommendation : result.title, 
											author: result.author, 
											isbn: result.isbn, 
											url: "https://www.loc.gov", 
											source: "Library of Congress"}));
    	} else if (author != '') {
    		// remove author alias and periods for search query
	  		authorRec(author.split(' (')[0].replace(/\./g,''))
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