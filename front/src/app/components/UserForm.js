'use client';

import React, { useState, useEffect } from 'react';
import FormFields from './organisms/FormFields';
import FormButton from './atoms/FormButton';
import QuizResults from './molecules/QuizResults';
import { generateQuiz, submitQuizResults } from '../../services/communicationManager';
import { useAuthStore } from '../../stores/authStore';

const UserForm = () => {
  const [questions, setQuestions] = useState([]); 
  const [answers, setAnswers] = useState({}); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [results, setResults] = useState(null); 
  const [showResults, setShowResults] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const classInfo = useAuthStore((state) => state.class_info);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const classId = classInfo[0]?.class_id;
      const quizData = await generateQuiz(classId);
      console.log('Quiz data:', quizData);
      
      if (!quizData.quiz || !quizData.quizId) {
        throw new Error('Invalid quiz data received');
      }

      console.log('Quiz questions:', quizData.quiz);
      setQuestions(quizData.quiz);
      setQuizId(quizData.quizId);
      setAnswers({}); 
      setShowResults(false); 
    } catch (err) {
      setError('Error fetching questions: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (question_id, answer) => {
    console.log(`Answer updated for question ${question_id}:`, answer);
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [question_id]: answer
    }));
  };


  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
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
          question_text: question.question_text,
          selected_option: answer.selected_option,
          value: answer.answer
        };
      }).filter(Boolean);

      if (answersArray.length !== questions.length) {
        setError('Respon totes les preguntes');
        return;
      }

      const results = await submitQuizResults(quizId, answersArray);
      console.log('Quiz results:', results);
      setResults(results);
      setShowResults(true);
    } catch (err) {
      setError('Error submitting answers: ' + err.message);
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4 rounded-md">
      <div className="max-w-3xl mx-auto p-6 overflow-y-auto">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading questions...</p>
          </div>
        ) : error ? (
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p>{error}</p>
            <FormButton text="Retry" onClick={loadQuestions} className="mt-4" />
          </div>
        ) : showResults ? (
          <div className="space-y-6">
            <QuizResults 
              results={results.results} 
              questions={questions}
            />
            <div className="text-center">
              <FormButton text="Try Again" onClick={loadQuestions} className="mt-4" />
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
                text="Submit"
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