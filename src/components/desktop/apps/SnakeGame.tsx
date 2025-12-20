import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const GRID_SIZE = 20;
const CELL_SIZE = 15;
const INITIAL_SPEED = 150;

interface Position {
  x: number;
  y: number;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export function SnakeGame() {
  const isMobile = useIsMobile();
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-high-score');
    return saved ? parseInt(saved) : 0;
  });
  
  const directionRef = useRef<Direction>(direction);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    setIsPlaying(false);
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      const currentDirection = directionRef.current;

      switch (currentDirection) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snake-high-score', newScore.toString());
          }
          return newScore;
        });
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameOver, generateFood, highScore]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isPlaying && !gameOver && e.key === ' ') {
      setIsPlaying(true);
      return;
    }

    const keyDirections: Record<string, Direction> = {
      'ArrowUp': 'UP',
      'ArrowDown': 'DOWN',
      'ArrowLeft': 'LEFT',
      'ArrowRight': 'RIGHT',
      'w': 'UP',
      's': 'DOWN',
      'a': 'LEFT',
      'd': 'RIGHT',
      'W': 'UP',
      'S': 'DOWN',
      'A': 'LEFT',
      'D': 'RIGHT',
    };

    const newDirection = keyDirections[e.key];
    if (!newDirection) return;

    const opposites: Record<Direction, Direction> = {
      'UP': 'DOWN',
      'DOWN': 'UP',
      'LEFT': 'RIGHT',
      'RIGHT': 'LEFT',
    };

    if (opposites[newDirection] !== directionRef.current) {
      directionRef.current = newDirection;
      setDirection(newDirection);
    }
  }, [isPlaying, gameOver]);

  const handleDirectionButton = (newDirection: Direction) => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
    
    const opposites: Record<Direction, Direction> = {
      'UP': 'DOWN',
      'DOWN': 'UP',
      'LEFT': 'RIGHT',
      'RIGHT': 'LEFT',
    };

    if (opposites[newDirection] !== directionRef.current) {
      directionRef.current = newDirection;
      setDirection(newDirection);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED);
      return () => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      };
    }
  }, [isPlaying, gameOver, moveSnake]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-background p-4">
      {/* Score */}
      <div className="flex justify-between w-full max-w-[320px] mb-4">
        <div className="text-sm">
          <span className="text-muted-foreground">Score: </span>
          <span className="font-bold text-primary">{score}</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">High Score: </span>
          <span className="font-bold">{highScore}</span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative border-2 border-primary/30 rounded-lg bg-secondary/30"
        style={{ 
          width: GRID_SIZE * CELL_SIZE, 
          height: GRID_SIZE * CELL_SIZE 
        }}
      >
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={cn(
              "absolute rounded-sm transition-all duration-75",
              index === 0 ? "bg-primary" : "bg-primary/70"
            )}
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE - 1,
              height: CELL_SIZE - 1,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-destructive rounded-full animate-pulse"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE - 1,
            height: CELL_SIZE - 1,
          }}
        />

        {/* Overlay */}
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-4 rounded-lg">
            {gameOver ? (
              <>
                <p className="text-xl font-bold text-destructive">Game Over!</p>
                <p className="text-sm text-muted-foreground">Score: {score}</p>
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  <RotateCcw className="w-4 h-4" />
                  Play Again
                </button>
              </>
            ) : (
              <>
                <p className="text-lg font-medium">Snake Game</p>
                <button
                  onClick={() => setIsPlaying(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  <Play className="w-4 h-4" />
                  Start
                </button>
                <p className="text-xs text-muted-foreground">
                  {isMobile ? 'Use buttons below to move' : 'Use Arrow keys or WASD'}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      {isMobile && (
        <div className="mt-6 grid grid-cols-3 gap-2 w-[150px]">
          <div />
          <button
            onTouchStart={() => handleDirectionButton('UP')}
            onClick={() => handleDirectionButton('UP')}
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary text-primary-foreground active:scale-95"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
          <div />
          <button
            onTouchStart={() => handleDirectionButton('LEFT')}
            onClick={() => handleDirectionButton('LEFT')}
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary text-primary-foreground active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onTouchStart={() => handleDirectionButton('DOWN')}
            onClick={() => handleDirectionButton('DOWN')}
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary text-primary-foreground active:scale-95"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
          <button
            onTouchStart={() => handleDirectionButton('RIGHT')}
            onClick={() => handleDirectionButton('RIGHT')}
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary text-primary-foreground active:scale-95"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Desktop hint */}
      {!isMobile && isPlaying && !gameOver && (
        <p className="mt-4 text-xs text-muted-foreground">
          Use Arrow keys or WASD to control
        </p>
      )}
    </div>
  );
}
