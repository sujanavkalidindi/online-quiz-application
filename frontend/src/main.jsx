import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Layout } from './components/UI';
import Home from './pages/Home';
import QuizDetails from './pages/QuizDetails';
import TakeQuiz from './pages/TakeQuiz';
import Result from './pages/Result';
import Manage from './pages/Manage';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><Routes><Route path="/" element={<Layout><Home/></Layout>}/><Route path="/quiz/:id" element={<Layout><QuizDetails/></Layout>}/><Route path="/quiz/:id/take" element={<TakeQuiz/>}/><Route path="/result/:id" element={<Layout><Result/></Layout>}/><Route path="/manage" element={<Layout><Manage/></Layout>}/><Route path="*" element={<Layout><div className="page-wrap"><h1>Page not found</h1><Link to="/">Back home</Link></div></Layout>}/></Routes></BrowserRouter></React.StrictMode>);
