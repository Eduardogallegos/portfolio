import { useState, useEffect } from 'react'
import './Countdown.css'

const TARGET_DATE = new Date('2026-10-22T00:00:00')

function getTimeLeft() {
  const now = new Date()
  const diff = TARGET_DATE - now

  if (diff <= 0) return null

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

export const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!timeLeft) {
    return (
      <div className="countdown-container arrived">
        <p className="countdown-arrived">¡Ya llegaste! 💜</p>
      </div>
    )
  }

  const units = [
    { value: timeLeft.days,    label: timeLeft.days === 1 ? 'día' : 'días' },
    { value: timeLeft.hours,   label: timeLeft.hours === 1 ? 'hora' : 'horas' },
    { value: timeLeft.minutes, label: 'min' },
    { value: timeLeft.seconds, label: 'seg' },
  ]

  return (
    <div className="countdown-container">
      <p className="countdown-title">Te extraño · faltan</p>
      <div className="countdown-units">
        {units.map(({ value, label }) => (
          <div key={label} className="countdown-unit">
            <span className="countdown-value">{String(value).padStart(2, '0')}</span>
            <span className="countdown-label">{label}</span>
          </div>
        ))}
      </div>
      <p className="countdown-date">para verte de nuevo 🏠</p>
      <p className="countdown-date">Disfruta tu viaje!</p>
    </div>
  )
}
