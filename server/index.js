const express = require("express");
const cors = require('cors');
const route = express();
//require("db/conn");
route.use(cors());
// route.use(cors({ origin: 'https://todo-app-red-six.vercel.app/' }));
//route.use(cors({ origin: '*' }));

route.use(cors(
  {
    origin: ["*"],
    methods: ["POST", "GET"],
    credentials : true
  }
));

const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
route.use(express.json());
require("./Conn");
route.use(cookieParser());
const Authenticate = require('./middleware/authenticate');
const Note = require("./Schema/NoteShcema");
const User = require("./Schema/userSchema");
const dotenv = require('dotenv');
dotenv.config({path : './config.env'});

const port = process.env.PORT || 8000;

route.get('/', (req, res) => {
  res.send('Hello from server side');
});


//creating a new note and addding current date and time 

route.post("/addnote", (req, res) => {

  const textnote = req.body.note;
  const date = req.body.urldate;
  const userId = req.body.userId;
  const temptime = new Date();
  const currtime  = temptime.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const time = currtime;
  const note = new Note({textnote, date ,time , userId});
  note
    .save()
    .then(() => {
      console.log("Data Saved");
      res.status(201).send("Successfull");
    })
    .catch((e) => {
      console.log(e);
      res.status(400).send("Faild To Add");
    });
});


//get all data 
route.get('/getdata/:day/:month/:year/:userId', async (req, res) => {
  
  const { day, month, year } = req.params;
  const currdate = `${day}/${month}/${year}`;
  const userId = req.params.userId;
  try {
  
    const result = await Note.find({'date':currdate , userId}).sort({'checked':1});

    if(result.length > 0)
    { 
      res.status(200).json(result);
    }
    else
    {
      res.status(400).send("No Record Found");
    }
   
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'An error occurred while fetching data' }); // Custom error response
  }
});

//handle check changes 
route.get('/check/:id/:userId', async (req, res) => {
  const id = req.params.id;
  const userId = req.params.userId;
  try {
    const note = await Note.findOne({_id:id,userId});

    if (!note) {
      return res.status(404).send("Note not found");
    }

    note.checked = !note.checked; 
    await note.save();

    res.status(200).send("Successfully updated");
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'An error occurred while updating data' });
  }
});

//handle delete request 
route.post('/delete', async(req,res)=>
{
  const id = req.body.id;
  const userId = req.body.userId;
  try{
    const note = await Note.deleteOne({'_id':id , userId});
    if(note.deletedCount === 1)
    {
      return res.status(200).send("Successfully Deleted");
    }
    else 
    {
      return res.status(400).send("Unable to delete");
    }
  }
  catch(e)
  {
    console.log(e);
  }
});



//register a new user 

route.post('/register' , async(req,res)=>
{
  try 
  {
    const {name , email , password } = req.body;
    if(!name || !email || !password)
    {
      return res.status(401).json({error:"All Fields Required"});
    }

    const userExists = await User.findOne({email});

    if(userExists)
    {
      return res.status(402).json({error : "Username Already Takken"})
    }

    const NewUser = new User({name, email, password});

    const isSaved = await NewUser.save();

    if(isSaved) 
    {
      return res.status(200).json({message:" Successfully Registred "});
    }
    else 
    {
      return res.status(201).json({error : "Faild To Register "});
    }

  }
  catch(e)
  {
    console.log(e);
  }

});


//login request 

route.post('/signin' , async(req,res)=>
{
  const {email, password} = req.body;

  if(!email || !password)
  {
    return res.status(400).json({error: "Id Or Password Not Found"});
  }

  const userDetail = await User.findOne({email});

  if(!userDetail) 
  {
    return res.status(401).json({error:"Invalid Cridentials "});
  }

    const isMatched = await bcrypt.compare(password,userDetail.password,);

    if(isMatched)
    {
      let token = await userDetail.generateAuthToken();
      //console.log(token);
      res.cookie("jwtoken",token , {
        expires : new Date (Date.now()+ 680400000),
        httpOnly :true
      })
      return res.status(200).json({message:"Login Successfull"});
    }
    else 
    {
      return res.status(402).json({error:"Invalid Credintials"});
    }
});

//adding middleware while visiting note page 

route.get('/userauth/:day/:month/:year',Authenticate,(req,res)=>
{
  if(req.status === 200 )
  {
    if(Array.isArray(req.userNotes) && req.userNotes.length > 0)
    {
      //  console.log("Sending NOtes :"+req.userNotes);
      return res.status(201).json(req.userNotes);
    }
    else 
    {
      // console.log("Sending userId :"+req.userId);
      return res.status(202).json(req.userId);
    }
  }
  else 
  {
    return res.status(404).json({error:"User Not Found"});
  }

});


//sign out 
route.get('/signout',(req,res)=>
{
  
  res.clearCookie('jwtoken');
  return res.status(200).send({message:"Sign Out"});

});


route.listen(port, () => {
  console.log(`connection is setup at port ${port}`);
});
