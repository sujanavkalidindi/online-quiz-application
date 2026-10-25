import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 500 },
  category: { type: String, required: true, trim: true, maxlength: 60 },
  durationMinutes: { type: Number, required: true, min: 1, max: 240 },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Quiz', quizSchema);
