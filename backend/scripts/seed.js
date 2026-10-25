import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import Quiz from '../src/models/Quiz.js';
import Question from '../src/models/Question.js';

const demos = [
  { title: 'JavaScript essentials', description: 'Get comfortable with the language that powers the web. A friendly check of the fundamentals.', category: 'JavaScript', durationMinutes: 8, questions: [
    ['What does the `const` keyword prevent?', ['Reassignment of the variable binding', 'Changing an object’s properties', 'Using the variable in a function', 'Declaring an array'], 0, 1],
    ['Which array method creates a new array by transforming every item?', ['forEach()', 'map()', 'find()', 'push()'], 1, 1],
    ['What is the result of `typeof null` in JavaScript?', ['"null"', '"undefined"', '"object"', '"boolean"'], 2, 1],
    ['Which operator checks both value and type equality?', ['==', '===', '!=', '='], 1, 1],
    ['What does `Promise.all()` do?', ['Runs promises one by one', 'Waits for all promises to settle successfully', 'Cancels pending promises', 'Converts a callback into a promise'], 1, 1]
  ] },
  { title: 'React building blocks', description: 'Components, props and state — check your understanding of the pieces behind React interfaces.', category: 'React', durationMinutes: 10, questions: [
    ['What is a React component?', ['A reusable piece of UI', 'A database table', 'A CSS selector', 'A browser event'], 0, 1],
    ['Which hook is used to add state to a function component?', ['useRef', 'useEffect', 'useState', 'useMemo'], 2, 1],
    ['Why should list items have a `key` prop?', ['To apply styles', 'To help React identify items between updates', 'To make items clickable', 'To set their order'], 1, 1],
    ['How does data typically flow from a parent to a child component?', ['Through props', 'Through state setters', 'Through CSS', 'Through the DOM'], 0, 1],
    ['When does the callback passed to `useEffect` run by default?', ['Before every render', 'After every render', 'Only on server startup', 'Before component creation'], 1, 1]
  ] },
  { title: 'Computer science quick check', description: 'A compact tour through algorithms, data structures and the fundamentals of computing.', category: 'Computer Science', durationMinutes: 7, questions: [
    ['Which data structure follows the First In, First Out principle?', ['Stack', 'Queue', 'Tree', 'Graph'], 1, 1],
    ['What is the time complexity of binary search on a sorted array?', ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], 2, 1],
    ['Which part of a computer performs arithmetic and logical operations?', ['RAM', 'ALU', 'SSD', 'Network card'], 1, 1],
    ['What does HTTP stand for?', ['HyperText Transfer Protocol', 'High Transfer Text Program', 'Hyperlink Terminal Transfer Process', 'Host Text Transmission Protocol'], 0, 1],
    ['Which number system uses only 0 and 1?', ['Decimal', 'Octal', 'Hexadecimal', 'Binary'], 3, 1]
  ] }
];

try {
  await connectDB();
  for (const demo of demos) {
    const { questions, ...data } = demo;
    let quiz = await Quiz.findOne({ title: data.title });
    if (!quiz) quiz = await Quiz.create(data);
    if (!await Question.exists({ quiz: quiz._id })) await Question.insertMany(questions.map(([prompt, options, correctOption, marks]) => ({ quiz: quiz._id, prompt, options, correctOption, marks })));
    console.log(`Seeded: ${quiz.title}`);
  }
} catch (error) { console.error(error); process.exitCode = 1; }
finally { await mongoose.disconnect(); }
