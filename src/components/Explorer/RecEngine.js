import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import Searcher from './Searcher.js';
import Scraper from './Scraper.js';
var data = require('./Categories.js');

var refGenres = data.refGenres;
var refThemes = data.refThemes;

export default class RecEngine extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	genre:'',
	    	theme:'',
	    	antiGenre:'',
	    	antiTheme:''
			};

		this.refreshData = this.refreshData.bind(this);
    this.noMatch = this.noMatch.bind(this);
  	}

    componentDidMount() {
      this.refreshData(this.props);
    }

  	componentWillReceiveProps(nextProps) {
        this.refreshData(nextProps);
  	}

    noMatch() {
      this.refreshData(this.props);
    }

  	refreshData(props) {

  		// get a random genre and theme from user history
  		var i1 = Math.floor(Math.random()*props.genres.length);
  		var i2 = Math.floor(Math.random()*props.themes.length);

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

  		this.setState({
  			genre : props.genres[i1], 
  			theme : props.themes[i2],
  			antiGenre: getAnti(refGenres,props.genres), 
  			antiTheme: getAnti(refThemes,props.themes)});

  	}

  	render() {

	    return (
			<div className="rec-container">
				<Scraper authority="staffpicks" title="Independent Bookstore"/>
				<Scraper authority="bestsellers" title="Bestseller List"/>
				<Searcher genre={this.state.genre} topic={this.state.theme} title="Based on Your Library" handler={this.noMatch}/>
				<Searcher genre={this.state.antiGenre} topic={this.state.antiTheme} title="For a Change" handler={this.noMatch}/>
			</div>
	    );
	}
}
