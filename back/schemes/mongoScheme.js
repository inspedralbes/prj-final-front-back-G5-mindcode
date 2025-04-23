import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  userContent: { type: String, required: true },
  aiContent: { type: String},
  aiThought: { type: String },
  userId: { type: Number, required: true },     
  classId: { type: Number, required: true },
  languageId: { type: Number, required: true },   
  language: { type: String, required: true },


});

export default mongoose.model('Message', messageSchema);