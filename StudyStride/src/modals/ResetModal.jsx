
export default function ResetModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reset Task</h2>
        
        <p className="text-gray-700 mb-6">Are you sure you want to reset your current task? All progress will be lost.</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-gray-200 px-4 py-3 text-sm text-gray-800 shadow hover:bg-gray-300"
          >
            Continue Task
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-gray-600 px-4 py-3 text-sm text-white shadow hover:bg-gray-700"
          >
            Confirm Reset
          </button>
        </div>
      </div>
    </div>
  )
};