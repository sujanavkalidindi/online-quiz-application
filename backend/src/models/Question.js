import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
  prompt: { type: String, required: true, trim: true, maxlength: 1000 },
  options: { type: [String], required: true, validate: { validator: v => v.length >= 2 && v.length <= 6 && v.every(x => x.trim()), message: 'Provide 2 to 6 non-empty options' } },
  correctOption: { type: Number, required: true, min: 0 },
  marks: { type: Number, default: 1, min: 1, max: 100 }
}, { timestamps: true });

questionSchema.pre('validate', function(next) {
  if (this.correctOption >= this.options.length) this.invalidate('correctOption', 'Correct option must reference an existing option');
  next();
});

export default mongoose.model('Question', questionSchema);
