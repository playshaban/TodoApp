const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({path : './config.env'});
const weburl = process.env.ONLINE_DB;
const offDB = process.env.OFFLINE_DB;

mongoose.connect(weburl,
{
    useNewUrlParser: true,
    useUnifiedTopology:true,
   
}).then(()=>
{
    console.log("Connection has been made successfully");
}).catch((e)=>
{
    console.log(e);
})