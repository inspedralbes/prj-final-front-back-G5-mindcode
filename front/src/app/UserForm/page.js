'use client';

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import UserForm from '../components/UserForm';
import { useAuthStore } from '../../stores/authStore';
import { generateQuiz } from '../../services/communicationManager';

const ChatForm = () => {
  const [questions, setQuestions] = useState([]); 
  const [answers, setAnswers] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const { classInfo, handleSetCurrentLanguage } = useAuthStore();

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const quizData = await generateQuiz(); 
      console.log('Quiz data:', quizData);

      if (quizData?.quiz?.quiz && Array.isArray(quizData.quiz.quiz)) {
        setQuestions(quizData.quiz.quiz);
      }else{
        throw new Error('Invalid quiz data format');
      }
      setAnswers({});
    } catch (err) {
      setError('Error fetching questions: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmit = async () => {
    try {
      const answers = questions.map(q => selectedAnswers[q.question_id] ?? -1);
      
      if (answers.includes(-1)) {
        setError('Respon totes les preguntes correctament');
        return;
      }

      const results = await submitQuizResults(answers);
      setResults(results);
    } catch (err) {
      setError('Error submitting answers: ' + err.message);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <Sidebar classInfo={classInfo} handleSetCurrentLanguage={handleSetCurrentLanguage} />
      <div className="flex flex-col w-full">
        <Navbar />
        <UserForm
          questions={questions} 
          handleAnswerSelect={handleAnswerSelect}
          handleSubmit={handleSubmit}
          loading={loading}
          error={error}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};

export default ChatForm;