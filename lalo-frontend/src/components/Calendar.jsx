import { useState } from 'react'
import './Calendar.css'

export const Calendar = ({ onDateSelect, selectedDate, bookedDates = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const isPastDay = (day) => {
    if (!day) return false
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return date < today
  }

  const handleDateClick = (day) => {
    if (isPastDay(day)) return
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    onDateSelect(selected)
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const monthName = currentDate.toLocaleString('es', { month: 'long', year: 'numeric' })

  const isDateSelected = (day) => {
    if (!selectedDate || !day) return false
    const selected = new Date(selectedDate)
    selected.setHours(0, 0, 0, 0)
    const cell = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return cell.getTime() === selected.getTime()
  }

  const isBooked = (day) => {
    if (!day || bookedDates.length === 0) return false
    return bookedDates.some((d) => {
      const booked = new Date(d)
      return (
        booked.getDate() === day &&
        booked.getMonth() === currentDate.getMonth() &&
        booked.getFullYear() === currentDate.getFullYear()
      )
    })
  }

  const isToday = (day) => {
    if (!day) return false
    const cell = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return cell.getTime() === today.getTime()
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="nav-btn">←</button>
        <h3>{monthName}</h3>
        <button onClick={handleNextMonth} className="nav-btn">→</button>
      </div>

      <div className="calendar-weekdays">
        <div className="weekday">Dom</div>
        <div className="weekday">Lun</div>
        <div className="weekday">Mar</div>
        <div className="weekday">Mié</div>
        <div className="weekday">Jue</div>
        <div className="weekday">Vie</div>
        <div className="weekday">Sáb</div>
      </div>

      <div className="calendar-days">
        {days.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${
              day ? 'active' : 'empty'
            } ${isDateSelected(day) ? 'selected' : ''} ${
              isPastDay(day) ? 'disabled' : ''
            } ${isBooked(day) ? 'booked' : ''} ${isToday(day) ? 'today' : ''}`}
            onClick={() => day && handleDateClick(day)}
            title={isBooked(day) ? '💕 Date agendado' : ''}
          >
            {day}
            {isBooked(day) && <span className="booked-dot">•</span>}
          </div>
        ))}
      </div>

      <div className="calendar-legend">
        <span className="legend-item"><span className="dot booked-dot">•</span> Date agendado</span>
        <span className="legend-item"><span className="dot today-dot">◉</span> Hoy</span>
      </div>
    </div>
  )
}
