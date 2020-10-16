const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qezpx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))

const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("creativeAgency").collection("services");
  const reviewCollection = client.db("creativeAgency").collection("reviews");
  const adminCollection = client.db("creativeAgency").collection("admins");


  app.post('/addService', (req, res) => {
    const service = req.body;
    servicesCollection.insertOne(service)
    .then(result =>{
      res.send(result.insertedCount > 0)
    })
  })

  
  app.get('/userServices', (req, res) => {
    servicesCollection.find({})
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addReview', (req, res) => {
    const review = req.body;
    reviewCollection.insertOne(review)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
});

  app.get('/reviews', (req, res) => {
    reviewCollection.find({})
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })

  app.get('/admins', (req, res) => {
    adminCollection.find({})
    .toArray((err, documents) => {
        res.send(documents)
    })
})

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({email: email})
    .toArray((err, admins) => {
        res.send(admins.length > 0);
    })
  })


});

app.listen(process.env.PORT || port);