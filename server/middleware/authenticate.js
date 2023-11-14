const jwt = require('jsonwebtoken');
const User = require("../Schema/userSchema");
const Note = require("../Schema/NoteShcema");
const Authenticate  = async(req,res,next)=>
{
    try 
    {
        const token = req.cookies.jwtoken;
        
        const vartoken = jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await User.findOne({_id:vartoken._id , "tokens.token":token});

        if(!rootUser) 
        {
           throw new Error ("User Not Found");
        }
        const { day, month, year } = req.params;
        const notes = await Note.find({userId:rootUser._id , date : `${day}/${month}/${year}` });

        req.status = 200;
        req.token = token;
        req.userNotes = notes;
        req.userId = vartoken._id;
        
        next();
    }
    catch(err)
    {
        res.status(401).send("Unauthorized : Token Not Provided");
        console.log(err);
        next();
    }
}

module.exports = Authenticate