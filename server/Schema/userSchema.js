const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name: 
    {
        type: String, 
        require : true
    },
    email : 
    {
        type : String , 
        require : true
    },
    password: 
    {
        type : String, 
        require : true 
    },
    tokens: [
        {
            token: 
            {
                type: String,
                require: true
            }
        }
    ]
   
});

 
userSchema.pre('save', async function(next)
{
    if(this.isModified('password'))
    {
        this.password = await bcrypt.hash(this.password,12);
    }
    next();
})



//for generating a new token when user logins
userSchema.methods.generateAuthToken = async function ()
{
    try 
    {
        let token = jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token});
        await this.save();
        return token;
    }
    catch(err)
    {
        console.log(err);
    }
}

const User = new mongoose.model('User', userSchema);
module.exports = User;