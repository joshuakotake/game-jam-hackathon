import { useState, useEffect } from 'react';
import './App.css';
import EnergyBar from './bars/EnergyBar';
import HealthBar from './bars/HealthBar';
import ThirstBar from './bars/ThirstBar';
import HungerBar from './bars/HungerBar';
import { decrementBars, getHealthPenalty } from './functions/Update';
import StartModal from './modals/StartModal';
import { isDueDateValid, formatDueDate } from './utils/timeUtils';
import ResetModal from './modals/ResetModal'
import ProgressBar from './bars/ProgressBar';
import PauseModal from './modals/PauseModal';

function getInitialBars() {
  const stored = localStorage.getItem('barValues');
  if (stored) {
    try {
      const { energy, health, thirst, hunger } = JSON.parse(stored);
      if (
        typeof energy === 'number' &&
        typeof health === 'number' &&
        typeof thirst === 'number' &&
        typeof hunger === 'number'
      ) {
        return { energy, health, thirst, hunger };
      }
    } catch {
      console.log("Error getting inital bar")
    }
  }
  return { energy: 10, health: 10, thirst: 10, hunger: 10 };
}

function App() {
  // Game Status
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);

  // Status bars state
  const [energy, setEnergy] = useState(() => getInitialBars().energy);
  const [health, setHealth] = useState(() => getInitialBars().health);
  const [thirst, setThirst] = useState(() => getInitialBars().thirst);
  const [hunger, setHunger] = useState(() => getInitialBars().hunger);

  // Count down timer
  const [hasStoredDueDate, setHasStoredDueDate] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  // Start Game
  const [showStartModal, setShowStartModal] = useState(true)
  const [dueDateInput, setDueDateInput] = useState('')
  const [dateMissing, setDateMissing] = useState(false)
  const [dateInvalid, setDateInvalid] = useState(false)

  // Reset Modal
  const [showResetModal, setShowResetModal] = useState(false)

  // Load stored bar values
  useEffect(() => {
    const stored = localStorage.getItem('barValues');
    if (stored) {
      try {
        const { energy, health, thirst, hunger } = JSON.parse(stored);
        if (
          typeof energy === 'number' &&
          typeof health === 'number' &&
          typeof thirst === 'number' &&
          typeof hunger === 'number'
        ) {
          setEnergy(energy);
          setHealth(health);
          setThirst(thirst);
          setHunger(hunger);
        }
      } catch {
        console.log("Error getting local storage due date")
      }
    }
  }, []);

  // Save bar values to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      'barValues',
      JSON.stringify({ energy, health, thirst, hunger })
    );
  }, [energy, health, thirst, hunger]);

  // Load stored due date and set game as started if exists
  useEffect(() => {
    const storedDueDate = localStorage.getItem('dueDate');
    if (storedDueDate) {
      setHasStoredDueDate(true);
      setDueDateInput(storedDueDate);
      setShowStartModal(false);
      setGameStarted(true);
    }
  }, []);

  // Status bars effect - only runs when gameStarted is true
  useEffect(() => {
    if (!gameStarted || gamePaused) return;
    
    const interval = setInterval(() => {
      // Only decrement if not paused
      const newBars = gamePaused ? 
        { energy, thirst, hunger } : 
        decrementBars({ energy, thirst, hunger });
      
      setEnergy(newBars.energy);
      setThirst(newBars.thirst);
      setHunger(newBars.hunger);
  
      // Only apply penalty if not paused
      const penalty = gamePaused ? 0 : getHealthPenalty(newBars);
      if (penalty > 0) {
        setHealth(h => Math.max(h - penalty, 0));
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [energy, thirst, hunger, gameStarted, gamePaused]);

  // Countdown effect
  useEffect(() => {
    if (!hasStoredDueDate || !dueDateInput) return;
  
    const updateCountdown = () => {
      const now = new Date();
      const end = new Date(dueDateInput);
      const difference = end - now;
      setTimeLeft(difference > 0 ? difference : 0);
    };
    updateCountdown();
    
    const interval = setInterval(updateCountdown, 1000);
  
    return () => clearInterval(interval);
  }, [hasStoredDueDate, dueDateInput]);

  // Start Game
  const startGame = () => {
    setDateMissing(false);
    setDateInvalid(false);
  
    if (!dueDateInput.trim()) {
      setDateMissing(true);
      return;
    }
  
    if (!isDueDateValid(dueDateInput)) {
      setDateInvalid(true);
      return;
    }

    localStorage.setItem('dueDate', dueDateInput);
    setShowStartModal(false);
    setHasStoredDueDate(true);
    setGameStarted(true);
  };

  // Reset Game
  const resetGame = () => {
    localStorage.removeItem('dueDate')
    localStorage.removeItem('assignmentStartTime')
    setDueDateInput('')
    setHasStoredDueDate(false)
    setShowStartModal(true)
    setGameStarted(false);
    // Reset all bars to 10 and update localStorage
    setEnergy(10);
    setHealth(10);
    setThirst(10);
    setHunger(10);
    localStorage.setItem('barValues', JSON.stringify({ energy: 10, health: 10, thirst: 10, hunger: 10 }));
  };

  // Prevent closing of modal
  useEffect(() => {
    const preventEscape = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', preventEscape);
    return () => window.removeEventListener('keydown', preventEscape);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-800 max-w-4xl mx-auto">
      {/* Header */}
      <div className="min-h-20 mb-1 bg-gray-800 flex flex-col justify-center relative">
        <div className="px-4 text-center text-white">
          <h1 className="text-xl font-bold">StudyStride</h1>
          <div className="mt-1">
            <p className="text-sm">
              {hasStoredDueDate
                ? formatDueDate(dueDateInput)
                : 'No due date saved yet.'}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        {hasStoredDueDate && !showStartModal && (
          <div className="absolute top-1/2 transform -translate-y-1/2 flex justify-between w-full px-4">
            <button
              onClick={() => setGamePaused(true)}
              className="p-2 rounded-full hover:bg-gray-700 transition"
              title="Pause Game"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>
            <button
              onClick={() => setShowResetModal(true)}
              className="p-2 rounded-full hover:bg-gray-700 transition"
              title="Reset Game"
            >
              <svg className="w-5 h-5" viewBox="0 -0.5 9 9" shapeRendering="crispEdges">
                <path stroke="white" d="M0 0h1M3 0h3M0 1h1M2 1h1M6 1h1M0 2h2M7 2h1M0 3h4M8 3h1M8 4h1M0 5h1M8 5h1M1 6h1M7 6h1M2 7h1M6 7h1M3 8h3" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {hasStoredDueDate && (
        <div className='mx-2'>
          <ProgressBar dueDate={dueDateInput} />
        </div>
      )}

      {/* Game Container */}
      <div className="flex-1 min-h-[320px] max-h-[520px] bg-gray-200 overflow-hidden mx-2"></div>

      {/* Stats Container - Responsive bars */}
      <div className="py-4 text-white">
        <div className="flex flex-col h-full items-center">
          <p className="text-center pb-2">Current Stats:</p>
          <div className="flex-1 grid grid-cols-1">
            <HealthBar value={health} />
            <EnergyBar value={energy} onFill={() => setEnergy(10)} />
            <ThirstBar value={thirst} onFill={() => setThirst(10)} />
            <HungerBar value={hunger} onFill={() => setHunger(10)} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showStartModal && (
        <StartModal
          dueDate={dueDateInput}
          setDueDate={setDueDateInput}
          dateMissing={dateMissing}
          dateInvalid={dateInvalid}
          onSubmit={startGame}
        />
      )}
      {showResetModal && (
        <ResetModal
          onConfirm={() => {
            resetGame();
            setShowResetModal(false);
          }}
          onCancel={() => setShowResetModal(false)}
        />
      )}
      {gamePaused && (
        <PauseModal onResume={() => setGamePaused(false)} />
      )}
    </div>
  );
}

export default App;