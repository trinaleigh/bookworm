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

  		// define the genre and theme search terms

  		if (props.mode == 'similar') {
	  		// get a random genre and theme from user history
	  		var i1 = Math.floor(Math.random()*props.genres.length);
	  		var i2 = Math.floor(Math.random()*props.themes.length);
	  		var genre = props.genres[i1]; 
	  		var theme = props.themes[i2];
  		} else {
  			// select anti-patterns from list
  			function getAnti(refArray, userArray){
	  			var flag = true;
	  			while (flag) {
	  				var n = Math.floor(Math.random()*refArray.length);
	  				var draw = refArray[n];
	  				if (! userArray.includes(draw)) {
	  					flag = false;
	  				}
	  			}
	  			return draw
  			}

  			var genre = getAnti(refGenres,props.genres); 
  			var theme = getAnti(refThemes,props.themes);
  		}

  		console.log(`${props.mode} query: ${genre} + ${theme}`);

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

	  	function rec(genre,topic){
		    // access Library of Congress online catalog
		    return $.ajax({
		            url: `/recs/${genre}/${topic}`,
		            dataType: 'xml'         
			})
		};

		if (genre !='' && theme !='') {
			//remove parens for search query
	  		rec(genre.replace("(","").replace(")",""), theme.replace("(","").replace(")",""))
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