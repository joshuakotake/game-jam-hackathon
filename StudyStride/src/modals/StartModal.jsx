import StatSlider from "../utils/slider";
import { useState } from "react";

export default function StartModal({ dueDate, setDueDate, dateMissing, dateInvalid, onSubmit, energyInterval, thirstInterval, hungerInterval, setEnergyInterval, setThirstInterval, setHungerInterval }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl p-6 relative">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 12 9" shapeRendering="crispEdges" className="w-6 h-6">
          <metadata>Made with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj</metadata>
          <path stroke="#303030" d="M4 0h4M2 1h2M8 1h2M1 2h1M10 2h1M0 3h1M11 3h1M0 4h1M11 4h1M0 5h1M11 5h1M0 6h1M11 6h1M1 7h2M9 7h2M3 8h6" />
          <path stroke="#a1a1a1" d="M4 1h4M8 2h2M10 3h1M10 4h1M2 5h1M7 5h1M10 5h1" />
          <path stroke="#787878" d="M2 2h6M1 3h2M4 3h2M7 3h3M1 4h2M4 4h2M7 4h3M1 5h1M3 5h4M8 5h2M1 6h10M3 7h6" />
          <path stroke="#000000" d="M3 3h1M6 3h1M3 4h1M6 4h1" />
        </svg>

        <div
          className="absolute top-7 right-4 group"
          onClick={() => setShowInfo(prev => !prev)}
          onMouseLeave={() => setShowInfo(false)}
        >
          <button type="button" className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>Information</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          </button>

          <div
            className={`absolute right-0 mt-2 w-72 sm:w-80 bg-gray-50 border border-gray-300 shadow-lg rounded-md p-4 text-sm text-gray-700 z-50 ${
              showInfo ? 'block' : 'hidden'
            }`}
          >
            <p className="font-bold text-gray-900 text-lg mb-3">How It Works:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Set a due date to track your progress.</li>
              <li><span className="text-yellow-600 font-semibold">Energy, Thirst, and Hunger</span> gradually deplete.</li>
              <li>Lose <span className="text-red-700 font-bold">1 health</span> per depleted stat (max <span className="font-bold">3</span>).</li>
              <li><span className="text-green-600 font-semibold">Health recovers</span> when all stats are above <span className="font-bold">7</span>.</li>
              <li>Final score is ranked <span className="text-purple-700 font-semibold">S–F</span> based on health lost.</li>
              <li className="text-red-700 font-semibold">Fail if health hits 1 or you lose 9+ points.</li>
            </ul>
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">Welcome to StudyStride</h1>
        <h2 className="text-lg text-gray-800 font-medium mb-6">Start New Task</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {/* Task Due Date */}
          <div className="mb-6">
            <label htmlFor="due-date-input" className="block text-sm font-medium text-gray-700 mb-1">
              Task Due Date <span className="text-red-500">*</span>{' '} <span className="text-xs text-gray-500">(over 15 min from now)</span>
            </label>
            <input
              id="due-date-input"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`
                block w-full rounded-lg border px-4 py-3 text-gray-900 shadow-sm transition duration-200 sm:text-sm
                ${dateMissing || dateInvalid
                  ? 'border-red-500 hover:ring-red-500 hover:ring-1'
                  : 'border-gray-300 hover:ring-gray-300 hover:ring-1'
                }
                focus:outline-none focus:ring-0
              `}
            />
            {dateMissing && (
              <p className="mt-2 text-sm text-red-600">Due date is required.</p>
            )}
            {dateInvalid && (
              <p className="mt-2 text-sm text-red-600">Due date has to be over 15 min from now.</p>
            )}
          </div>

          {/* Sliders */}
          <p className="text-sm font-medium text-gray-700 mb-1">Optional:</p>
          <p className="text-xs text-gray-500 mb-2">Depletion rate is the time it takes for a stat to fully deplete and for the player to start losing HP.</p>
          <StatSlider
            id="energy-interval-input"
            label="Energy Depletion Rate"
            value={energyInterval}
            onChange={setEnergyInterval}
          />

          <StatSlider
            id="thirst-interval-input"
            label="Thirst Depletion Rate"
            value={thirstInterval}
            onChange={setThirstInterval}
          />

          <StatSlider
            id="hunger-interval-input"
            label="Hunger Depletion Rate"
            value={hungerInterval}
            onChange={setHungerInterval}
          />

          {/* Submit */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-gray-600 px-4 py-3 text-sm text-white shadow hover:bg-gray-700"
            >
              Start Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
