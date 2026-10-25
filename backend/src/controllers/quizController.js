import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import Result from '../models/Result.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const publicQuestion = q => ({ _id: q._id, prompt: q.prompt, options: q.options, marks: q.marks });
const quizSummary = async quiz => {
  const questions = await Question.find({ quiz: quiz._id });
  return { ...quiz.toObject(), questionCount: questions.length, totalMarks: questions.reduce((n, q) => n + q.marks, 0) };
};

export const listQuizzes = asyncHandler(async (req, res) => {
  const filter = { isPublished: true };
  if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
  if (req.query.search) filter.$or = [{ title: new RegExp(escapeRegex(req.query.search), 'i') }, { description: new RegExp(escapeRegex(req.query.search), 'i') }];
  const quizzes = await Quiz.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: await Promise.all(quizzes.map(quizSummary)) });
});

export const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
  res.json({ success: true, data: await quizSummary(quiz) });
});

export const createQuiz = asyncHandler(async (req, res) => {
  const { title, description, category, durationMinutes } = req.body || {};
  if (!title?.trim() || !description?.trim() || !category?.trim() || !Number.isFinite(Number(durationMinutes))) return res.status(400).json({ success: false, message: 'Title, description, category and durationMinutes are required' });
  const quiz = await Quiz.create({ title, description, category, durationMinutes: Number(durationMinutes) });
  res.status(201).json({ success: true, data: await quizSummary(quiz) });
});

export const updateQuiz = asyncHandler(async (req, res) => {
  const allowed = ['title', 'description', 'category', 'durationMinutes'];
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) return res.status(400).json({ success: false, message: 'A JSON object with quiz fields is required' });
  const updates = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));
  if (!Object.keys(updates).length) return res.status(400).json({ success: false, message: 'Provide at least one supported quiz field to update' });
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
  res.json({ success: true, data: await quizSummary(quiz) });
});

export const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
  await Promise.all([Question.deleteMany({ quiz: quiz._id }), Result.deleteMany({ quiz: quiz._id })]);
  res.json({ success: true, message: 'Quiz and related data deleted' });
});

export const listQuestions = asyncHandler(async (req, res) => {
  if (!await Quiz.exists({ _id: req.params.id })) return res.status(404).json({ success: false, message: 'Quiz not found' });
  const questions = await Question.find({ quiz: req.params.id }).sort({ createdAt: 1 });
  res.json({ success: true, data: questions.map(publicQuestion) });
});

// Demo management view; the student-facing /questions route above omits correctOption.
export const listManageQuestions = asyncHandler(async (req, res) => {
  if (!await Quiz.exists({ _id: req.params.id })) return res.status(404).json({ success: false, message: 'Quiz not found' });
  const questions = await Question.find({ quiz: req.params.id }).sort({ createdAt: 1 });
  res.json({ success: true, data: questions });
});

export const createQuestion = asyncHandler(async (req, res) => {
  const { prompt, options, correctOption, marks = 1 } = req.body || {};
  if (!await Quiz.exists({ _id: req.params.id })) return res.status(404).json({ success: false, message: 'Quiz not found' });
  if (typeof prompt !== 'string' || !prompt.trim() || !Array.isArray(options) || options.length < 2 || options.length > 6 || !options.every(option => typeof option === 'string' && option.trim()) || !Number.isInteger(correctOption) || correctOption < 0 || correctOption >= options.length || !Number.isInteger(Number(marks)) || Number(marks) < 1 || Number(marks) > 100) return res.status(400).json({ success: false, message: 'Provide a prompt, 2–6 non-empty options, a valid zero-based correctOption and marks from 1 to 100' });
  const question = await Question.create({ quiz: req.params.id, prompt, options, correctOption: Number(correctOption), marks: Number(marks) });
  res.status(201).json({ success: true, data: question });
});

export const updateQuestion = asyncHandler(async (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) return res.status(400).json({ success: false, message: 'A JSON object with question fields is required' });
  const allowed = ['prompt', 'options', 'correctOption', 'marks'];
  const updates = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));
  if (!Object.keys(updates).length) return res.status(400).json({ success: false, message: 'Provide at least one supported question field to update' });
  const q = await Question.findById(req.params.id);
  if (!q) return res.status(404).json({ success: false, message: 'Question not found' });
  Object.assign(q, updates);
  await q.save();
  res.json({ success: true, data: q });
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  const q = await Question.findByIdAndDelete(req.params.id);
  if (!q) return res.status(404).json({ success: false, message: 'Question not found' });
  res.json({ success: true, message: 'Question deleted' });
});

function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
