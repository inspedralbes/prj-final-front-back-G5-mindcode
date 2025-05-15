'use client';

import React, { useState, useEffect } from 'react';
import FormFields from './organisms/FormFields';
import FormButton from './atoms/FormButton';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'next/navigation';
import { checkQuizAvailability, getQuiz, submitQuizResults } from '../../services/communicationManager';
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
      quizId: quiz._id,
      questions: quiz.questions,
      userAnswers: quiz.userAnswers,
      correctAnswers: quiz.correctAnswers,
      totalQuestions: quiz.questions.length
    }));
    
    console.log('Formatted quizzes:', formattedQuizzes);
    setQuizList(formattedQuizzes);
    setLoading(false);
  };

  const loadSelectedQuiz = async (quizId) => {
    setLoading(true);
    setError(null);
    console.log("Quiz selected:", quizId);
    try {
      const data = await checkQuizAvailability(quizId);
      if (data.quiz) {
        setQuestions(data.quiz);
        setQuizId(data.quizId);
        setSelectedQuiz({
          ...data,
          quiz_id: quizId
        });
      } else {
        const quizzes = class_info?.[0]?.quizz_info || [];
        const selectedQuiz = quizzes.find(quiz => quiz.quizId === quizId);
        
        if (selectedQuiz && selectedQuiz.questions) {
          setQuestions(selectedQuiz.questions);
          setQuizId(quizId);
          setSelectedQuiz(selectedQuiz);
        } else {
          throw new Error('Quiz no trobat');
        }
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

  const loadSelectedGame = async (quizId) => {
    setLoading(true);
    setError(null);
    try {
      console.log("📦 Resultado de getQuiz:", quizId);
      localStorage.setItem('quizId', quizId);
      router.push(`/Lenguajes/python`);

    } catch (error) {
      console.error('Error loading game:', error);
      setError('Error carregant el joc');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadQuizzes();
  }, [userData]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        selected_option: answer.selected_option,
        selected_text: answer.answer,
        isCorrect: false
      }
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
          selected_option: answer.selected_option,
          selected_text: answer.selected_text,
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
          const question = questions.find(q => q.question_id === result.question_id);
          const selectedText = question ? question.options[result.selected_option] : ''; 
          updatedAnswers[result.question_id] = {
            selected_option: result.selected_option,
            selected_text: selectedText,
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
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Carregant...</p>
          </div>
        ) : selectedQuiz ? (
          showResults ? (
            <div className="space-y-6">
              <FormFields
                questions={questions}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                showResults={true}
              />
              <div className="text-center">
                <FormButton 
                  text="Tornar als qüestionaris" 
                  onClick={() => {
                    setSelectedQuiz(null);
                    setShowResults(false);
                    setAnswers({});
                  }} 
                  className="mt-4" 
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <button
                onClick={() => {
                  setSelectedQuiz(null);
                  setAnswers({});
                }}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 mb-4"
              >
                ← Tornar als qüestionaris
              </button>
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
          )
        ) : (
          <QuizList 
            quizzes={quizList}
            handleQuizSelect={(quizId) => loadSelectedQuiz(quizId)}
            handleGameSelect={(quizId) => loadSelectedGame(quizId)}
            userData={userData}
            onViewResults={(quiz) => {
              setQuestions(quiz.questions);
              setQuizId(quiz.id);
              setSelectedQuiz(quiz);
              
              if (quiz.userAnswers) {
                const formattedAnswers = {};
                quiz.userAnswers.forEach(answer => {
                  const question = quiz.questions.find(q => q.question_id === answer.question_id);
                  formattedAnswers[answer.question_id] = {
                    selected_option: answer.selected_option,
                    selected_text: question.options[answer.selected_option],
                    isCorrect: answer.isCorrect
                  };
                });
                setAnswers(formattedAnswers);
              }
              
              setShowResults(true);
            }}
            showGameButton={false}
            showDetailsButton={true}
            showQuizButton={true}
            textGame={false}
            textQuiz={true}
          />
        )}
      </div>
    </div>
  );
};

export default UserForm;