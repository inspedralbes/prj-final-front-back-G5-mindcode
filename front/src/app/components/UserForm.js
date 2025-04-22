'use client';

import React, { useState, useEffect } from 'react';
import FormFields from './organisms/FormFields';
import FormButton from './atoms/FormButton';
import { useAuthStore } from '../../stores/authStore';
import { generateQuiz, submitQuizResults, getQuiz } from '../../services/communicationManager';

const UserForm = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const quizData = await getQuiz();
      console.log('Quiz data:', quizData);
      setQuestions(quizData);
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
    try {
      const answersArray = questions.map(question => ({
        question_id: question.question_id,
        answer: answers[question.question_id]?.value,
        selected_option: answers[question.question_id]?.optionIndex
      }));
      console.log('Submitting answers:', answersArray);

      const results = await submitQuizResults(answersArray);
      console.log('Quiz results:', results);
      setResults(results);
      setShowResults(true);
    } catch (err) {
      setError('Error submitting answers: ' + err.message);
      console.error('Submit error:', err);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4 rounded-md">
      <div className="max-w-3xl mx-auto p-6 overflow-y-auto" >
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading questions...</p>
          </div>
        ) : (questions && questions.length > 0) ? (
          <div className="space-y-8">
            <FormFields
              questions={questions}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              showResults={showResults}
            />
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 py-4">
              <FormButton
                text={showResults ? "Try Again" : "Submit"}
                onClick={showResults ? () => {
                  setShowResults(false);
                  setAnswers({});
                  loadQuestions();
                } : handleSubmit}
                disabled={loading || (!showResults && Object.keys(answers).length !== questions.length)}
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        ) : (
          <div className="text-gray-600 dark:text-gray-300">
            No questions available at this time.
            <FormButton 
              text="Refresh" 
              onClick={loadQuestions}
              className="mt-4"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserForm;
