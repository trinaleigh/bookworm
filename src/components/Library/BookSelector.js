import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import LibraryData from './LibraryData';

export default class BookSelector extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {value: '', bookshelf: [], mode: 'valid'};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.refreshData = this.refreshData.bind(this);
	}

	componentDidMount() {
		this.refreshData(this.props);
	}

	componentWillReceiveProps(nextProps) {
  		this.refreshData(nextProps);
  	}

	refreshData(props){
		function getList(userid){
		    // access user's isbns from mongodb
		    return $.ajax({
		            url: `/user/${userid}/books`,
		            dataType: 'json'        
			})
		}; 

		function loadList(dblist){
			this.setState({bookshelf: dblist});  // load isbns and erase input box value
		}

		getList(props.userid).then(loadList.bind(this));

	}


	handleChange(event) {
		// allow digits only for ISBN input
		this.setState({value: event.target.value.replace(/\D/g,''), mode: 'valid'});
	}

	handleSubmit(event) {

		if([10,13].includes(this.state.value.length)) {  //isbn must be 10 or 13 digits

			function parseData(rawData, id){ 
			    var $xml = $(rawData);

			    var $article = $xml.find('nonSort').slice(0,1);
			    var $title = $xml.find('title').slice(0,1);
			    var $author = $xml.find('namePart').slice(0,1);
			    var $dob = $xml.find('namePart').slice(1,2);
			    var $genres = $xml.find('genre')
			    var $topics = $xml.find('topic')
			    var $extent = $xml.find('extent')

			    var title = ($article.text() != "" ? $article.text().toUpperCase() + " " : "") + $title.text().toUpperCase();
			    var author = $author.text().replace('.','');
			    var dob = $dob.text() == '' || ["1","2"].includes($dob.text()[0]) ? 
			    			$dob.text() : ''; // check for valid DOB;
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
			    		topics.push(this.innerHTML
			    			.replace('FICTION / ','')
			    			.replace('&amp;','and')
			    			.replace('/;','-')); //remove leading text and problematic characters
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

			// add user's bookshelf to db
			function recordBook(userid, book){
			    // access user's history from mongodb
			    return $.ajax({
			    		type: 'POST',
						data: JSON.stringify({ book : book}),
						contentType: 'application/json',
			            url: `/bookshelf/${userid}`
				})
			};

			var newIsbn = this.state.value;
			this.setState({value: ''});

	  		library(newIsbn)
	        		.then(result => parseData(result, newIsbn))
	        		.then(result => recordBook(this.props.userid, result))
	        		.then(result => this.refreshData(this.props));

		} else {
			this.setState({mode: 'invalid'});
		}

		event.preventDefault();
	}

  	render() {

  		// trigger loading screen while waiting for results
  		var flag = "waiting"
  		if (this.state.bookshelf.length > 0) {
  			flag = "loaded"
  		}

	    return (

			<div>

				<div className={flag}>
					<p>loading...</p>
				</div>

			  	<LibraryData bookshelf={this.state.bookshelf} userid={this.props.userid} handler={this.refreshData}/>

			  	<form onSubmit={this.handleSubmit}>
					<label>
					  <h2>Add ISBN: </h2> 
					  <input type="text" name="isbn" placeholder="9780486415918" 
					  	value={this.state.value} onChange={this.handleChange}/>
					</label>
					<input type="submit" value="Submit" />
					<span className={this.state.mode}>ISBN must be 10 or 13 digits long</span>
				</form>

			</div>
	    );
	}
}
