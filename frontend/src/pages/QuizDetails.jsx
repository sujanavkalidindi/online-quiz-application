import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { ErrorMessage, LoadingSpinner } from '../components/UI';

export default function QuizDetails() {
  const { id } = useParams(), navigate = useNavigate();
  const [quiz, setQuiz] = useState(null), [name, setName] = useState(''), [error, setError] = useState('');
  useEffect(() => { api.quiz(id).then(setQuiz).catch(e => setError(e.message)); }, [id]);
  if (error) return <div className="page-wrap"><ErrorMessage message={error}/><Link to="/">← Back to quizzes</Link></div>;
  if (!quiz) return <LoadingSpinner/>;
  const begin = e => { e.preventDefault(); if (name.trim()) { sessionStorage.setItem(`student-${id}`, name.trim()); navigate(`/quiz/${id}/take`); } };
  return <section className="detail-page"><Link to="/" className="back-link">← All quizzes</Link><div className="detail-layout"><div className="detail-main"><span className="category-pill">{quiz.category}</span><h1>{quiz.title}</h1><p className="detail-description">{quiz.description}</p><div className="detail-stats"><div><span>◷</span><b>{quiz.durationMinutes} min</b><small>Time limit</small></div><div><span>▤</span><b>{quiz.questionCount}</b><small>Questions</small></div><div><span>★</span><b>{quiz.totalMarks}</b><small>Total marks</small></div></div><div className="instructions"><h3>Before you begin</h3><ul><li>Find a comfortable spot where you can focus.</li><li>You can move between questions before you submit.</li><li>Your answers are saved when you submit the quiz.</li><li>The quiz submits automatically when time runs out.</li></ul></div></div><aside className="start-panel"><div className="panel-icon">✦</div><span className="eyebrow">READY WHEN YOU ARE</span><h2>Let’s get started.</h2><p>First, tell us what to call you on your results.</p><form onSubmit={begin}><label className="form-field"><span>Your name</span><input required maxLength="80" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Alex Morgan"/></label><button className="btn btn-primary btn-full" type="submit">Start this quiz <span>→</span></button></form><small className="privacy-note">No account needed. Just you and a few questions.</small></aside></div></section>;
}
