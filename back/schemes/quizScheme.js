import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  classId: { type: Number, required: true },
  questions: [{
    question_id: { type: Number, required: true },
    question_text: { type: String, required: true },
    question_type: { type: String, default: 'MCQ' },
    options: [{ type: String }],
    correct_option: { type: Number, required: true },
    required: { type: Boolean, default: true }
  }],
  userAnswers: [{
    question_id: { type: Number, required: true },
    selected_option: { type: Number },
    value: { type: String },
    question_type: { type: String, required: true, enum: ['MCQ', 'short_answer'] }
  }],
});

export default mongoose.model('Quiz', quizSchema);
