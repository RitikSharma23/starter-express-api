const express = require('express')
const app = express()


const bodyParser = require('body-parser');
const db = require('./database/mongoDB');
const admin=""
const firebase =""
const cors = require('cors');
const http = require('http');
const { MongoClient } = require('mongodb');

const server = http.createServer(app);

app.use(express.json({ limit: '50mb' }));
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.raw({ limit: '10mb', type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(bodyParser.json());
app.use(cors()); // Use the cors middleware

const url = 'mongodb+srv://ljexam:LjExam@ljexam.vysc2ku.mongodb.net';
const dbName = 'location'; // Your database name
const collectionName = 'pincodes'; // Your collection name




app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})
app.listen(process.env.PORT || 3000)