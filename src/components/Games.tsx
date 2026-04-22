import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import Icon from "@/components/ui/icon";

// ─────────────────────────────────────────────
// Shared helpers / constants
// ─────────────────────────────────────────────
const ACCENT = "#5865f2";

// ═══════════════════════════════════════════════════════════════════
// 1.  SNAKE GAME
// ═══════════════════════════════════════════════════════════════════
const GRID = 20;
const FOOD_EMOJIS = ["🍎", "🍊", "🍋", "🍇", "🍓", "🍕", "🍔"];

type Point = { x: number; y: number };
type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

function randomFood(snake: Point[]): { pos: Point; emoji: string } {
  let pos: Point;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return { pos, emoji: FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)] };
}

function calcSpeed(score: number): number {
  const level = Math.floor(score / 5);
  return Math.max(60, 150 - level * 15);
}

export function SnakeGame() {
  const initialSnake: Point[] = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];

  const [snake, setSnake] = useState<Point[]>(initialSnake);
  const [food, setFood] = useState<{ pos: Point; emoji: string }>(() =>
    randomFood(initialSnake)
  );
  const [, setDir] = useState<Dir>("RIGHT");
  const [, setNextDir] = useState<Dir>("RIGHT");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [dead, setDead] = useState(false);
  const [flash, setFlash] = useState(false);
  const [started, setStarted] = useState(false);

  const level = Math.floor(score / 5) + 1;
  const speed = calcSpeed(score);

  const dirRef = useRef<Dir>("RIGHT");
  const nextDirRef = useRef<Dir>("RIGHT");
  const snakeRef = useRef<Point[]>(initialSnake);
  const foodRef = useRef(food);
  const scoreRef = useRef(0);

  snakeRef.current = snake;
  foodRef.current = food;
  scoreRef.current = score;

  const changeDir = useCallback((d: Dir) => {
    const opposites: Record<Dir, Dir> = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };
    if (d !== opposites[dirRef.current]) {
      nextDirRef.current = d;
      setNextDir(d);
    }
  }, []);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!running) return;
      const map: Record<string, Dir> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        w: "UP",
        s: "DOWN",
        a: "LEFT",
        d: "RIGHT",
        W: "UP",
        S: "DOWN",
        A: "LEFT",
        D: "RIGHT",
      };
      if (map[e.key]) {
        e.preventDefault();
        changeDir(map[e.key]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [running, changeDir]);

  // Game loop
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      const currentSnake = snakeRef.current;
      const currentFood = foodRef.current;
      const currentScore = scoreRef.current;

      dirRef.current = nextDirRef.current;
      const head = currentSnake[0];
      const deltas: Record<Dir, Point> = {
        UP: { x: 0, y: -1 },
        DOWN: { x: 0, y: 1 },
        LEFT: { x: -1, y: 0 },
        RIGHT: { x: 1, y: 0 },
      };
      const d = deltas[dirRef.current];
      const newHead: Point = { x: head.x + d.x, y: head.y + d.y };

      // Wall or self collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID ||
        newHead.y < 0 ||
        newHead.y >= GRID ||
        currentSnake.some((s) => s.x === newHead.x && s.y === newHead.y)
      ) {
        setRunning(false);
        setDead(true);
        setFlash(true);
        setHighScore((hs) => Math.max(hs, currentScore));
        setTimeout(() => setFlash(false), 600);
        clearInterval(interval);
        return;
      }

      const ate =
        newHead.x === currentFood.pos.x && newHead.y === currentFood.pos.y;
      const newSnake = [newHead, ...currentSnake];
      if (!ate) newSnake.pop();

      setSnake(newSnake);
      if (ate) {
        const ns = currentScore + 1;
        setScore(ns);
        setFood(randomFood(newSnake));
      }
    }, speed);

    return () => clearInterval(interval);
  }, [running, speed]);

  function startGame() {
    const init: Point[] = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    setSnake(init);
    setFood(randomFood(init));
    setDir("RIGHT");
    setNextDir("RIGHT");
    dirRef.current = "RIGHT";
    nextDirRef.current = "RIGHT";
    setScore(0);
    setDead(false);
    setFlash(false);
    setRunning(true);
    setStarted(true);
  }

  // Body colour gradient based on position in snake array
  function cellColor(idx: number): string {
    if (idx === 0) return "#7ee8a2"; // head
    const ratio = idx / (snake.length - 1 || 1);
    // green → teal gradient
    const r = Math.round(88 - ratio * 30);
    const g = Math.round(214 - ratio * 80);
    const b = Math.round(140 + ratio * 60);
    return `rgb(${r},${g},${b})`;
  }

  return (
    <div
      className="flex flex-col items-center gap-4 select-none"
      style={{ fontFamily: "monospace" }}
    >
      {/* Header */}
      <div className="flex items-center gap-6 text-sm font-bold">
        <span style={{ color: ACCENT }}>LVL {level}</span>
        <span className="text-white">SCORE: {score}</span>
        <span className="text-yellow-400">BEST: {highScore}</span>
        <span style={{ color: "#aaa" }}>⚡{speed}ms</span>
      </div>

      {/* Grid */}
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: `repeat(${GRID}, 20px)`,
          gridTemplateRows: `repeat(${GRID}, 20px)`,
          gap: "1px",
          backgroundColor: "#1e2124",
          border: flash ? "3px solid #ff4444" : "3px solid #2c2f33",
          borderRadius: 8,
          transition: "border-color 0.1s",
          boxShadow: flash ? "0 0 30px #ff444488" : "none",
        }}
      >
        {Array.from({ length: GRID * GRID }, (_, i) => {
          const x = i % GRID;
          const y = Math.floor(i / GRID);
          const key = `${x},${y}`;
          const snakeIdx = snake.findIndex((s) => s.x === x && s.y === y);
          const isSnake = snakeIdx !== -1;
          const isFood = food.pos.x === x && food.pos.y === y;

          return (
            <div
              key={key}
              style={{
                width: 20,
                height: 20,
                backgroundColor: isSnake ? cellColor(snakeIdx) : "#23272a",
                borderRadius: isSnake ? (snakeIdx === 0 ? 5 : 3) : 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isFood ? 13 : 10,
                boxShadow:
                  snakeIdx === 0 ? "0 0 8px #7ee8a2aa" : undefined,
                transition: "background-color 0.05s",
              }}
            >
              {isFood ? food.emoji : ""}
            </div>
          );
        })}

        {/* Overlay when not running */}
        {!running && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.75)",
              borderRadius: 5,
              gap: 12,
            }}
          >
            {dead && (
              <>
                <span style={{ fontSize: 32 }}>💀</span>
                <span style={{ color: "#ff4444", fontWeight: 700, fontSize: 18 }}>
                  GAME OVER
                </span>
                <span style={{ color: "#aaa", fontSize: 13 }}>
                  Score: {score} | Best: {highScore}
                </span>
              </>
            )}
            {!dead && started && (
              <span style={{ color: "#aaa", fontSize: 14 }}>PAUSED</span>
            )}
            <button
              onClick={startGame}
              style={{
                backgroundColor: ACCENT,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 24px",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {dead || !started ? "START" : "RESTART"}
            </button>
          </div>
        )}
      </div>

      {/* Mobile controls */}
      <div className="flex flex-col items-center gap-1">
        <button
          onPointerDown={() => changeDir("UP")}
          style={mobileBtn}
          aria-label="Up"
        >
          <Icon name="ChevronUp" size={20} />
        </button>
        <div className="flex gap-1">
          <button
            onPointerDown={() => changeDir("LEFT")}
            style={mobileBtn}
            aria-label="Left"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
          <button
            onPointerDown={() => changeDir("DOWN")}
            style={mobileBtn}
            aria-label="Down"
          >
            <Icon name="ChevronDown" size={20} />
          </button>
          <button
            onPointerDown={() => changeDir("RIGHT")}
            style={mobileBtn}
            aria-label="Right"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>
      </div>

      <p style={{ color: "#555", fontSize: 11 }}>
        Keyboard: Arrow keys or WASD
      </p>
    </div>
  );
}

