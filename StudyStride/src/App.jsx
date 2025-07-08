import { useState, useEffect } from 'react';
import './App.css';
import EnergyBar from './bars/EnergyBar';
import HealthBar from './bars/HealthBar';
import ThirstBar from './bars/ThirstBar';
import HungerBar from './bars/HungerBar';
import { decrementBars, getHealthPenalty } from './functions/Update';
import StartModal from './modals/StartModal';
import { isDueDateValid, formatDueDate, formatTimeLeft } from './utils/timeUtils';
import ResetModal from './modals/ResetModal'
import ProgressBar from './bars/ProgressBar';

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
    if (!gameStarted) return;
    
    const interval = setInterval(() => {
      // Health recovery if all bars are full BEFORE decrement
      if (energy === 10 && thirst === 10 && hunger === 10) {
        setHealth(h => Math.min(h + 1, 10))
      }
      // Decrement bars
      const newBars = decrementBars({ energy, thirst, hunger });
      setEnergy(newBars.energy);
      setThirst(newBars.thirst);
      setHunger(newBars.hunger);

      // Health penalty
      const penalty = getHealthPenalty(newBars);
      if (penalty > 0) {
        setHealth(h => Math.max(h - penalty, 0));
      }
    }, 5000); // Change to 3600000 for 1 hour
    
    return () => clearInterval(interval);
  }, [energy, thirst, hunger, gameStarted]);

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
    <div className="flex flex-col h-screen bg-gray-800">
      {hasStoredDueDate && <ProgressBar dueDate={dueDateInput} />}
      <div className="flex-[1] bg-gray-200 p-4 overflow-hidden">
        <h1 className="flex justify-center text-xl">Game Section</h1>
        <p className="text-center mt-2 text-sm text-gray-600">
          {hasStoredDueDate
            ? `Stored Due Date: ${formatDueDate(dueDateInput)}`
            : 'No due date saved yet.'}
        </p>
        <p className="text-center mt-2 text-sm text-gray-600">
          {timeLeft > 0 ? `Time Left: ${formatTimeLeft(timeLeft)}` : "Time is up!"}
        </p>
        {hasStoredDueDate && (
          <button
            onClick={() => setShowResetModal(true)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition"
            title="Reset Game"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -0.5 9 9"
              shapeRendering="crispEdges"
              width="20"
              height="20"
            >
              <metadata>Made with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj</metadata>
              <path stroke="#ffffff" d="M0 0h1M3 0h3M0 1h1M2 1h1M6 1h1M0 2h2M7 2h1M0 3h4M8 3h1M8 4h1M0 5h1M8 5h1M1 6h1M7 6h1M2 7h1M6 7h1M3 8h3" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="flex-[1] p-4 text-white overflow-hidden">
        <div className='flex flex-row h-full'>
          <div className='flex-1 bars-section'>
            <HealthBar value={health} />
            <EnergyBar value={energy} onFill={() => setEnergy(10)} />
            <ThirstBar value={thirst} onFill={() => setThirst(10)} />
            <HungerBar value={hunger} onFill={() => setHunger(10)} />
          </div>
          <div className='flex-1 text-center'>
            <p>Time Section</p>
          </div>
        </div>
      </div>
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
    </div>
  );
}

export default App;