import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { LoadingSpinner, ErrorMessage, Timer, ProgressIndicator } from '../components/UI';

export default function TakeQuiz() {
  const { id } = useParams(), navigate = useNavigate();
  const [quiz, setQuiz] = useState(null), [questions, setQuestions] = useState([]), [current, setCurrent] = useState(0), [answers, setAnswers] = useState({}), [seconds, setSeconds] = useState(null), [error, setError] = useState(''), [sending, setSending] = useState(false);
  const submit = useCallback(async timedOut => {
    if (sending || !questions.length) return;
    setSending(true); setError('');
    try { const result = await api.submit({ quizId: id, studentName: sessionStorage.getItem(`student-${id}`) || 'Student', answers: questions.filter(q => answers[q._id] !== undefined).map(q => ({ questionId: q._id, selectedOption: answers[q._id] })) }); sessionStorage.setItem('latest-result', JSON.stringify(result)); if (timedOut) sessionStorage.setItem('timed-out', 'true'); navigate(`/result/${result._id}`); }
    catch (e) { setError(e.message); setSending(false); }
  }, [answers, id, navigate, questions, sending]);
  const submitRef = useRef(submit);
  submitRef.current = submit;
  useEffect(() => { Promise.all([api.quiz(id), api.questions(id)]).then(([q, qs]) => { if (!qs.length) throw new Error('This quiz does not have any questions yet.'); setQuiz(q); setQuestions(qs); setSeconds(q.durationMinutes * 60); }).catch(e => setError(e.message)); }, [id]);
  useEffect(() => { if (seconds === null || sending) return; if (seconds <= 0) { submitRef.current(true); return; } const timer = setTimeout(() => setSeconds(s => Math.max(0, s - 1)), 1000); return () => clearTimeout(timer); }, [seconds, sending]);
  if (error && !questions.length) return <div className="page-wrap"><ErrorMessage message={error}/><Link to="/">← Back to quizzes</Link></div>;
  if (!quiz || !questions.length || seconds === null) return <LoadingSpinner label="Preparing your quiz…"/>;
  const q = questions[current];
  return <section className="take-page"><div className="take-top"><Link to="/" className="brand"><span className="brand-icon">q</span> quizly<span className="brand-dot">.</span></Link><span className="take-title">{quiz.title}</span><Timer seconds={seconds}/></div>{error && <div className="inline-error">{error}<button onClick={() => submit(false)}>Retry submission</button></div>}<div className="take-content"><ProgressIndicator current={current + 1} total={questions.length}/><div className="question-heading"><span className="eyebrow">QUESTION {String(current + 1).padStart(2, '0')}</span><span className="marks-pill">{q.marks} {q.marks === 1 ? 'point' : 'points'}</span></div><h1>{q.prompt}</h1><p className="question-hint">Choose the best answer below.</p><div className="options-list">{q.options.map((option, i) => <button key={i} className={`option ${answers[q._id] === i ? 'selected' : ''}`} onClick={() => setAnswers(a => ({ ...a, [q._id]: i }))}><span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{option}</span><span className="option-radio"/></button>)}</div><div className="question-footer"><button className="btn btn-outline" disabled={current === 0} onClick={() => setCurrent(n => n - 1)}>← Previous</button><span className="answered-note">{Object.keys(answers).length} of {questions.length} answered</span>{current < questions.length - 1 ? <button className="btn btn-primary" onClick={() => setCurrent(n => n + 1)}>Next question <span>→</span></button> : <button className="btn btn-primary" disabled={sending} onClick={() => submit(false)}>{sending ? 'Submitting…' : 'Submit quiz'} <span>✓</span></button>}</div></div></section>;
}
