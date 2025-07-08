import { useState, useEffect } from 'react'
import './App.css'
import EnergyBar from './bars/EnergyBar'
import HealthBar from './bars/HealthBar'
import ThirstBar from './bars/ThirstBar'
import HungerBar from './bars/HungerBar'
import SanityBar from './bars/SanityBar'
import { decrementBars, getHealthPenalty } from './functions/Update'

function App() {
  const [energy, setEnergy] = useState(10)
  const [health, setHealth] = useState(10)
  const [thirst, setThirst] = useState(10)
  const [hunger, setHunger] = useState(10)
  const [sanity, setSanity] = useState(10)

  useEffect(() => {
    const interval = setInterval(() => {
      // Decrement bars
      const newBars = decrementBars({ energy, thirst, hunger, sanity })
      setEnergy(newBars.energy)
      setThirst(newBars.thirst)
      setHunger(newBars.hunger)
      setSanity(newBars.sanity)
      // Health penalty: check every tick and decrease accordingly
      const penalty = getHealthPenalty(newBars)
      if (penalty > 0) {
        setHealth(h => Math.max(h - penalty, 0))
      }
    }, 5000) // Change to 3600000 for 1 hour
    return () => clearInterval(interval)
  }, [energy, thirst, hunger, sanity])

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <div className="flex-[1] bg-gray-200 p-4 overflow-hidden">
        <h1 className="flex justify-center text-xl">Game Section</h1>
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
    </div>
  )
}

export default App
