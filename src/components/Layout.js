import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';


export default class Layout extends React.Component {
  
	constructor(props) {
	    super(props);
	    this.state = {allProfiles: [], user: 'classics', createMode: false, newList: '', mode: "valid"};
	    this.refreshData = this.refreshData.bind(this);
	    this.handleChange = this.handleChange.bind(this);
	}
  
	handleChange(event) {
		this.setState({user: event.target.value});
	}

	componentDidMount(){
		this.refreshData();
	}

	refreshData(){
		function getLists(){
		    // access user's isbns from mongodb
		    return $.ajax({
		            url: `/lists`,
		            dataType: 'json'        
			})
		}; 

		function loadLists(dblist){
			this.setState({allProfiles: dblist});  // load isbns and erase input box value
		}

		getLists().then(loadLists.bind(this));
	}

	render() {
	    return (
	      <div className="app">
	        <header>
	          <h1>hello, bookworm!</h1>
	          <div id="login">
	            <form>
	              <label>
	                Reading List:
	                <select value={this.state.value} onChange={this.handleChange}>
	                {this.state.allProfiles.map(profile => 
	                	<option value={profile}>{profile}</option>)
	                }
	                </select>
	              </label>
	            <CreateModal handler={this.refreshData} allProfiles={this.state.allProfiles}/>  
	            </form>
	         </div>
	        </header>
	        <Navbar/>
	        <div className="main-content">{React.cloneElement(this.props.children, { userid: this.state.user })}</div>
	        <footer>
	          <p>
	            ...the end
	          </p>
	        </footer>
	      </div>
	    );
	}
}

class CreateModal extends React.Component {

    constructor(props) {
    super(props);
    this.state = {createMode: false, newList: '', mode: "valid"};
    this.toggle = this.toggle.bind(this);
    this.handleEntry = this.handleEntry.bind(this);
    this.addList = this.addList.bind(this);
	}

	toggle() {
  		this.setState({createMode: !this.state.createMode});
  	}

	handleEntry(event) {
		this.setState({newList: event.target.value, mode: "valid"});
	}

	addList(event) {

		function sendList(listName){
		// access Library of Congress online catalog
		    return $.ajax({
		            url: `/addlist/${listName}`,
		    })
		};

			if (! this.props.allProfiles.includes(this.state.newList)){
		    sendList(this.state.newList)
		        .then(this.props.handler);
		    this.setState({createMode: !this.state.createMode, newList: ''});
		            
			} else {
				this.setState({mode: "invalid"});
			}
			event.preventDefault();
	}

	render(){
		let addList = null;
		if (this.state.createMode == true ) {
			addList = <div>
						<div className="waiting"/>
						<form className="list-modal" onSubmit={this.addList}>
							<label>
								<span className="exit" onClick={this.toggle}>X</span>
								<h2>New list name: </h2> 
								<input type="text" name="newList" placeholder="list_name" 
							  		value={this.state.newList} onChange={this.handleEntry}/>
							</label>
							<input type="submit" value="Submit" />
							<p className={this.state.mode}>List name already in use</p>
						</form>
					</div>;
		} else {
			addList = <div/>;
		}

		return (
			<div>
			<p className="mini-text" onClick={this.toggle}>+ Create new list</p>
			{addList}
			</div>
		)
	}

}

class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {page: 'Home'};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        this.setState({page: event.target.innerHTML});
    }

    render() {
    return (
      <div className = "navbar">
          <Link to="/">
            <p onClick={this.handleChange} className={this.state.page == "Home" ? "active" : "inactive"}>Home</p>
          </Link>
          <Link to={`/library`}>
            <p onClick={this.handleChange} className={this.state.page == "Library" ? "active" : "inactive"}>Library</p>
          </Link>
          <Link to={`/explorer`}>
            <p onClick={this.handleChange} className={this.state.page == "Explorer" ? "active" : "inactive"}>Explorer</p>
          </Link>
      </div>
    )
  }
}