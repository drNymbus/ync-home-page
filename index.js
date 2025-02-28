// Dependencies
const express = require('express');
const path = require('path')
const fs = require('fs');

// Configure & Run the http server
const app = express();
const port = 8080;

// app.use('/', express.static(path.join(__dirname, 'public')));
app.get('/public/*', (req, res) => {
	const publicPath = path.join(__dirname, 'public');
	res.sendFile(path.join(publicPath, req.params[0]));
})

app.set('view engine', 'pug');
app.get('/home', (_, res) => {
	const data = JSON.parse(fs.readFileSync('data/about.json', 'utf8'));
	res.render('home', {contributors: data});
})

app.get('/home/about/*', (req, res) => {
	const publicURL = 'http://localhost:8080/public';
	let data = JSON.parse(fs.readFileSync('data/about.json', 'utf8'));
	let user = req.params[0].split('/')[0];

	data = data[user];
	data.image = `${publicURL}/images/${data.image}`;

	res.render('about', data);
})

app.get('/home/gallery', (_, res) => {
	const data_about = JSON.parse(fs.readFileSync('data/about.json', 'utf8'));
	let data_gallery = JSON.parse(fs.readFileSync('data/gallery.json', 'utf8'));

	for (let i=0; i < data_gallery.length; i++) {
		let p = data_gallery[i]
		for (let j=0; j < p.authors.length; j++) {
			let a = p.authors[j];
			a = { name: data_about[a].fullname, link: `/home/about/${a}` };
			p.authors[j] = a;
		}
		data_gallery[i] = p;
	}

	res.render('gallery', {projects: data_gallery});
})

app.listen(port, () => {
	console.log(`HTTP server running on port ${port}`);
});