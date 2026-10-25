import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
  studentName: { type: String, required: true, trim: true, maxlength: 80 },
  score: { type: Number, required: true, min: 0 },
  totalMarks: { type: Number, required: true, min: 0 },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  correctCount: { type: Number, required: true, min: 0 },
  incorrectCount: { type: Number, required: true, min: 0 },
  answers: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    promptSnapshot: String,
    optionsSnapshot: [String],
    correctOptionSnapshot: Number,
    marksSnapshot: Number,
    selectedOption: Number,
    isCorrect: Boolean,
    marksAwarded: Number
  }]
}, { timestamps: true });

export default mongoose.model('Result', resultSchema);
