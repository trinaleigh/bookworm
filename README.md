# bookworm

## summary

app displays reading list data and provides book recommendations.

pages:
* home - displays book-related news from multiple media outlets via RSS feeds
* library - enables book input by ISBN. accesses Library of Congress API to provide reading list details and D3 data visualizations
* explorer - provides book recommendations from a number of sources:
	- scrapes independent bookstore websites, using "employee picks" sections to provide book recommendations
	- scrapes bestseller list
	- searches Library of Congress catalog to provide two recommendations: 1) similar to user history, 2) dissimilar to user history

## dependencies

user-level data stored in MongoDB database

## instructions

* initialize MongoDB database. create .env file in the project root directory and save MongoDB connection URI as *MONGODB_URI*
* npm install and npm start