import { useState } from 'react'
import './Calendar.css'

export const Calendar = ({ onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

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

  const handleDateClick = (day) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    // Usar toISOString completo (con hora)
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
    return (
      day === selected.getDate() &&
      currentDate.getMonth() === selected.getMonth() &&
      currentDate.getFullYear() === selected.getFullYear()
    )
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
            } ${isDateSelected(day) ? 'selected' : ''}`}
            onClick={() => day && handleDateClick(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}