// src/utils/timeUtils.js

// Check if the due date is valid (at least 24 hours from now)
export const isDueDateValid = (dateString) => {
  const selectedDate = new Date(dateString)
  const now = new Date()
  const minValidDate = new Date(now.getTime() + 24 * 60 * 60 * 1000)
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

// Format milliseconds left into d h m s format
export const formatTimeLeft = (ms) => {
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / (3600 * 24))
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${days}d ${hours}h ${minutes}m ${seconds}s`
}
