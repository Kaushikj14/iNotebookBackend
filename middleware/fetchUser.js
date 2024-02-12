const jwt = require('jsonwebtoken');

const JWT_SECRET = 'harryisagoodb&oy';


// midddleware takes req,res,and next as argument.
const fetchUser=(req,res,next)=>{
    
    // get the user from the jwt token and add id to the object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"Please authenticate using the valid token"})
    }
   try {
    const data = jwt.verify(token,JWT_SECRET);
    req.user = data.user;    
    next();
   } catch (error) {
    res.status(401).send({error:"Please authenticate using the valid token"})
   }
}



module.exports = fetchUser;