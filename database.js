const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://website:webwebweb@tutorcenter.rdnpr1a.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("please");
  // perform actions on the collection object
  client.close();
});
