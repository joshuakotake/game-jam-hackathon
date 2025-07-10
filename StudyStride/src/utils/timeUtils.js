
// Check if the due date is valid
export const isDueDateValid = (dateString) => {
  const selectedDate = new Date(dateString)
  const now = new Date()
  const minValidDate = new Date(now.getTime() + 15 * 60 * 1000)
  return selectedDate >= minValidDate
}

// Format ISO date string into readable format
export const formatDueDate = (isoString) => {
  const date = new Date(isoString)
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return date.toLocaleString('en-AU', options)
}
