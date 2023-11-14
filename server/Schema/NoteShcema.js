
const mongoose = require('mongoose');


const noteSchema = new mongoose.Schema({
  textnote: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time:
  {
    type: String,
  },
  userId: {
    type: String, 
    required: true,
    default:"7070921343"
  },
  checked:
  {
    type: Boolean,
    required: true,
    default : 0
  }
});



const Note = new mongoose.model('Note',noteSchema);


module.exports = Note;

