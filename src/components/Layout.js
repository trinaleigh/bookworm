import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';


export default class Layout extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {allProfiles: [], user: 'classics'};
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event) {
    this.setState({user: event.target.value});
  }

  componentDidMount(){
    function getLists(){
        // access user's isbns from mongodb
        return $.ajax({
                url: `/lists`,
                dataType: 'json'        
      })
    }; 

    function loadLists(dblist){
    	console.log(dblist);
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