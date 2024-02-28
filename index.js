const express = require('express')
const app = express()


const bodyParser = require('body-parser');
const db = require('./database/mongoDB');
const admin=""
const firebase =""
const cors = require('cors');
const http = require('http');
// const { MongoClient } = require('mongodb');

const server = http.createServer(app);

app.use(express.json({ limit: '50mb' }));
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.raw({ limit: '10mb', type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: true }));




app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})
app.listen(process.env.PORT || 3000)