import { useState, useEffect } from 'react'
import './App.css'
import EnergyBar from './bars/EnergyBar'
import HealthBar from './bars/HealthBar'
import ThirstBar from './bars/ThirstBar'
import HungerBar from './bars/HungerBar'
import SanityBar from './bars/SanityBar'
import { decrementBars, getHealthPenalty } from './functions/Update'
import StartModal from './modals/StartModal'
import {
  isDueDateValid,
  formatDueDate,
  formatTimeLeft
} from './utils/timeUtils'

function getInitialBars() {
  const stored = localStorage.getItem('barValues');
  if (stored) {
    try {
      const { energy, health, thirst, hunger, sanity } = JSON.parse(stored);
      if (
        typeof energy === 'number' &&
        typeof health === 'number' &&
        typeof thirst === 'number' &&
        typeof hunger === 'number' &&
        typeof sanity === 'number'
      ) {
        return { energy, health, thirst, hunger, sanity };
      }
    } catch {}
  }
  return { energy: 10, health: 10, thirst: 10, hunger: 10, sanity: 10 };
}

function App() {
  // Status bars state
  const [energy, setEnergy] = useState(() => getInitialBars().energy);
  const [health, setHealth] = useState(() => getInitialBars().health);
  const [thirst, setThirst] = useState(() => getInitialBars().thirst);
  const [hunger, setHunger] = useState(() => getInitialBars().hunger);
  const [sanity, setSanity] = useState(() => getInitialBars().sanity);

  // Countdown timer state
  const [hasStoredDueDate, setHasStoredDueDate] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [showStartModal, setShowStartModal] = useState(true)
  const [dueDateInput, setDueDateInput] = useState('')
  const [dateMissing, setDateMissing] = useState(false)
  const [dateInvalid, setDateInvalid] = useState(false)

  // Load bar values from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('barValues')
    if (stored) {
      try {
        const { energy, health, thirst, hunger, sanity } = JSON.parse(stored)
        if (
          typeof energy === 'number' &&
          typeof health === 'number' &&
          typeof thirst === 'number' &&
          typeof hunger === 'number' &&
          typeof sanity === 'number'
        ) {
          setEnergy(energy)
          setHealth(health)
          setThirst(thirst)
          setHunger(hunger)
          setSanity(sanity)
        }
      } catch {}
    }
  }, [])

  // Save bar values to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      'barValues',
      JSON.stringify({ energy, health, thirst, hunger, sanity })
    )
  }, [energy, health, thirst, hunger, sanity])

  // Load stored due date
  useEffect(() => {
    const storedDueDate = localStorage.getItem('dueDate')
    if (storedDueDate) {
      setHasStoredDueDate(true)
      setDueDateInput(storedDueDate)
      setShowStartModal(false)
    }
  }, [])

  // Status bars effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Decrement bars
      const newBars = decrementBars({ energy, thirst, hunger, sanity })
      setEnergy(newBars.energy)
      setThirst(newBars.thirst)
      setHunger(newBars.hunger)
      setSanity(newBars.sanity)
      // Health penalty
      const penalty = getHealthPenalty(newBars)
      if (penalty > 0) {
        setHealth(h => Math.max(h - penalty, 0))
      }
    }, 5000) // Change to 3600000 for 1 hour
    return () => clearInterval(interval)
  }, [energy, thirst, hunger, sanity])

  // Countdown effect
  useEffect(() => {
    if (!hasStoredDueDate || !dueDateInput) return
  
    const updateCountdown = () => {
      const now = new Date()
      const end = new Date(dueDateInput)
      const difference = end - now
      setTimeLeft(difference > 0 ? difference : 0)
    }
    updateCountdown()
    
    const interval = setInterval(updateCountdown, 1000)
  
    return () => clearInterval(interval)
  }, [hasStoredDueDate, dueDateInput])

  // Start Game
  const startGame = () => {
    setDateMissing(false)
    setDateInvalid(false)
  
    if (!dueDateInput.trim()) {
      setDateMissing(true)
      return
    }
  
    if (!isDueDateValid(dueDateInput)) {
      setDateInvalid(true)
      return
    }

    localStorage.setItem('dueDate', dueDateInput)
    setShowStartModal(false)
    setHasStoredDueDate(true)
  }
  
  // Reset Game
  const resetGame = () => {
    localStorage.removeItem('dueDate')
    setDueDateInput('')
    setHasStoredDueDate(false)
    setShowStartModal(true)
    // Reset all bars to 10 and update localStorage
    setEnergy(10)
    setHealth(10)
    setThirst(10)
    setHunger(10)
    setSanity(10)
    localStorage.setItem('barValues', JSON.stringify({ energy: 10, health: 10, thirst: 10, hunger: 10, sanity: 10 }))
  }

  // Prevent closing of modal
  useEffect(() => {
    const preventEscape = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', preventEscape)
    return () => window.removeEventListener('keydown', preventEscape)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <div className="flex-[1] bg-gray-200 p-4 overflow-hidden">
        <h1 className="flex justify-center text-xl">Game Section</h1>
        <p className="text-center mt-2 text-sm text-gray-600">
          {hasStoredDueDate
            ? `Stored Due Date: ${formatDueDate(dueDateInput)}`
            : 'No due date saved yet.'}
        </p>
        <p className="text-center mt-2 text-sm text-gray-600">
          Time Left: {formatTimeLeft(timeLeft)}
        </p>
        {hasStoredDueDate && (
          <button
            onClick={resetGame}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition"
            title="Reset Game"
          >
            <img
              src="/src/assets/pixelart/ResetIcon.svg"
              alt="Reset Icon"
              width={20}
              height={20}
            />
          </button>
        )}
      </div>
      
      <div className="flex-[1] p-4 text-white overflow-hidden">
        <div className='flex flex-row h-full'>
          <div className='flex-1 bars-section'>
            <HealthBar value={health} onFill={() => setHealth(10)} />
            <EnergyBar value={energy} onFill={() => setEnergy(10)} />
            <ThirstBar value={thirst} onFill={() => setThirst(10)} />
            <HungerBar value={hunger} onFill={() => setHunger(10)} />
            <SanityBar value={sanity} onFill={() => setSanity(10)} />
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
    </div>
  )
}

export default App
