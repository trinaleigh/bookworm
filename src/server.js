import path from 'path';
import { Server } from 'http';
import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes';
import NotFound from './components/NotFound';

var express = require('express');
var app = express();
var fetch = require('node-fetch');

const server = new Server(app);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/static'));

app.get('/books/:isbn', function(request, response) {

	isbn = request.params.isbn;

	url = `http://lx2.loc.gov:210/lcdb?version=1.1&operation=searchRetrieve&query=bath.isbn=${isbn}&maximumRecords=1&recordSchema=mods`;

	fetch(url)
    .then(function(result) {
        return result.text();
    }).then(function(body) {
    	console.log(body);
        response.send(body);
    });

});


app.get('*', (req, res) => {
  match(
    { routes, location: req.url },
    (err, redirectLocation, renderProps) => {

      if (err) {
        return res.status(500).send(err.message);
      }

      let markup;
      if (renderProps) {
        markup = renderToString(<RouterContext {...renderProps}/>);
      } else {
        markup = renderToString(<NotFoundPage/>);
        res.status(404);
      }

      return res.render('index', { markup });
    }
  );
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

