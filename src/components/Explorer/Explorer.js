import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import RecDisplay from './RecDisplay.js';

export default class Explorer extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {bookshelf: []};
		this.refreshData = this.refreshData.bind(this);
  	}	

  	componentDidMount() {
		this.refreshData(this.props);
	}

	componentWillReceiveProps(nextProps) {
	  	this.refreshData(nextProps);
  	}

  	shouldComponentUpdate(nextProps) {
        if (nextProps.userid === this.props.userid || this.state.bookshelf.length <= 0) {
          return true;
        } else {
          return false;
        }
      }

  	refreshData(props) {

		function getList(userid){
		    // access user's isbns from mongodb
		    return $.ajax({
		            url: `/user/${userid}/books`,
		            dataType: 'json'        
			})
		}; 

		function loadList(dblist){
			this.setState({bookshelf: dblist});
		}

		getList(props.userid).then(loadList.bind(this));
	}
	
  	render() {

  		// create full list of genres
		var allGenres = []
		this.state.bookshelf.forEach(book => {
			book.genres.forEach(genre => {
				allGenres.push(genre);
			})
		})

		// create full list of themes
		var allThemes = []
		this.state.bookshelf.forEach(book => {
			book.topics.forEach(topic => {
				allThemes.push(topic);
			})
		})

		// create full list of authors
		var allAuthors = []
		this.state.bookshelf.forEach(book => {
			allAuthors.push(book.author);
		})

  		let component = null;
  		if (allThemes.length > 0) {
  			component = <RecDisplay genres={allGenres} themes={allThemes} authors={allAuthors} userid={this.props.userid}/>;
  		} else {
  			component = <div/>;
  		}

	    return (
			<div>
				<h1>Recommended</h1>
				{component}
			</div>

	    
	    );
	}
}

