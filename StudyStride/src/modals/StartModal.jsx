
export default function StartModal({ dueDate, setDueDate, dateMissing, dateInvalid, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Start New Task</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
        >
          <label htmlFor="due-date-input" className="block text-sm font-medium text-gray-700 mb-1">
            Task Due Date<span className="text-red-500">*</span> <span className="text-xs text-gray-500">(at least 24 hours from now)</span>
          </label>
          <input
            id="due-date-input"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`
              block w-full rounded-lg border px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 sm:text-sm/6
              ${(dateMissing || dateInvalid) ? 'border-red-500 hover:ring-red-500 hover:ring-1' : 'border-gray-300 hover:ring-gray-300 hover:ring-1'}
              focus:outline-none focus:ring-0
            `}
          />
          {dateMissing && (
            <p className="mt-2 text-sm text-red-600">Due Date is Required</p>
          )}

          {dateInvalid && (
           <p className="mt-2 text-sm text-red-600">Due Date has to be more 24 hours from now</p>
          )}

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
