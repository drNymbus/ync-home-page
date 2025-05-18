const { MongoClient } = require('mongodb');

function connect() {
	const driver = process.env.MONGO_DRIVER || 'mongodb';
	const username = process.env.MONGO_USERNAME || 'home_app';
	const password = process.env.MONGO_PASSWORD || 'home_app';
	const contact  = process.env.MONGO_CONTACT_POINT || 'localhost:27017';

	const uri = `${driver}://${username}:${password}@${contact}/home`;
	console.log(uri);

	const client = new MongoClient(uri);
	return client;
}

function getContributors(client) {
	const contributors = client.db('home').collection('contributors');

	let data = {};
	contributors.forEach((contributor) => {
		contributor.image = `data:image/jpeg;base64,${contributor.image}`;
		data[contributor.id] = contributor;
	});

	return data;
}

function getContributor(client, user) {
	let data = client.db('home').collection('contributors').find({ id: user });
	data.image = `data:image/jpeg;base64,${data.image}`;
	return data;
}

function getGallery(client) {
	const contributors = client.db('home').collection('contributors');
	let authors = {};
	contributors.forEach((contributor) => {
		authors[contributor.id] = {
			name: contributor.fullname,
			link: `/home/about/${contributor.id}`
		};
	});

	let gallery = client.db('home').collection('gallery');
	for project in gallery {
		for a in project.authors {
			a = authors[a];
		}
	}

	return gallery;
}
