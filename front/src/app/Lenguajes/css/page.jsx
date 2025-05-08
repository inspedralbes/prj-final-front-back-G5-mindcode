"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Button from "../../components/atoms/Button";

const CSSPage = () => {
  const router = useRouter();
  const canvasRef = useRef(null);
  const bgCanvasRef = useRef(null);

  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [usedQuestions, setUsedQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);

  const gridSize = 18;
  const gameRef = useRef({
    snake: [{ x: 5, y: 5 }],
    direction: 'right',
    foods: [],
    speed: 150,
    gameLoop: null,
    bgAnimationId: null,
    canvasContext: null,
    canvasWidth: 0,
    canvasHeight: 0,
    gameActive: false
  });

  const particles = useRef([]);
  const particleCount = 60;

  const initParticles = () => {
    particles.current = [];
    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.3 - 0.15,
        speedY: Math.random() * 0.3 - 0.15,
        color: `rgba(56, 182, 255, ${Math.random() * 0.3 + 0.1})`
      });
    }
  };

  const animateParticles = () => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.current.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      
      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    gameRef.current.bgAnimationId = requestAnimationFrame(animateParticles);
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/LanguageQuizes/CssQuiz.json");
      const data = await res.json();
      setQuizQuestions(data.questions);
      setQuestionsLoaded(true);
      return data.questions;
    } catch (err) {
      console.error("Failed to fetch quiz questions", err);
      setMessage("\u26A0\uFE0F Could not load quiz questions.");
      return [];
    }
  };

  const isPositionOccupied = (x, y) => {
    return gameRef.current.snake.some(segment => segment.x === x && segment.y === y);
  };

  const placeFood = () => {
    const game = gameRef.current;
  
    if (!quizQuestions || quizQuestions.length === 0) {
      setMessage("\u26A0\uFE0F No quiz questions available.");
      return;
    }
  
    if (usedQuestions.length >= quizQuestions.length) {
      setUsedQuestions([]);
    }
  
    const availableQuestions = quizQuestions.filter((_, index) => !usedQuestions.includes(index));
  
    if (availableQuestions.length === 0) {
      setMessage("\u26A0\uFE0F No more questions available.");
      return;
    }
  
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    const questionIndex = quizQuestions.findIndex(q => q === selectedQuestion);
  
    setUsedQuestions(prev => [...prev, questionIndex]);
    setCurrentQuestion(selectedQuestion);
    setQuestionsCompleted(prev => prev + 1);
  
    const maxX = Math.floor(game.canvasWidth / gridSize) - 1;
    const maxY = Math.floor(game.canvasHeight / gridSize) - 1;
  
    const foodColors = ['#3b82f6', '#6366f1', '#8b5cf6'];
    const foods = selectedQuestion.options.map((option, index) => {
      let x, y;
      do {
        x = Math.floor(Math.random() * maxX);
        y = Math.floor(Math.random() * maxY);
      } while (
        isPositionOccupied(x, y) ||
        game.foods.some(f => f.x === x && f.y === y)
      );
  
      return {
        x,
        y,
        value: option,
        color: foodColors[index % foodColors.length],
        isCorrect: index === selectedQuestion.correct_option - 1
      };
    });
  
    game.foods = foods;
  };

  const initializeGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const game = gameRef.current;

    canvas.width = 600; 
    canvas.height = 400;

    game.canvasContext = context;
    game.canvasWidth = canvas.width;
    game.canvasHeight = canvas.height;
    game.snake = [{ x: 5, y: 5 }];
    game.direction = 'right';
    game.speed = 150;
    game.gameActive = true;

    placeFood();

    clearInterval(game.gameLoop);
    game.gameLoop = setInterval(gameUpdate, game.speed);

    setGameStarted(true);
    setGameOver(false);
    setMessage("Pick the correct answer!");
  };

  const gameUpdate = () => {
    const game = gameRef.current;
    if (!game.gameActive) return;

    const head = { ...game.snake[0] };
    switch (game.direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }

    if (
      head.x < 0 || head.y < 0 ||
      head.x >= Math.floor(game.canvasWidth / gridSize) ||
      head.y >= Math.floor(game.canvasHeight / gridSize) ||
      game.snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      endGame();
      return;
    }

    game.snake.unshift(head);
    let ate = false;

    for (let i = 0; i < game.foods.length; i++) {
      const food = game.foods[i];
      if (head.x === food.x && head.y === food.y) {
        if (food.isCorrect) {
          setScore(prev => prev + 10);
          setMessage(`✅ +10 points`);
        } else {
          setScore(prev => Math.max(0, prev - 10));
          setMessage(`❌ -10 points`);
        }
        placeFood();
        ate = true;
        break;
      }
    }

    if (!ate) game.snake.pop();
    drawGame();
  };

  const drawGame = () => {
    const game = gameRef.current;
    const ctx = game.canvasContext;
    if (!ctx) return;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, game.canvasWidth, game.canvasHeight);

    ctx.strokeStyle = 'rgba(100, 130, 200, 0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < game.canvasWidth; i += gridSize) {
      ctx.beginPath(); 
      ctx.moveTo(i, 0); 
      ctx.lineTo(i, game.canvasHeight); 
      ctx.stroke();
    }
    for (let i = 0; i < game.canvasHeight; i += gridSize) {
      ctx.beginPath(); 
      ctx.moveTo(0, i); 
      ctx.lineTo(game.canvasWidth, i); 
      ctx.stroke();
    }

  
    game.snake.forEach((segment, index) => {
      const x = segment.x * gridSize;
      const y = segment.y * gridSize;
      
      if (index === 0) {
        ctx.fillStyle = 'rgba(96, 165, 250, 0.3)';
        ctx.beginPath();
        ctx.arc(x + gridSize/2, y + gridSize/2, gridSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.fillStyle = index === 0 ? '#60a5fa' : '#3b82f6';
      ctx.beginPath();
      ctx.roundRect(x, y, gridSize - 1, gridSize - 1, [4]);
      ctx.fill();
    });

    game.foods.forEach(food => {
      const x = food.x * gridSize;
      const y = food.y * gridSize;
      
      ctx.fillStyle = `${food.color}30`;
      ctx.beginPath();
      ctx.arc(x + gridSize/2, y + gridSize/2, gridSize * 1.2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = food.color;
      ctx.beginPath();
      ctx.roundRect(
        x - gridSize * 0.1,  
        y - gridSize * 0.1,  
        gridSize * 1.2 - 1,  
        gridSize * 1.2 - 1,  
        [8]  
      );
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 15px Arial';  
      ctx.textAlign = 'center';
      
      const maxCharsPerLine = 10;  
      
      if (food.value.length > maxCharsPerLine) {
        const words = food.value.split(' ');
        let lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
          if (currentLine.length + words[i].length + 1 <= maxCharsPerLine) {
            currentLine += ' ' + words[i];
          } else {
            lines.push(currentLine);
            currentLine = words[i];
          }
        }
        lines.push(currentLine);
        
        lines.forEach((line, i) => {
          ctx.fillText(
            line, 
            x + gridSize/2, 
            y + gridSize/2 - (lines.length - 1) * 6 + i * 12  
          );
        });
      } else {
        ctx.fillText(
          food.value, 
          x + gridSize/2, 
          y + gridSize/2 + 5  
        );
      }
    });
  };

  const endGame = () => {
    const game = gameRef.current;
    clearInterval(game.gameLoop);
    game.gameActive = false;
    setGameOver(true);
    
    const allQuestionsUsed = usedQuestions.length >= quizQuestions.length && quizQuestions.length > 0;
    
    setMessage(allQuestionsUsed 
      ? `🏁 Completed all questions! Final Score: ${score}`
      : `🏁 Final Score: ${score}`);
  };

  const startGame = async () => {
    setScore(0);
    setUsedQuestions([]); 
    setQuestionsCompleted(0);
    setGameOver(false);
    setGameStarted(true);
    
    if (!questionsLoaded) {
      await fetchQuestions();
    }
  
    if (quizQuestions.length > 0) {
      initializeGame();
    } else {
      setMessage("\u26A0\uFE0F No questions available");
      setGameStarted(false);
    }
  };

  const handleKeyDown = (e) => {
    const game = gameRef.current;
    if (!game.gameActive) return;

    if ([37, 38, 39, 40].includes(e.keyCode)) e.preventDefault();

    switch (e.keyCode) {
      case 38: if (game.direction !== 'down') game.direction = 'up'; break;
      case 40: if (game.direction !== 'up') game.direction = 'down'; break;
      case 37: if (game.direction !== 'right') game.direction = 'left'; break;
      case 39: if (game.direction !== 'left') game.direction = 'right'; break;
    }
  };

  useEffect(() => {
    fetchQuestions();
    initParticles();
    animateParticles();

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      const game = gameRef.current;
      clearInterval(game.gameLoop);
      cancelAnimationFrame(game.bgAnimationId);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (bgCanvasRef.current) {
        bgCanvasRef.current.width = window.innerWidth;
        bgCanvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <canvas 
        ref={bgCanvasRef} 
        className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-gray-900 to-blue-900"
      />
      
      <div className="relative z-10 p-4 flex flex-col items-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
              🐍 CSS Snake
            </h1>
          </div>

          <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-700">
          <div className="mb-4 flex justify-between items-center space-x-2">
          <div className="px-3 py-2 bg-blue-600 text-white text-sm font-bold rounded-md shadow border border-blue-400">
          🏆 {score}
          </div>

          <div className="px-3 py-2 bg-green-600 text-white text-sm font-bold rounded-md shadow border border-green-400">
        ❓ {questionsCompleted}
        </div>
      </div>
          <div className="mb-3 text-center text-sm font-medium bg-gray-700/70 p-2 rounded-md border border-gray-600 text-white">
              {message}
            </div>
            {currentQuestion && (
              <div className="mb-3 p-3 bg-gray-700/70 rounded-md border border-gray-600">
                <div className="font-semibold text-blue-300 mb-1 text-sm">
                  {currentQuestion.question_text}
                </div>
              </div>
            )}

          

            <div className="relative rounded-lg overflow-hidden border border-gray-600 shadow-lg">
              {!gameStarted && !gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                  <div className="text-center bg-gray-800/90 p-4 rounded-lg border border-gray-600">
                    <h2 className="text-xl font-bold mb-3 text-blue-300">
                      🐍 CSS Snake
                    </h2>
                    <Button
                      onClick={startGame}
                      className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow hover:from-green-600 hover:to-teal-600 transition-colors"
                    >
                      🎮 Start Game
                    </Button>
                  </div>
                </div>
              )}

              {gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                  <div className="text-center bg-gray-800/90 p-4 rounded-lg border border-gray-600">
                    <h2 className="text-xl font-bold mb-2 text-red-400">
                      Game Over!
                    </h2>
                    <p className="text-sm mb-3 text-white">Final Score: {score}</p>
                    <Button
                      onClick={startGame}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow hover:from-blue-600 hover:to-purple-600 transition-colors"
                    >
                      🔄 Play Again
                    </Button>
                  </div>
                </div>
              )}

              <canvas 
                ref={canvasRef} 
                className="w-full h-[400px] bg-gray-900/30"
              />
            </div>
          </div>

          <div className="text-center mt-4 max-w-xs mx-auto"> 
        <Button
          onClick={() => router.push("/Jocs")}
          className="bg-gradient-to-r from-red-500 to-purple-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow hover:from-blue-600 hover:to-red  -600 transition-colors"
          >
          ⬅️ Back to Menu
        </Button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CSSPage;