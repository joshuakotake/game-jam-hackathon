import { useState, useEffect } from 'react';
import './App.css';
import EnergyBar from './bars/EnergyBar';
import HealthBar from './bars/HealthBar';
import ThirstBar from './bars/ThirstBar';
import HungerBar from './bars/HungerBar';
import { decrementBars, getHealthPenalty } from './functions/update';
import StartModal from './modals/StartModal';
import { isDueDateValid, formatDueDate } from './utils/timeUtils';
import ResetModal from './modals/ResetModal'
import ProgressBar from './bars/ProgressBar';
import PauseModal from './modals/PauseModal';
import RestModal from './modals/RestModal';
import EndModal from './modals/EndModal';

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
      console.log("Error getting initial bar")
    }
  }
  return { energy: 10, health: 10, thirst: 10, hunger: 10 };
}

function getInitialTotalHealthLost() {
  const stored = localStorage.getItem('totalHealthLost');
  if (stored) {
    try {
      const totalHealthLost = JSON.parse(stored);
      if (typeof totalHealthLost === 'number') {
        return totalHealthLost;
      }
    } catch {
      console.log("Error getting initial totalHealthLost")
    }
  }
  return 0;
}

function App() {
  // Game Status
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  // Health tracking
  const [totalHealthLost, setTotalHealthLost] = useState(0);

  // Status bars state
  const [energy, setEnergy] = useState(() => getInitialBars().energy);
  const [health, setHealth] = useState(() => getInitialBars().health);
  const [thirst, setThirst] = useState(() => getInitialBars().thirst);
  const [hunger, setHunger] = useState(() => getInitialBars().hunger);

  // Count down timer
  const [hasStoredDueDate, setHasStoredDueDate] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  // Start Game
  const [showStartModal, setShowStartModal] = useState(!localStorage.getItem('dueDate'))
  const [dueDateInput, setDueDateInput] = useState('')
  const [dateMissing, setDateMissing] = useState(false)
  const [dateInvalid, setDateInvalid] = useState(false)

  // Reset Modal
  const [showResetModal, setShowResetModal] = useState(false)

  // Rest Modal
  const [showRestModal, setShowRestModal] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);

  // End Modal
  const [showEndModal, setShowEndModal] = useState(false);

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

  // Save totalHealthLost to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('totalHealthLost', JSON.stringify(totalHealthLost));
  }, [totalHealthLost]);

  // Load stored due date and set game as started if exists
  useEffect(() => {
    const storedDueDate = localStorage.getItem('dueDate');
    if (storedDueDate) {
      setHasStoredDueDate(true);
      setDueDateInput(storedDueDate);
      setShowStartModal(false);
      setGameStarted(true);
      
      const storedHealthLost = getInitialTotalHealthLost();
      setTotalHealthLost(storedHealthLost);
    }
  }, []);

    // Status bars effect
    useEffect(() => {
      if (!gameStarted || gamePaused || gameEnded) return;
      
      // Energy decrements every 18 minutes
      const energyInterval = setInterval(() => {
        if (!gamePaused) {
          setEnergy(prev => Math.max(prev - 1, 0));
        }
      }, 18 * 60 * 1000);
      
      // Thirst decrements every 15 minutes
      const thirstInterval = setInterval(() => {
        if (!gamePaused) {
          setThirst(prev => Math.max(prev - 1, 0));
        }
      }, 15 * 60 * 1000);
      
      // Hunger decrements every 36 minutes
      const hungerInterval = setInterval(() => {
        if (!gamePaused) {
          setHunger(prev => Math.max(prev - 1, 0));
        }
      }, 36 * 60 * 1000);
      
      // Penalty and health checks every minute
      const healthInterval = setInterval(() => {
        if (!gamePaused) {
          const penalty = getHealthPenalty({ energy, thirst, hunger });
          if (penalty > 0) {
            setHealth(h => {
              const newHealth = Math.max(h - penalty, 1);
              setTotalHealthLost(prev => prev + (h - newHealth));
              console.log(totalHealthLost)
              return newHealth;
            });
          } else if (energy === 10 && thirst === 10 && hunger === 10) {
            setHealth(h => Math.min(h + 1, 10));
          }
        }
      }, 60000);
    
    return () => {
      clearInterval(energyInterval);
      clearInterval(thirstInterval);
      clearInterval(hungerInterval);
      clearInterval(healthInterval);
    }
  }, [energy, thirst, hunger, gameStarted, gamePaused, gameEnded]);

  // Countdown effect
  useEffect(() => {
    if (!hasStoredDueDate || !dueDateInput) return;
  
    const updateCountdown = () => {
      const now = new Date();
      const end = new Date(dueDateInput);
      const difference = end - now;
      
      if (difference <= 0) {
        setTimeLeft(0);
        setGameEnded(true);
        setShowEndModal(true);
      } else {
        setTimeLeft(difference);
      }
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
    localStorage.removeItem('totalHealthLost')
    setDueDateInput('')
    setHasStoredDueDate(false)
    setShowStartModal(true)
    setGameStarted(false);
    setGameEnded(false);
    setTotalHealthLost(0);
    // Reset all bars to 10 and update localStorage
    setEnergy(10);
    setHealth(10);
    setThirst(10);
    setHunger(10);
    localStorage.setItem('barValues', JSON.stringify({ energy: 10, health: 10, thirst: 10, hunger: 10 }));
  };

  // Start Rest Activity
  const startRestActivity = (activityType) => {
    setCurrentActivity(activityType);
    setGamePaused(true);
    setShowRestModal(true);
  };
  
  // Finish Rest Activity
  const completeRestActivity = () => {
    setShowRestModal(false);
    setGamePaused(false);
    
    // Refill the appropriate bar
    if (currentActivity === 'energy') {
      setEnergy(10);
    } else if (currentActivity === 'thirst') {
      setThirst(10);
    } else if (currentActivity === 'hunger') {
      setHunger(10);
    }
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
    <div className="flex flex-col h-screen bg-[#303030] max-w-4xl mx-auto">
      {/* Header */}
      <div className="min-h-20 mb-1 bg-[#303030] flex flex-col justify-center relative">
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
      <div className='mx-2'>
        <ProgressBar dueDate={dueDateInput} />
      </div>

      {/* Game Container */}
      <div className="flex-1 min-h-[320px] max-h-[520px] bg-gray-200 overflow-hidden mx-2"></div>

      {/* Stats Container - Responsive bars */}
      <div className="py-4 text-white">
        <div className="flex flex-col h-full items-center">
          <p className="text-center pb-2">Current Stats:</p>
          <div className="flex-1 grid grid-cols-1">
            <HealthBar value={health} />
            <EnergyBar 
              value={energy} 
              onFill={() => startRestActivity('energy')} 
            />
            <ThirstBar 
              value={thirst} 
              onFill={() => startRestActivity('thirst')} 
            />
            <HungerBar 
              value={hunger} 
              onFill={() => startRestActivity('hunger')} 
            />
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
      {showRestModal && (
        <RestModal 
          onComplete={completeRestActivity}
          activityType={currentActivity}
        />
      )}
      {showEndModal && (
        <EndModal 
          healthLost={totalHealthLost}
          onRestart={() => {
            resetGame();
            setShowEndModal(false);
          }}
        />
      )}
    </div>
  );
}

export default App;