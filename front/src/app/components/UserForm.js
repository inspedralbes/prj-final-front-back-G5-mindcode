'use client';

import React, { useState, useEffect } from 'react';
import FormFields from './organisms/FormFields';
import FormButton from './atoms/FormButton';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'next/navigation';
import { checkQuizAvailability, submitQuizResults } from '../../services/communicationManager';
import QuizList from './molecules/QuizList';

const UserForm = () => {
  const [questions, setQuestions] = useState([]); 
  const [answers, setAnswers] = useState({}); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [results, setResults] = useState(null); 
  const [showResults, setShowResults] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const [quizList, setQuizList] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const userData = useAuthStore((state) => state);
  const class_info = useAuthStore((state) => state.class_info);
  const router = useRouter();

  const loadQuizzes = () => {
    setLoading(true);
    setError(null);
    setShowResults(false);
    
    const quizzes = class_info?.[0]?.quizz_info || [];
    console.log('Quizzes from userData:', quizzes);
    
    const formattedQuizzes = quizzes.map(quiz => ({
      id: quiz._id,
      questions: quiz.questions,
      correctAnswers: quiz.correctAnswers,
      totalQuestions: quiz.questions.length
    }));
    
    console.log('Formatted quizzes:', formattedQuizzes);
    setQuizList(formattedQuizzes);
    setLoading(false);
  };

  const loadSelectedQuiz = (quizId) => {
    setLoading(true);
    setError(null);
    try {
      const quizzes = class_info?.[0]?.quizz_info || [];
      const selectedQuiz = quizzes.find(quiz => quiz.quizId === quizId);
      
      if (selectedQuiz && selectedQuiz.questions) {
        setQuestions(selectedQuiz.questions);
        setQuizId(quizId);
        setSelectedQuiz(selectedQuiz);
      } else {
        throw new Error('Quiz no trobat');
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      setError('Error carregant el qüestionari');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadQuizzes();
  }, [userData]); 

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
    <div className="max-w-4xl mx-auto p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Carregant...</p>
        </div>
      ) : selectedQuiz ? (
        showResults ? (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold mb-4">Resultats</h2>
            <div className="space-y-4">
              {questions.map((question, index) => {
                const answer = answers[question.question_id];
                return (
                  <div 
                    key={question.question_id}
                    className={`p-4 rounded ${answer?.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}
                  >
                    <p className="font-semibold">{question.question_text}</p>
                    <p className="mt-2">
                      Resposta seleccionada: {question.options[answer?.selected_option]}
                    </p>
                    {!answer?.isCorrect && (
                      <p className="mt-2 text-red-600">
                        Resposta correcta: {question.options[question.correct_option]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => {
                setSelectedQuiz(null);
                setShowResults(false);
                setAnswers({});
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Tornar als qüestionaris
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={() => {
                setSelectedQuiz(null);
                setAnswers({});
              }}
              className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              ← Tornar
            </button>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <FormFields 
                questions={questions}
                answers={answers}
                onAnswerChange={handleAnswerChange}
              />
              <div className="flex items-center justify-between mt-6">
                <FormButton 
                  type="submit"
                  disabled={Object.keys(answers).length !== questions.length}
                  className={`${Object.keys(answers).length !== questions.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Enviar respostes
                </FormButton>
              </div>
            </form>
          </div>
        )
      ) : (
        <QuizList 
          quizzes={quizList}
          handleQuizSelect={(quizId) => loadSelectedQuiz(quizId)}
          userData={userData}
        />
      )}
    </div>
  );
};

export default UserForm;