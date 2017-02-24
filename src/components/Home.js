import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';

export default class Home extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {newsFeed:[]}

		this.refreshData = this.refreshData.bind(this);
	}

	componentDidMount() {
  		this.refreshData();
  	}

  	refreshData() {

	  	function getNews(){
		    // access newsfeed
		    return $.ajax({
		            url: `/newsfeed`,
		            dataType: 'json'         
			})
		};

		getNews()
			.then(result => this.setState({newsFeed: result}));
  	}

  	render() {

	    return (
	    	<div id="news-feed">
	    	<h1>Book News</h1>
	    	{this.state.newsFeed.map(item => {
	    		return <div>
	    			<h3>{item.story}</h3>
	    			<p><strong><a href={item.storyLink} target="_blank">Read more</a></strong></p>
	    			<p>From <strong><a href={item.sourceLink} target="_blank">{item.source}</a></strong></p>
	    			<br/>
	    		</div>
	    		
	    	})}
	    	</div>
	    );
	}
}