const mobileBtn: React.CSSProperties = {
  width: 44,
  height: 44,
  backgroundColor: "#2c2f33",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: 20,
};

// ═══════════════════════════════════════════════════════════════════
// 2.  TIC-TAC-TOE
// ═══════════════════════════════════════════════════════════════════
type Cell = "X" | "O" | null;
type Mode = "friend" | "ai" | null;

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(board: Cell[]): { winner: Cell; line: number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
}

function minimax(
  board: Cell[],
  isMaximising: boolean,
  depth: number
): number {
  const result = checkWinner(board);
  if (result?.winner === "O") return 10 - depth;
  if (result?.winner === "X") return depth - 10;
  if (board.every((c) => c !== null)) return 0;

  if (isMaximising) {
    let best = -Infinity;
    board.forEach((cell, i) => {
      if (!cell) {
        board[i] = "O";
        best = Math.max(best, minimax(board, false, depth + 1));
        board[i] = null;
      }
    });
    return best;
  } else {
    let best = Infinity;
    board.forEach((cell, i) => {
      if (!cell) {
        board[i] = "X";
        best = Math.min(best, minimax(board, true, depth + 1));
        board[i] = null;
      }
    });
    return best;
  }
}

function bestMove(board: Cell[]): number {
  let best = -Infinity;
  let move = -1;
  board.forEach((cell, i) => {
    if (!cell) {
      board[i] = "O";
      const val = minimax(board, false, 0);
      board[i] = null;
      if (val > best) {
        best = val;
        move = i;
      }
    }
  });
  return move;
}

