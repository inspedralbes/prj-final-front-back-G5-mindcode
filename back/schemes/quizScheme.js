import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  correctAnswers: { type: Number, default: 0 },
  userId: { type: Number, required: true },
  classId: { type: Number, required: true },
  questions: [{
    isAnswered: { type: Boolean, default: false },
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
    selected_text: { type: String,required: true },
    isCorrect: { type: Boolean, default: false },
    question_type: { type: String, required: true, enum: ['MCQ', 'short_answer'] }
  }],
},
  { timestamps: true }
);

export default mongoose.model('Quiz', quizSchema);
