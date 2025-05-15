"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/organisms/Navbar";
import SidebarStudent from "../components/organisms/SidebarStudent";
import LoadingScreen from "../components/LoadingScreen";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/authStore";
import UserForm from "../components/UserForm"; 
import QuizList from '../components/molecules/QuizList';

const JocsPage = () => {
  const [questions, setQuestions] = useState([]); 
  const [answers, setAnswers] = useState({}); 
  const [error, setError] = useState(null); 
  const [results, setResults] = useState(null); 
  const [showResults, setShowResults] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const [quizList, setQuizList] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const userData = useAuthStore((state) => state);
  const classInfo = useAuthStore((state) => state.class_info);
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

  if (!classInfo || classInfo.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
        ⏳ Carregant informació de la classe...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      {loading && <LoadingScreen />}
      <SidebarStudent />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto p-6 overflow-y-auto">
          <QuizList 
            quizzes={quizList}
            handleQuizSelect={(quizId) => loadSelectedQuiz(quizId)}
            handleGameSelect={(quizId) => loadSelectedGame(quizId)}
            userData={userData}
            onViewResults={(quiz) => {
              setQuestions(quiz.questions);
              setQuizId(quiz.id);
              setSelectedQuiz(quiz);
              setShowResults(true);
            }}
            showGameButton={true}
            showDetailsButton={false}
            showQuizButton={false}
            textGame={true}
            textQuiz={false}
          />
        </div>
      </div>
      </div>
    </div>
  );
};

export default JocsPage;
