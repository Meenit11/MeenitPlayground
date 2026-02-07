const STORAGE_KEY = 'undercover_game'

export function saveGameState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error(e)
  }
}

export function loadGameState() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (e) {
    return null
  }
}

export function clearGameState() {
  localStorage.removeItem(STORAGE_KEY)
}
