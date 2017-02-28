import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import Searcher from './Searcher.js';
import Scraper from './Scraper.js';

var refGenres = [
"Fiction",
"Stories",
"Tales",
"Literature",
"Action and adventure fiction",
"Alternative histories (Fiction)",
"Bible fiction",
"Bildungsromans",
"Biographical fiction",
"Choose-your-own stories",
"Confessional fiction",
"Detective and mystery fiction",
"Dialect fiction",
"Diary fiction",
"Didactic fiction",
"Domestic fiction",
"Epic fiction",
"Epistolary fiction",
"Erotic fiction",
"Experimental fiction",
"Fan fiction",
"Fantasy fiction",
"Fictional autobiographies",
"Folk tales",
"Frame stories",
"Gothic fiction",
"Historical fiction",
"Horror fiction",
"Humorous fiction",
"Hypertext fiction",
"Legal fiction (Literature)",
"Magic realist fiction",
"Martial arts fiction",
"Mathematical fiction",
"Medical fiction",
"Mythological fiction",
"Nonsense fiction",
"Novellas",
"Novelle",
"Novels",
"Paranormal fiction",
"Pastoral fiction",
"Philosophical fiction",
"Picaresque fiction",
"Political fiction",
"Psychological fiction",
"Religious fiction",
"Road fiction",
"Robinsonades",
"Romance fiction",
"Romans à clef",
"Samurai fiction",
"Science fiction",
"Sea fiction",
"Serialized fiction",
"Short stories",
"Sports fiction",
"Spy fiction",
"Stories in rhyme",
"Thrillers (Fiction)",
"Urban fiction",
"Utopian fiction",
"War fiction",
"Western fiction",
"Drama",
"Dramas",
"Plays",
"Playscripts",
"Scripts, Stage",
"Stage plays",
"Stage scripts",
"Theatrical works",
"Literature",
"Acting editions",
"Biographical drama",
"Christmas plays",
"Comedy plays",
"Coming-of-age drama",
"Dance drama",
"Detective and mystery plays",
"Dialect drama",
"Didactic drama",
"Domestic drama",
"Drames à clef",
"Episodic plays",
"Erotic drama",
"Experimental drama",
"Fantasy drama",
"Fastnachtsspiele",
"Filmed plays",
"Folk drama",
"Ghost plays",
"Historical drama",
"Horror plays",
"Interludes (Drama)",
"Kabuki plays",
"Kamishibai plays ",
"Kōwaka drama",
"Kuai shu",
"Legal drama (Literature)",
"Librettos",
"Liederspiels",
"Likē drama",
"Living newspapers",
"Loas",
"Masques",
"Medical drama",
"Melodramas (Drama)",
"Metadramas",
"Mock-heroic drama",
"Monodramas (Literature)",
"Monologues (Drama)",
"Mythological plays",
"Nō plays",
"One-act plays",
"Participatory drama",
"Pastoral drama",
"Picaresque drama",
"Political plays",
"Problem plays",
"Puppet plays",
"Radio plays",
"Religious drama",
"Romantic plays",
"Science fiction plays",
"Screenplays",
"Sports plays",
"Tan ci",
"Televised plays",
"Television plays",
"Theatrical adaptations",
"Tragedies (Drama)",
"Tragicomedies",
"Utopian plays",
"Verse drama",
"War drama",
"Western plays",
"Creative nonfiction",
"Creative non-fiction",
"Fourth genre (Creative nonfiction)",
"Literary nonfiction",
"Literary non-fiction",
"Narrative nonfiction",
"Non-fiction literature",
"Non-fiction prose",
"Non-fictional literature",
"Non-fictional prose",
"Nonfiction literature",
"Nonfiction prose",
"Nonfictional literature",
"Nonfictional prose",
"Prose literature (Creative nonfiction)",
"Tales (Creative nonfiction)",
"Biographies",
"Counterfactual histories",
"Diaries",
"Essays",
"Nonfiction novels",
"Personal narratives",
"Travel writing",
"True adventure stories",
"True crime stories"];

var refThemes =
["Animals",
"Art",
"Friendship",
"Music",
"Parenting",
"Technology",
"Time travel"];

export default class RecEngine extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	genre:'',
	    	theme:'',
	    	antiGenre:'',
	    	antiTheme:''
			};

		this.refreshData = this.refreshData.bind(this);
  	}

  	componentWillReceiveProps(nextProps) {
  		this.refreshData(nextProps);
  	}

  	refreshData(props) {

  		// get a random genre and theme from user history
  		var i1 = Math.floor(Math.random()*props.genres.length);
  		var i2 = Math.floor(Math.random()*props.themes.length);

  		// select anti-patterns from list
  		function getAnti(refArray, userArray){
  			var flag = true;
  			while (flag) {
  				var n = Math.floor(Math.random()*refArray.length);
  				var draw = refArray[n];
  				if (! userArray.includes(draw)) {
  					flag = false;
  				}
  			}
  			return draw
  		}

  		this.setState({
  			genre : props.genres[i1], 
  			theme : props.themes[i2],
  			antiGenre: getAnti(refGenres,props.genres), 
  			antiTheme: getAnti(refThemes,props.themes)});

  	}

  	render() {

	    return (
			<div className="rec-container">
				<Scraper authority="staffpicks" title="Independent Bookstore"/>
				<Scraper authority="bestsellers" title="Bestseller List"/>
				<Searcher genre={this.state.genre} topic={this.state.theme} title="Based on Your Library"/>
				<Searcher genre={this.state.antiGenre} topic={this.state.antiTheme} title="Mix It Up"/>
			</div>
	    );
	}
}
