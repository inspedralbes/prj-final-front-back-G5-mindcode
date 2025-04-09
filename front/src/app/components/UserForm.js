'use client';

import React, { useState, useEffect } from 'react';
import FormFields from './organisms/FormFields';
import FormButton from './atoms/FormButton';
import { useAuthStore } from '../../stores/authStore';
import { generateQuiz } from '../../services/communicationManager';

const UserForm = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const user_info = useAuthStore.getState().user_info;

  useEffect(() => {
    loadQuestions();
  }, []);

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
      
      // Verificar la estructura anidada correcta
      if (quizData?.quiz?.quiz && Array.isArray(quizData.quiz.quiz)) {
        setQuestions(quizData.quiz.quiz);
        console.log('Questions set:', quizData.quiz.quiz);
      } else {
        console.error('Invalid quiz data structure:', quizData);
        throw new Error('Invalid quiz data format');
      }
    } catch (err) {
      setError('Error al carregar les preguntes: ' + err.message);
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
      setShowResults(true);
    } catch (err) {
      setError('Error al enviar les respostes: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
    loadQuestions();
  };

  if (loading) {
    return (
      <div className="flex-grow overflow-y-auto p-4 space-y-4 rounded-md">
        <p className="text-gray-600 dark:text-gray-300">Preparant qüestionari...</p>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4 rounded-md">
      <form onSubmit={handleSubmit} className="w-full">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Qüestionari</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded">
            {error}
          </div>
        )}

        {questions && questions.length > 0 ? (
          <>
            <FormFields
              questions={questions}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              showResults={showResults}
            />
            <div className="mt-6">
              {!showResults ? (
                <FormButton
                  text="Enviar respostes"
                  type="submit"
                  className="w-full"
                  disabled={loading || Object.keys(answers).length !== questions.length}
                />
              ) : (
                <FormButton
                  text="Nou qüestionari"
                  type="button"
                  className="w-full"
                  onClick={resetQuiz}
                />
              )}
            </div>
          </>
        ) : !loading && (
          <div className="text-gray-600 dark:text-gray-300">
            No hi ha preguntes disponibles en aquest moment.
          </div>
        )}
      </form>
    </div>
  );
};

export default UserForm;
