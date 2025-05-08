'use client';

import React, { useState, useEffect } from 'react';
import FormFields from './organisms/FormFields';
import FormButton from './atoms/FormButton';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'next/navigation';
import { checkQuizAvailability, submitQuizResults } from '../../services/communicationManager';

const UserForm = () => {
  const [questions, setQuestions] = useState([]); 
  const [answers, setAnswers] = useState({}); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [results, setResults] = useState(null); 
  const [showResults, setShowResults] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const classInfo = useAuthStore((state) => state.class_info);
  const router = useRouter();

  const loadQuiz = async () => {
    setLoading(true);
    setError(null);
    setShowResults(false);
    
    try {
      const data = await checkQuizAvailability();
      console.log('Quiz data:', data);
      if (data.quizAvailable && data.quiz && data.quizId) {
        setQuestions(data.quiz);
        setQuizId(data.quizId);
        setLoading(false);
      } else {
        setError('No hi ha questionari disponible');
        setLoading(false);
        setTimeout(() => router.push('/'), 2000);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Error fetching questions: ');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, []);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!quizId) {
        setError('No quiz ID available');
        return;
      }

      const answersArray = questions.map(question => {
        const answer = answers[question.question_id];
        if (!answer) return null;

        return {
          question_id: question.question_id,
          selected_option: answer.selected_option
        };
      }).filter(Boolean);

      if (answersArray.length !== questions.length) {
        setError('Respon totes les preguntes');
        setLoading(false);
        return;
      }

      const results = await submitQuizResults(quizId, answersArray);
      console.log('Quiz results:', results);
      
      if (results && results.results) {
        const updatedAnswers = {};
        results.results.forEach(result => {
          updatedAnswers[result.question_id] = {
            selected_option: result.selected_option,
            isCorrect: result.isCorrect
          };
        });
        setAnswers(updatedAnswers);
        setResults(results);
        setShowResults(true);
      } else {
        throw new Error('Formato de resultados inválido');
      }
    } catch (err) {
      console.error('Error al enviar respuestas:', err);
      setError('Error al enviar las respuestas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4 rounded-md">
      <div className="max-w-3xl mx-auto p-6 overflow-y-auto">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Carregant preguntes...</p>
          </div>
        ) : error ? (
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p>{error}</p>
            <FormButton text="Tornar a provar" onClick={loadQuiz} className="mt-4" />
          </div>
        ) : showResults ? (
          <div className="space-y-6">
            <FormFields
              questions={questions}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              showResults={true}
            />
            <div className="text-center">
              <FormButton text="Tornar a provar" onClick={loadQuiz} className="mt-4" />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <FormFields
              questions={questions}
              answers={answers}
              onAnswerChange={handleAnswerChange}
            />
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 py-4">
              <FormButton
                text="Enviar"
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== questions.length}
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserForm;