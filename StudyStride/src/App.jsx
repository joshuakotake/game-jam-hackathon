import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <div className="flex-[1] bg-gray-200 p-4 overflow-hidden">
        <h1 className="flex justify-center text-xl">Game Section</h1>
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
    </div>
  )
}

export default App
