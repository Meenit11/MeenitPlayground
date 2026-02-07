import { useState, useEffect, useCallback } from 'react'

const API_BASE = '/api/rooms'
const POLL_INTERVAL = 1500

export function useRoom(code, playerId) {
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRoom = useCallback(async () => {
    if (!code) return
    try {
      const res = await fetch(`${API_BASE}/${code}`)
      if (!res.ok) throw new Error('Room not found')
      const data = await res.json()
      setRoom(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      setRoom(null)
    } finally {
      setLoading(false)
    }
  }, [code])

  useEffect(() => {
    fetchRoom()
    const interval = setInterval(fetchRoom, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchRoom])

  const updateRoom = useCallback(async (updates) => {
    try {
      const res = await fetch(`${API_BASE}/${code}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      const data = await res.json()
      setRoom(data)
      return data
    } catch (err) {
      console.error(err)
      return null
    }
  }, [code])

  const submitAnswer = useCallback(async (answer) => {
    try {
      const res = await fetch(`${API_BASE}/${code}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, answer }),
      })
      const data = await res.json()
      setRoom(data)
      return data
    } catch (err) {
      console.error(err)
      return null
    }
  }, [code, playerId])

  return { room, loading, error, refetch: fetchRoom, updateRoom, submitAnswer }
}
