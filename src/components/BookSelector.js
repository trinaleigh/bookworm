import React from 'react';
import { Link } from 'react-router';
import LibraryData from './LibraryData';
import ISBNs from './ISBNs';
import $ from 'jquery';

export default class BookSelector extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {value: '', isbns: [], mode: 'valid'};
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
		            url: `/user/${userid}`,
		            dataType: 'json'        
			})
		}; 

		function loadList(dblist){
			this.setState({isbns: dblist});
		}

		getList(props.userid).then(loadList.bind(this));
	}


	handleChange(event) {
		// allow digits only for ISBN input
		this.setState({value: event.target.value.replace(/\D/g,''), mode: 'valid'});
	}

	handleSubmit(event) {

		if([10,13].includes(this.state.value.length)) {

			function putList(userid, isbn){
			    // access user's isbns from mongodb
			    return $.ajax({
			            url: `/upload/${userid}/${isbn}`,
				})
			}; 

			putList(this.props.userid, this.state.value)
			
			// upon submission, add book to the list
			this.setState({value: '', isbns : this.state.isbns.concat([this.state.value])})

		} else {
			this.setState({mode: 'invalid'})
		}

		event.preventDefault();
	}

  	render() {

	    return (
			<div>

			  <ISBNs isbns={this.state.isbns} userid={this.props.userid} handler={this.refreshData}/>

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
