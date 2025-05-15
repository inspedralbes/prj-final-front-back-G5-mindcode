"use client";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "stores/authStore";
import Button from "../atoms/Button";

const QuizList = ({ quizzes, handleQuizSelect, handleGameSelect, userData, onViewResults, showGameButton = true, showDetailsButton = true, textGame = true, textQuiz = true, showQuizButton = true }) => {
  const class_info = useAuthStore((state) => state.class_info);

  const isQuizAnswered = (quiz_id) => {
    if (!class_info?.[0]?.quizz_info) return false;
    const quizInfo = class_info[0].quizz_info.find(
      (quiz) => quiz._id === quiz_id
    );
    return quizInfo?.questions?.[0]?.isAnswered || false;
  };

  const getQuizResult = (quiz) => {
    if (!quiz) return null;
    return {
      correctAnswers: quiz.correctAnswers,
      totalQuestions: quiz.totalQuestions
    };
  };

    const hasPlayedGameThisSession = (quiz_id) => {
    return sessionStorage.getItem(`played_${quiz_id}`) === 'true';
  };

    const markQuizAsPlayed = (quiz_id) => {
    sessionStorage.setItem(`played_${quiz_id}`, 'true');
  };

    const hasPlayedGame = (quiz_id) => {
    if (!class_info?.[0]?.quizz_info) return false;
    const quizInfo = class_info[0].quizz_info.find(
      (quiz) => quiz._id === quiz_id
    );
    const alreadyPlayed = quizInfo?.userAnswers?.length > 0;
    const sessionPlayed = hasPlayedGameThisSession(quiz_id);
    return alreadyPlayed || sessionPlayed;
  };



  return (
    <div className="p-4">
      {textQuiz && (
      <h1 className="text-2xl font-bold mb-4">Llistat de qüestionaris</h1>
      )}
      {textGame && (
      <h1 className="text-2xl font-bold mb-4">Llistat de qüestionaris per jugar</h1>
      )}
      {quizzes?.length > 0 ? (
        <ul className="space-y-4">
          {quizzes.map((quiz) => {
            const isAnswered = isQuizAnswered(quiz.id);
            const result = getQuizResult(quiz);

            return (
              <li
                key={quiz.id}
                className={`p-4 rounded-md shadow ${isAnswered ? 'bg-green-50 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'}`}
              >
                <h2 className="text-lg font-semibold">Qüestionari {quiz.id}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total preguntes: {quiz.totalQuestions}
                </p>
                {isAnswered ? (
                <div className="mt-2">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Resultat: {result.correctAnswers} de {result.totalQuestions} correctes
                    ({Math.round((result.correctAnswers / result.totalQuestions) * 100)}%)
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{
                        width: `${Math.round(
                          (result.correctAnswers / result.totalQuestions) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  {showDetailsButton && (
                  <Button
                    onClick={() => onViewResults(quiz)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Veure detalls
                  </Button>
              )}
                  {showGameButton && (
                    <Button
                      onClick={() => {
                        if (!hasPlayedGame(quiz.id)) {
                          markQuizAsPlayed(quiz.id);
                          handleGameSelect(quiz.quizId);
                        }
                      }}
                      disabled={hasPlayedGame(quiz.id)}
                      className={`mt-2 px-4 py-2 ${
                        hasPlayedGame(quiz.id)
                          ? 'bg-red-400 cursor-not-allowed'
                          : 'bg-green-300 hover:bg-green-400'
                      } text-white rounded-md transition-colors`}
                    >
                      {hasPlayedGame(quiz.id) ? 'Joc completat' : 'Començar joc'}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                {showQuizButton && (
                <Button
                  onClick={() => handleQuizSelect(quiz.quizId)}
                  className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                >
                  Començar
                </Button>
                )}
                </div>
              )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No hi ha qüestionaris disponibles.</p>
      )}
    </div>
  );
};

export default QuizList;