export function TicTacToe() {
  const [mode, setMode] = useState<Mode>(null);
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [winResult, setWinResult] = useState<{
    winner: Cell;
    line: number[];
  } | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [animCells, setAnimCells] = useState<Set<number>>(new Set());
  const [aiThinking, setAiThinking] = useState(false);

  function resetBoard() {
    setBoard(Array(9).fill(null));
    setTurn("X");
    setWinResult(null);
    setIsDraw(false);
    setAnimCells(new Set());
  }

  function handleCell(idx: number) {
    if (board[idx] || winResult || isDraw || aiThinking) return;
    if (mode === "ai" && turn === "O") return;

    const newBoard = [...board];
    newBoard[idx] = turn;
    setAnimCells((prev) => new Set(prev).add(idx));

    const result = checkWinner(newBoard);
    setBoard(newBoard);

    if (result) {
      setWinResult(result);
      setScores((s) => ({ ...s, [result.winner!]: s[result.winner!] + 1 }));
      return;
    }
    if (newBoard.every((c) => c !== null)) {
      setIsDraw(true);
      setScores((s) => ({ ...s, draw: s.draw + 1 }));
      return;
    }

    const nextTurn = turn === "X" ? "O" : "X";
    setTurn(nextTurn);

    if (mode === "ai" && nextTurn === "O") {
      setAiThinking(true);
      setTimeout(() => {
        const copy = [...newBoard];
        const move = bestMove(copy);
        if (move === -1) return;
        copy[move] = "O";
        setAnimCells((prev) => new Set(prev).add(move));
        const aiResult = checkWinner(copy);
        setBoard(copy);
        if (aiResult) {
          setWinResult(aiResult);
          setScores((s) => ({
            ...s,
            [aiResult.winner!]: s[aiResult.winner!] + 1,
          }));
        } else if (copy.every((c) => c !== null)) {
          setIsDraw(true);
          setScores((s) => ({ ...s, draw: s.draw + 1 }));
        } else {
          setTurn("X");
        }
        setAiThinking(false);
      }, 400);
    }
  }

  if (!mode) {
    return (
      <div className="flex flex-col items-center gap-6 py-6">
        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>
          Крестики-нолики
        </h2>
        <p style={{ color: "#aaa" }}>Выбери режим игры</p>
        <div className="flex gap-4">
          <button
            onClick={() => { setMode("friend"); resetBoard(); }}
            style={ttBtn}
          >
            <Icon name="Users" size={18} />
            <span>С другом</span>
          </button>
          <button
            onClick={() => { setMode("ai"); resetBoard(); }}
            style={ttBtn}
          >
            <Icon name="Bot" size={18} />
            <span>Против ИИ</span>
          </button>
        </div>
      </div>
    );
  }

  const gameOver = !!(winResult || isDraw);
  const status = winResult
    ? `Победил ${winResult.winner}! ${winResult.winner === "X" ? "❌" : "⭕"}`
    : isDraw
    ? "Ничья! 🤝"
    : aiThinking
    ? "ИИ думает..."
    : `Ход: ${turn} ${turn === "X" ? "❌" : "⭕"}`;

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Score bar */}
      <div className="flex items-center gap-6 text-sm font-bold">
        <span style={{ color: "#e74c3c" }}>❌ X: {scores.X}</span>
        <span style={{ color: "#aaa" }}>Ничья: {scores.draw}</span>
        <span style={{ color: "#3498db" }}>O: {scores.O} ⭕</span>
      </div>

      {/* Status */}
      <div
        style={{
          color: winResult ? "#7ee8a2" : isDraw ? "#f1c40f" : "#ccc",
          fontWeight: 600,
          fontSize: 16,
          minHeight: 24,
        }}
      >
        {status}
      </div>

      {/* Board */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 90px)",
          gridTemplateRows: "repeat(3, 90px)",
          gap: 6,
        }}
      >
        {board.map((cell, idx) => {
          const isWinCell = winResult?.line.includes(idx);
          const isAnim = animCells.has(idx);
          return (
            <div
              key={idx}
              onClick={() => handleCell(idx)}
              style={{
                width: 90,
                height: 90,
                backgroundColor: isWinCell ? "#2d4a2d" : "#2c2f33",
                border: isWinCell
                  ? `2px solid #7ee8a2`
                  : `2px solid #3d4043`,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: !cell && !gameOver ? "pointer" : "default",
                fontSize: 40,
                fontWeight: 900,
                color:
                  cell === "X"
                    ? "#e74c3c"
                    : cell === "O"
                    ? "#3498db"
                    : "transparent",
                transform: isAnim ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.15s ease, background-color 0.2s",
                boxShadow: isWinCell ? "0 0 16px #7ee8a255" : undefined,
              }}
            >
              {cell}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button onClick={resetBoard} style={ttSmallBtn}>
          <Icon name="RotateCcw" size={14} />
          Ещё раз
        </button>
        <button
          onClick={() => { setMode(null); resetBoard(); }}
          style={ttSmallBtn}
        >
          <Icon name="ArrowLeft" size={14} />
          Меню
        </button>
      </div>

      <p style={{ color: "#555", fontSize: 12 }}>
        {mode === "ai" ? "Ты играешь за X, ИИ за O" : "Два игрока на одном устройстве"}
      </p>
    </div>
  );
}

const ttBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 22px",
  backgroundColor: ACCENT,
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
};

const ttSmallBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "7px 16px",
  backgroundColor: "#2c2f33",
  color: "#ccc",
  border: "none",
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
};

