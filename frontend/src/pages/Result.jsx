import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { LoadingSpinner, ErrorMessage, ResultSummary } from '../components/UI';

export default function Result() {
  const { id } = useParams(), [result, setResult] = useState(null), [error, setError] = useState('');
  useEffect(() => { api.result(id).then(setResult).catch(e => setError(e.message)); }, [id]);
  if (error) return <div className="page-wrap"><ErrorMessage message={error}/><Link to="/">← Explore quizzes</Link></div>;
  if (!result) return <LoadingSpinner label="Putting your results together…"/>;
  const review = result.answers || [];
  return <section className="result-page"><div className="result-header"><span className="result-confetti">✳</span><div className="eyebrow">QUIZ COMPLETE</div><h1>Nice work, {result.studentName}!</h1><p>You showed up and gave it a go. Here’s how you did.</p><span className="completed-quiz">{result.quiz?.title}</span></div><div className="result-card"><div className="score-ring" style={{ '--score': `${result.percentage}%` }}><div><strong>{result.percentage}<small>%</small></strong><span>YOUR SCORE</span></div></div><ResultSummary result={result}/></div><div className="review-section"><div className="section-heading"><div><div className="eyebrow">WHAT YOU LEARNED</div><h2>Answer review<span>.</span></h2></div><span className="review-count">{review.length} questions</span></div><div className="review-list">{review.map((a, i) => { const q = a.question || (a.promptSnapshot ? { prompt: a.promptSnapshot, options: a.optionsSnapshot, correctOption: a.correctOptionSnapshot, marks: a.marksSnapshot } : null); return q ? <article className={`review-item ${a.isCorrect ? 'review-correct' : 'review-wrong'}`} key={a._id || i}><div className="review-status">{a.isCorrect ? '✓' : '×'}</div><div className="review-body"><span className="eyebrow">QUESTION {String(i + 1).padStart(2, '0')}</span><h3>{q.prompt}</h3><p>Your answer: <b>{a.selectedOption === null ? 'Not answered' : q.options[a.selectedOption]}</b></p>{!a.isCorrect && <p className="correct-answer">Correct answer: <b>{q.options[q.correctOption]}</b></p>}</div><span className="review-points">{a.marksAwarded}/{q.marks} pts</span></article> : null; })}</div></div><div className="result-actions"><Link to="/" className="btn btn-primary">Explore more quizzes <span>→</span></Link><button className="btn btn-outline" onClick={() => window.print()}>Print results</button></div></section>;
}
