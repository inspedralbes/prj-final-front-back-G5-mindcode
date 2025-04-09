'use client';

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import UserForm from '../components/UserForm';
import { useAuthStore } from '../../stores/authStore';
import { generateQuiz } from 'services/communicationManager';

const ChatForm = () => {
  const [highlitedLanguage, setHighlitedLanguage] = useState(null);
  const [highlitedLanguageIndex, setHighlitedLanguageIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const classInfo = useAuthStore((state) => state.class_info);
  const user_info = useAuthStore.getState().user_info;

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const messages = [
        "JavaScript: What is a closure in JavaScript and how can it be used?",
        "PHP: Can you explain the preg_match function in PHP and provide an example of its usage?",
        "Python: How does list comprehension work in Python, and when would you use it?"
      ];
      const quizData = await generateQuiz(messages);
      console.log('Quiz data received:', quizData);

      if (quizData?.quiz?.questions && Array.isArray(quizData.quiz.questions)) {
        setQuestions(quizData.quiz.questions);
      } else {
        throw new Error('Invalid quiz data format');
      }
    } catch (err) {
      setError('Error fetching questions: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user_info.token}`,
        },
        body: JSON.stringify({
          answers: answers,
          quiz_id: questions[0]?.quiz_id
        })
      });

      if (!response.ok) {
        throw new Error('Error al enviar les respostes');
      }

      const result = await response.json();
      console.log('Quiz result:', result);
    } catch (err) {
      setError('Error al enviar les respostes: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetCurrentLanguage = (language) => {
    setHighlitedLanguage(language);
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
          answers={answers}
          handleAnswerChange={handleAnswerChange}
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