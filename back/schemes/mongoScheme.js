import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema({
  userContent: { type: String, required: true },
  aiContent: { type: String, required: true },
  aiThought: { type: String },
  userId: { type: Number, required: true },     
  classId: { type: Number, required: true },
  languageId: { type: Number, required: true },   
  language: { type: String, required: true },

  meta: {
    votes: { type: Number, default: 0 },
    favs: { type: Number, default: 0 }
  },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);