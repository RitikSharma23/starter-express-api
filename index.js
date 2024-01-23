const express = require('express')
const app = express()


const bodyParser = require('body-parser');
const db = require('./database/mongoDB');
const admin=""
const firebase =""
const cors = require('cors');
const http = require('http');

const server = http.createServer(app);

app.use(express.json({ limit: '50mb' }));
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.raw({ limit: '10mb', type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: true }));

var AuthApi = require("./Auth/auth");
AuthApi(app, db, admin, firebase);


var User = require("./User/main");
User(app, db, admin, firebase);


app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})
app.listen(process.env.PORT || 3000)