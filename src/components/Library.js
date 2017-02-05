import React from 'react';
import { Link } from 'react-router';

export default class Library extends React.Component {
  render() {
  	
	return (


      <div>
	      <form>
	        <span>ISBN: </span>
	        <input type="text" id="isbn" placeholder="9780486415918" required/>
	        <input type="submit" id="submit"/>
	      </form>
	      <h2>Titles: </h2>
	      <p>hello world</p>
      </div>
      

    );
  }
}