// ═══════════════════════════════════════════════════════════════════
// 3.  QUIZ GAME
// ═══════════════════════════════════════════════════════════════════
interface Question {
  category: string;
  question: string;
  options: string[];
  correct: number;
}

const QUESTIONS: Question[] = [
  {
    category: "🔬 Наука",
    question: "Какой химический элемент обозначается символом Au?",
    options: ["Серебро", "Золото", "Алюминий", "Аргон"],
    correct: 1,
  },
  {
    category: "🏛️ История",
    question: "В каком году началась Вторая мировая война?",
    options: ["1935", "1937", "1939", "1941"],
    correct: 2,
  },
  {
    category: "🎬 Поп-культура",
    question: "Как зовут главного героя игры The Legend of Zelda?",
    options: ["Зельда", "Ганон", "Линк", "Мидна"],
    correct: 2,
  },
  {
    category: "⚽ Спорт",
    question: "Сколько игроков в команде по баскетболу (на площадке)?",
    options: ["4", "5", "6", "7"],
    correct: 1,
  },
  {
    category: "🔬 Наука",
    question: "Какая планета является самой большой в Солнечной системе?",
    options: ["Сатурн", "Нептун", "Уран", "Юпитер"],
    correct: 3,
  },
  {
    category: "🏛️ История",
    question: "Кто был первым президентом США?",
    options: ["Томас Джефферсон", "Джон Адамс", "Джордж Вашингтон", "Авраам Линкольн"],
    correct: 2,
  },
  {
    category: "🎬 Поп-культура",
    question: "В каком году вышел первый фильм «Мстители» от Marvel?",
    options: ["2010", "2012", "2014", "2016"],
    correct: 1,
  },
  {
    category: "⚽ Спорт",
    question: "В какой стране прошли летние Олимпийские игры 2020?",
    options: ["Китай", "Франция", "Япония", "Бразилия"],
    correct: 2,
  },
  {
    category: "🔬 Наука",
    question: "Что измеряет сейсмограф?",
    options: ["Температуру", "Давление", "Землетрясения", "Влажность"],
    correct: 2,
  },
  {
    category: "🏛️ История",
    question: "Как называлась столица Древней Руси?",
    options: ["Москва", "Киев", "Новгород", "Владимир"],
    correct: 1,
  },
];

