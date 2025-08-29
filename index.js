// Dependencies
const express = require('express');
const path = require('path')
const fs = require('fs');

const db = require('./data.js');
const client = db.connect();
client.db("home").command({ ping: 1 })
    .then(r => console.log(r))
    .catch(e => console.error(e));

// Configure & Run the http server
const app = express();
const port = 8080;

// const publicURL = 'http://yn-corp.xyz/home/public';

app.get('/home/public/*', (req, res) => {
	const publicPath = path.join(__dirname, 'public');
	console.log(publicPath, req.params[0]);
	res.sendFile(path.join(publicPath, req.params[0]));
});

app.set('view engine', 'pug');
app.get('/home', async (_, res) => {
	const data = await db.getContributors(client);
	console.log('HOME');
	// console.log(data);
	console.log('==============================================');
	res.render('home', {contributors: data});
});

app.get('/home/about/*', async (req, res) => {
	const user = req.params[0].split('/')[0];
	const data = await db.getContributor(client, user);
	console.log('ABOUT');
	// console.log(data);
	console.log('==============================================');
	res.render('about', data);
});

app.get('/home/gallery/', async (_, res) => {
	const data = await db.getGallery(client);
	console.log('GALLERY');
	// console.log(data);
	console.log('==============================================');
	res.render('gallery', {projects: data});
});

app.listen(port, () => {
	console.log(`HTTP server running on port ${port}`);
});
