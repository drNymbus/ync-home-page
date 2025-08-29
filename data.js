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
}; exports.connect = connect;

async function getContributors(client) {
	const collection = client.db('home').collection('contributors');
	const contributors = await collection.find().toArray();
	let data = {};
	for (let contributor of contributors) {
		console.log(contributor.fullname);
		contributor.image = `data:image/jpeg;base64,${contributor.image}`;
		data[contributor.id] = contributor;
	}

	return data;
}; exports.getContributors = getContributors;

async function getContributor(client, user) {
	const collection = client.db('home').collection('contributors');
	let data = await collection.find({ id: user }).toArray();
	data = data[0];
	data.image = `data:image/jpeg;base64,${data.image}`;
	return data;
}; exports.getContributor = getContributor;

async function getGallery(client) {
	let collection = client.db('home').collection('contributors');
	const contributors = await collection.find().toArray();
	let authors = {};
	for (let contributor of contributors) {
		authors[contributor.id] = {
			name: contributor.fullname,
			link: `/home/about/${contributor.id}`
		};
	}

	collection = client.db('home').collection('gallery');
	let gallery = await collection.find().toArray();
	for (let project of gallery) {
		project.authors = project.authors.map(el => authors[el]);
	}
	console.log(gallery);

	return gallery;
}; exports.getGallery = getGallery;
