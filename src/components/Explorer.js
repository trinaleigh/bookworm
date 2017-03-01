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

  	shouldComponentUpdate(nextProps) {
        if (nextProps.userid === this.props.userid) {
          return false;
        } else {
          return true;
        }
      }

	refreshData(props){

		function getList(userid, listType){
		    // access user's isbns from mongodb
		    return $.ajax({
		            url: `/user/${userid}/${listType}`,
		            dataType: 'json'       
			})
		}; 

		function loadLists(var1, list1, var2, list2){
			this.setState({[var1]: list1, [var2]: list2});
		}

		loadLists = loadLists.bind(this);

		Promise.all([getList(props.userid, "genres"), getList(props.userid, "themes")])
			.then(function(value) { loadLists("genres",value[0],"themes",value[1])})

	}
	
  	render() {

	    return (
			<div>
				<h1>Recommended</h1>
				<RecEngine genres={this.state.genres} themes= {this.state.themes} userid={this.props.userid}/>
			</div>
	    );
	}
}