const TIMER_SECONDS = 15;

function getGrade(correct: number, total: number): { label: string; color: string } {
  const pct = correct / total;
  if (pct === 1) return { label: "Гениально! 🏆", color: "#f1c40f" };
  if (pct >= 0.8) return { label: "Отлично! 🌟", color: "#7ee8a2" };
  if (pct >= 0.6) return { label: "Хорошо! 👍", color: "#3498db" };
  if (pct >= 0.4) return { label: "Неплохо 🙂", color: "#e67e22" };
  return { label: "Попробуй ещё раз 😅", color: "#e74c3c" };
}

export function QuizGame() {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timedOut, setTimedOut] = useState(false);
  const [started, setStarted] = useState(false);

  const q = QUESTIONS[qIdx];
  const answered = selected !== null || timedOut;

  // Timer
  useEffect(() => {
    if (!started || finished || answered) return;
    if (timeLeft <= 0) {
      setTimedOut(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [started, finished, answered, timeLeft]);

  function handleAnswer(idx: number) {
    if (answered) return;
    setSelected(idx);
    if (idx === q.correct) setCorrectCount((v) => v + 1);
  }

  function handleNext() {
    if (qIdx + 1 >= QUESTIONS.length) {
      setFinished(true);
    } else {
      setQIdx((v) => v + 1);
      setSelected(null);
      setTimedOut(false);
      setTimeLeft(TIMER_SECONDS);
    }
  }

  function restart() {
    setQIdx(0);
    setSelected(null);
    setCorrectCount(0);
    setFinished(false);
    setTimeLeft(TIMER_SECONDS);
    setTimedOut(false);
    setStarted(true);
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-6 py-6">
        <div style={{ fontSize: 48 }}>🧠</div>
        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>
          Викторина
        </h2>
        <p style={{ color: "#aaa", textAlign: "center", maxWidth: 320 }}>
          10 вопросов на разные темы. 15 секунд на каждый вопрос.
        </p>
        <button onClick={() => setStarted(true)} style={qzBtn}>
          <Icon name="Play" size={18} />
          Начать
        </button>
      </div>
    );
  }

  if (finished) {
    const grade = getGrade(correctCount, QUESTIONS.length);
    return (
      <div className="flex flex-col items-center gap-5 py-6">
        <div style={{ fontSize: 52 }}>🎉</div>
        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>
          Викторина завершена!
        </h2>
        <div
          style={{
            backgroundColor: "#2c2f33",
            borderRadius: 16,
            padding: "20px 40px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 42, fontWeight: 900, color: grade.color }}>
            {correctCount}/{QUESTIONS.length}
          </span>
          <span style={{ fontSize: 18, color: grade.color, fontWeight: 700 }}>
            {grade.label}
          </span>
          <span style={{ color: "#888", fontSize: 13 }}>
            Правильных ответов: {correctCount} из {QUESTIONS.length}
          </span>
        </div>

        {/* Mini breakdown */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 360,
          }}
        >
          {Array.from({ length: QUESTIONS.length }, (_, i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor:
                  i < correctCount ? "#7ee8a2" : "#e74c3c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: "#fff",
                fontWeight: 700,
              }}
            >
              {i < correctCount ? "✓" : "✗"}
            </div>
          ))}
        </div>

        <button onClick={restart} style={qzBtn}>
          <Icon name="RotateCcw" size={18} />
          Пройти снова
        </button>
      </div>
    );
  }

  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor =
    timeLeft > 8 ? "#7ee8a2" : timeLeft > 4 ? "#f1c40f" : "#e74c3c";

  return (
    <div className="flex flex-col gap-4" style={{ maxWidth: 480, margin: "0 auto" }}>
      {/* Progress header */}
      <div className="flex items-center justify-between">
        <span style={{ color: "#aaa", fontSize: 13 }}>
          {q.category}
        </span>
        <span style={{ color: "#aaa", fontSize: 13 }}>
          {qIdx + 1} / {QUESTIONS.length}
        </span>
      </div>

      {/* Question progress bar */}
      <div
        style={{
          height: 4,
          backgroundColor: "#2c2f33",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${((qIdx + 1) / QUESTIONS.length) * 100}%`,
            height: "100%",
            backgroundColor: ACCENT,
            transition: "width 0.3s",
          }}
        />
      </div>

      {/* Timer */}
      <div className="flex items-center gap-3">
        <Icon name="Clock" size={16} color={timerColor} />
        <div
          style={{
            flex: 1,
            height: 8,
            backgroundColor: "#2c2f33",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${timerPct}%`,
              height: "100%",
              backgroundColor: timerColor,
              transition: answered ? "none" : "width 1s linear",
            }}
          />
        </div>
        <span
          style={{
            color: timerColor,
            fontSize: 13,
            fontWeight: 700,
            minWidth: 24,
            textAlign: "right",
          }}
        >
          {timedOut ? "0" : timeLeft}
        </span>
      </div>

      {/* Question text */}
      <div
        style={{
          backgroundColor: "#2c2f33",
          borderRadius: 12,
          padding: "16px 20px",
          color: "#fff",
          fontSize: 16,
          fontWeight: 600,
          lineHeight: 1.5,
        }}
      >
        {q.question}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {q.options.map((opt, idx) => {
          let bg = "#23272a";
          let border = "2px solid #3d4043";
          let color = "#ccc";

          if (answered) {
            if (idx === q.correct) {
              bg = "#1a3a1a";
              border = "2px solid #7ee8a2";
              color = "#7ee8a2";
            } else if (idx === selected && idx !== q.correct) {
              bg = "#3a1a1a";
              border = "2px solid #e74c3c";
              color = "#e74c3c";
            }
          } else if (!timedOut) {
            // hover handled via inline — no hover state in inline styles,
            // keep it simple
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={answered}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                backgroundColor: bg,
                border,
                borderRadius: 10,
                color,
                fontSize: 14,
                fontWeight: 500,
                cursor: answered ? "default" : "pointer",
                textAlign: "left",
                transition: "background-color 0.2s, border-color 0.2s",
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  backgroundColor:
                    answered && idx === q.correct
                      ? "#7ee8a2"
                      : answered && idx === selected
                      ? "#e74c3c"
                      : "#3d4043",
                  color:
                    answered && (idx === q.correct || idx === selected)
                      ? "#fff"
                      : "#aaa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 12,
                  flexShrink: 0,
                }}
              >
                {["A", "B", "C", "D"][idx]}
              </span>
              {opt}
              {answered && idx === q.correct && (
                <Icon name="Check" size={16} color="#7ee8a2" style={{ marginLeft: "auto" }} />
              )}
              {answered && idx === selected && idx !== q.correct && (
                <Icon name="X" size={16} color="#e74c3c" style={{ marginLeft: "auto" }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Timeout message */}
      {timedOut && !selected && (
        <div
          style={{
            color: "#f1c40f",
            textAlign: "center",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Время вышло! ⏰ Правильный ответ: {q.options[q.correct]}
        </div>
      )}

      {/* Next button */}
      {answered && (
        <button
          onClick={handleNext}
          style={{
            ...qzBtn,
            alignSelf: "center",
            marginTop: 4,
          }}
        >
          {qIdx + 1 >= QUESTIONS.length ? (
            <>
              <Icon name="Trophy" size={18} />
              Результаты
            </>
          ) : (
            <>
              Следующий вопрос
              <Icon name="ChevronRight" size={18} />
            </>
          )}
        </button>
      )}
    </div>
  );
}

const qzBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 24px",
  backgroundColor: ACCENT,
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
};