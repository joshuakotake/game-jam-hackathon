import { useState, useEffect } from 'react'
import './App.css'
import StartModal from './modals/StartModal'
import {
  isDueDateValid,
  formatDueDate,
  formatTimeLeft
} from './utils/timeUtils'

function App() {
  // Store Due Date State
  const [hasStoredDueDate, setHasStoredDueDate] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  // Start Modal States
  const [showStartModal, setShowStartModal] = useState(true)
  const [dueDateInput, setDueDateInput] = useState('')
  const [dateMissing, setDateMissing] = useState(false)
  const [dateInvalid, setDateInvalid] = useState(false)

  // Persistence (if due date is in local storage, load game)
  useEffect(() => {
    const storedDueDate = localStorage.getItem('dueDate')
    if (storedDueDate) {
      setHasStoredDueDate(true)
      setDueDateInput(storedDueDate)
      setShowStartModal(false)
    }
  }, [])


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
  
  // Countdown function
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
  

  // Reset Game
  const resetGame = () => {
    localStorage.removeItem('dueDate')
    setDueDateInput('')
    setHasStoredDueDate(false)
    setShowStartModal(true)
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
          <div className='flex-1 text-center'>
            <p>Bar Section</p>
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
