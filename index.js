// Dependencies
const express = require('express');
const path = require('path')
const fs = require('fs');

const db = require('./data.js');
const client = db.Connect();

// Configure & Run the http server
const app = express();
const port = 8080;

const publicURL = 'http://yn-corp.xyz/home/public';

app.get('/home/public/*', (req, res) => {
	const publicPath = path.join(__dirname, 'public');
	console.log(publicPath, req.params[0]);
	res.sendFile(path.join(publicPath, req.params[0]));
});

app.set('view engine', 'pug');
app.get('/home', (_, res) => {
	const data = db.getContributors(client);
	res.render('home', {contributors: data});
});

app.get('/home/about/*', (req, res) => {
	const user = req.params[0].split('/')[0];
	const data = db.getContributor(client, user);

	res.render('about', data);
});

app.get('/home/gallery/', (_, res) => {
	const data = db.getGallery(client);
	res.render('gallery', {projects: data_gallery});
});

app.listen(port, () => {
	console.log(`HTTP server running on port ${port}`);
});
