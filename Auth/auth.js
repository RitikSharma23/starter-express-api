const User = require("../Models/user")
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;
const {verifyToken} = require("../middleware/middleware");
const bcrypt = require('bcrypt');
// const company = require('../Routes/User/company');


module.exports = async function (app, db, admin, firebase) {

    async function getCompanyDetails(id) {
        const user = await Company.findById(id).exec();
        return user;
    }

    function giveEror(schemaPaths,error) {
        for (const key of Object.keys(error.errors)) {
            return error.errors[key].message
        }
    }

    app.get('/test-api', async (req, res) => {
        return res.json({ response: "Api is working" })
    });

    app.post('/test-token',verifyToken, async (req, res) => {
        return res.json({ response: req.user, token: 'Verified' })
    });

    
    app.post('/register', async (req, res) => {
        try {
          const { name, email,password } = req.body;
          const user = await User.findOne({
            email,
          });
      
          if(user){
          return res.json({status:false, msg: 'User Already Exists' });
          }

     
          const hashedPassword = await bcrypt.hash(password, 10);
          
          const newUser = new User({
            name,
            password: hashedPassword,
            email,
          });
      
          await newUser.save();
          res.json({ status:true,msg: 'User registered successfully' });
        } catch (error) {
          console.error(error);
          return res.json({ status: false, msg: 'Something Went Wrong' })
        }
    });
         
         
    app.post('/login', async (req, res) => {
      const { email, password } = req.body;
      try {
        const user = await User.findOne({ email });
    
        if (!user) {
          return res.json({ status: false, msg: 'No Email Found. Please Register.' });
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
          return res.json({ status: false, msg: 'Wrong Password' });
        }
    
        const token = jwt.sign({ uid: user._id }, 'ritik_secret', { expiresIn: '15d' });
        return res.json({ status: true, token, user });
    
      } catch (error) {
        console.log(error);
        return res.json({ status: false, msg: 'Something Went Wrong' });
      }
    });
    
  
 
}