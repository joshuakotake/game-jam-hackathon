
export default function PauseModal({ onResume }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Paused</h2>
        <p className="text-gray-700 mb-6">Your progress is safe. Take your time.</p>
        
        <div className="flex justify-end">
          <button
            onClick={onResume}
            className="rounded-lg bg-gray-600 px-4 py-3 text-sm text-white shadow hover:bg-gray-700"
          >
            Resume Task
          </button>
        </div>
      </div>
    </div>
  );
}
