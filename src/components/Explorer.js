import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import Scraper from './Scraper.js';
import Searcher from './Searcher.js';

export default class Explorer extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {genres: [], themes: []};
		this.refreshData = this.refreshData.bind(this);
  	}	

  	componentDidMount() {
		this.refreshData(this.props);
	}

	componentWillReceiveProps(nextProps) {
  		this.refreshData(nextProps);
  	}

	refreshData(props){
		function getList(userid, listType){
		    // access user's isbns from mongodb
		    return $.ajax({
		            url: `/user/${userid}/${listType}`,
		            dataType: 'json'        
			})
		}; 

		function loadList(dblist, listType){
			this.setState({[listType]: dblist});
		}

		loadList = loadList.bind(this);

		getList(props.userid, "genres").then(result => loadList(result, "genres"));
		getList(props.userid, "themes").then(result => loadList(result, "themes"));

	}
	
  	render() {

  		// get a random genre and theme from user history
  		var i1 = Math.floor(Math.random()*this.state.genres.length);
  		var genre = this.state.genres[i1];
  		var i2 = Math.floor(Math.random()*this.state.themes.length);
  		var theme = this.state.themes[i2];		

	    return (
			<div>
				<h1>Recommended</h1>
				<div className="rec-container">
					<Scraper authority="staffpicks" title="Independent Bookstore"/>
					<Scraper authority="bestsellers" title="Bestseller List"/>
					<Searcher genre={genre} topic={theme} title="Based on Your Library"/>
					<Searcher genre="Nonfiction" topic="Mystery" title="Mix It Up"/>
				</div>
			</div>
	    );
	}
}

