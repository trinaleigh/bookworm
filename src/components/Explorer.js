import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import RecEngine from './RecEngine.js';

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

	    return (
			<div>
				<h1>Recommended</h1>
				<RecEngine genres={this.state.genres} themes= {this.state.themes}/>
			</div>
	    );
	}
}

