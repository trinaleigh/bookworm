import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import Bubbles from './Bubbles.js';
import CounterStack from './CounterStack.js';

export default class LibraryData extends React.Component {
	constructor(props) {
	    super(props);

	    this.removeItem = this.removeItem.bind(this);
  	}	

  	removeItem(event) {

		function pullList(userid, isbn){
		    // access user's isbns from mongodb
		    return $.ajax({
		            url: `/remove/${userid}/${isbn}`,
			})
		}; 

		pullList(this.props.userid, event.target.id)
			.then(result => this.props.handler(this.props));

	}

	render() {

		// create full list of genres for downstream visualization
		var allGenres = []
		this.props.bookshelf.forEach(book => {
			book.genres.forEach(genre => {
				allGenres.push(genre);
			})
		})

		// create full list of themes for downstream visualization
		var allThemes = []
		this.props.bookshelf.forEach(book => {
			book.topics.forEach(topic => {
				allThemes.push(topic);
			})
		})

		// count page total to display
		var allBooks = Array.from(this.props.bookshelf)
		var pageTotal = 0
  		if (allBooks.length > 0) {
  			pageTotal = allBooks.map(a => a.pages)
  							.reduce(function(a,b){
				  				return parseInt(a) + parseInt(b);
  							},"0")
  		}

	    return (
	    	<div>

	    		<div className="data-text">
					{this.props.bookshelf.map(book => {
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
						<CounterStack counts={this.props.bookshelf} total={pageTotal}/>
						<span className="count">{pageTotal} p.</span>
					</div>

				</div>

			</div>

				
	    );
  	}
}
