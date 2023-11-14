const mongoose = require('mongoose');
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

userSchema.methods.generateAuth()


const User = new mongoose.model('User', userSchema);
module.exports = User;