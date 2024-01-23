
const jwt = require('jsonwebtoken');



    function verifyToken(req, res, next) {

        const token = req.headers.token;
        
        console.log(token)
    
        if (!token) {
            return res.status(401).json({ status: false, msg: 'No token provided' });
        }
    
        jwt.verify(token, 'ritik_secret', (err, decoded) => {
            if (err) {
                return res.status(401).json({ status: false, msg: 'Token is invalid' });
            }
            req.user = decoded;
          
            console.log("abc")
            console.log(decoded)
            next();
        });
    }

    function superToken(req, res, next) {
        const token = req.headers.token; 
    
    
        if (!token) {
            return res.status(401).json({ status: false, msg: 'No token provided' });
        }
    
        jwt.verify(token, 'ritik_secret', (err, decoded) => {
            if (err) {
                return res.status(401).json({ status: false, msg: 'Token is invalid' });
            }
            req.user = decoded;
            next();
        });
    }

    function isAuthenticated(req, res, next) {
        const token = req.headers.token; 
         req.token=token
        if (!token) {
            return res.status(401).json({ status: false, msg: 'No token provided' });
        }
    
        jwt.verify(token, 'ritik_secret', (err, decoded) => {
            if (err) {
                return res.status(401).json({ status: false, msg: 'Token is invalid' });
            }
            req.user = decoded;
            console.log(decoded.role)
           
            if(decoded.role=="Admin"|| decoded.role=="User" ||decoded.role=="Superadmin" ||decoded.role=="Subadmin"){
             
            next();

            }
        });
    }

    module.exports ={verifyToken,superToken,isAuthenticated};
  

