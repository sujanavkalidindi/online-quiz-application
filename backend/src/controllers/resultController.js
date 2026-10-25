import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import Result from '../models/Result.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const submitResult = asyncHandler(async (req, res) => {
  const { quizId, studentName, answers } = req.body || {};
  if (typeof quizId !== 'string' || typeof studentName !== 'string' || !studentName.trim() || !Array.isArray(answers)) return res.status(400).json({ success: false, message: 'quizId, studentName and answers are required' });
  const quiz = await Quiz.findById(quizId);
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
  const questions = await Question.find({ quiz: quizId });
  if (!questions.length) return res.status(400).json({ success: false, message: 'This quiz has no questions yet' });
  const submitted = new Map();
  for (const a of answers) {
    if (!a || typeof a !== 'object' || Array.isArray(a)) return res.status(400).json({ success: false, message: 'Each answer must be an object' });
    const key = String(a.questionId || '');
    if (submitted.has(key) || !Number.isInteger(a.selectedOption) || !questions.some(q => String(q._id) === key && a.selectedOption >= 0 && a.selectedOption < q.options.length)) return res.status(400).json({ success: false, message: 'Answers contain an invalid or duplicate question/option' });
    submitted.set(key, a.selectedOption);
  }
  let score = 0, correctCount = 0;
  const details = questions.map(q => {
    const selectedOption = submitted.has(String(q._id)) ? submitted.get(String(q._id)) : null;
    const isCorrect = selectedOption === q.correctOption;
    if (isCorrect) { score += q.marks; correctCount++; }
    return {
      question: q._id,
      promptSnapshot: q.prompt,
      optionsSnapshot: q.options,
      correctOptionSnapshot: q.correctOption,
      marksSnapshot: q.marks,
      selectedOption,
      isCorrect,
      marksAwarded: isCorrect ? q.marks : 0
    };
  });
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const result = await Result.create({ quiz: quizId, studentName: studentName.trim(), score, totalMarks, percentage: Math.round(score / totalMarks * 100), correctCount, incorrectCount: questions.length - correctCount, answers: details });
  res.status(201).json({ success: true, data: await result.populate([{ path: 'quiz', select: 'title category' }, { path: 'answers.question', select: 'prompt options correctOption marks' }]) });
});

export const listResults = asyncHandler(async (req, res) => {
  const results = await Result.find().populate('quiz', 'title category').sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, data: results });
});

export const getResult = asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.id).populate('quiz', 'title category').populate('answers.question', 'prompt options correctOption marks');
  if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
  res.json({ success: true, data: result });
});
