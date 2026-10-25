const API_BASE = import.meta.env.VITE_API_URL || '';
async function request(path, options = {}) {
  const adminKey = window.sessionStorage.getItem('quiz-admin-key');
  const response = await fetch(`${API_BASE}/api${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(adminKey ? { 'x-admin-key': adminKey } : {}), ...options.headers } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || 'Something went wrong. Please try again.');
  return body.data;
}
export const api = {
  quizzes: (params = {}) => request(`/quizzes?${new URLSearchParams(params)}`),
  quiz: id => request(`/quizzes/${id}`),
  questions: id => request(`/quizzes/${id}/questions`),
  manageQuestions: id => request(`/quizzes/${id}/questions/manage`),
  createQuiz: body => request('/quizzes', { method: 'POST', body: JSON.stringify(body) }),
  updateQuiz: (id, body) => request(`/quizzes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteQuiz: id => request(`/quizzes/${id}`, { method: 'DELETE' }),
  addQuestion: (id, body) => request(`/quizzes/${id}/questions`, { method: 'POST', body: JSON.stringify(body) }),
  updateQuestion: (id, body) => request(`/questions/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteQuestion: id => request(`/questions/${id}`, { method: 'DELETE' }),
  submit: body => request('/results', { method: 'POST', body: JSON.stringify(body) }),
  results: () => request('/results'),
  result: id => request(`/results/${id}`)
};
