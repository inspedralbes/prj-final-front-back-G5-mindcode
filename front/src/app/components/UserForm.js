'use client';

import React, { useState, useEffect } from 'react';
import FormFields from './organisms/FormFields';
import FormButton from './atoms/FormButton';
import { generateQuiz, submitQuizResults } from '../../services/communicationManager';

const UserForm = () => {
  const [questions, setQuestions] = useState([]); 
  const [answers, setAnswers] = useState({}); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [results, setResults] = useState(null); 
  const [showResults, setShowResults] = useState(false);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const quizData = await generateQuiz();
      console.log('Quiz data:', quizData);
      
      console.log('Quiz questions:', quizData.quiz);
      setQuestions(quizData.quiz);
      setAnswers({}); 
      setShowResults(false); 
    } catch (err) {
      setError('Error fetching questions: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    console.log(`Answer updated for question ${questionId}:`, answer);
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer
    }));
  };


  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const answersArray = questions.map(question => ({
        question_id: question.question_id,
        question_text: question.question_text,
        answer: answers[question.question_id]?.value,
        selected_option: answers[question.question_id]?.optionIndex,
      }));

      if (answersArray.some(answer => !answer.answer)) {
        setError('Respon totes les preguntes');
        return;
      }

      const results = await submitQuizResults(questions[0]?.quiz_id, answersArray);
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
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p>Quiz completed! Here are your results:</p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-left">
              {JSON.stringify(results, null, 2)}
            </pre>
            <FormButton text="Try Again" onClick={loadQuestions} className="mt-4" />
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