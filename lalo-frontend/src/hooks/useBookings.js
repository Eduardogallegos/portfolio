import { useState, useEffect } from 'react'
import { bookingsAPI } from '../utils/api'

export const useBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await bookingsAPI.getAll()
      setBookings(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const createBooking = async (plan_id, fecha, hora_inicio) => {
    setLoading(true)
    setError(null)
    try {
      const response = await bookingsAPI.create(plan_id, fecha, hora_inicio)
      setBookings([...bookings, response.data])
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating booking')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
  }
}
