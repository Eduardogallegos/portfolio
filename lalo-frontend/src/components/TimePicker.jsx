import './TimePicker.css'

export const TimePicker = ({ selectedTime, onTimeSelect }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = [0, 15, 30, 45]

  const [hoursStr, minutesStr] = selectedTime.split(':')
  const hours_val = parseInt(hoursStr)
  const minutes_val = parseInt(minutesStr)

  const handleHourChange = (hour) => {
    const newMinutes = minutes_val.toString().padStart(2, '0')
    onTimeSelect(`${hour.toString().padStart(2, '0')}:${newMinutes}`)
  }

  const handleMinuteChange = (minute) => {
    const newHour = hours_val.toString().padStart(2, '0')
    onTimeSelect(`${newHour}:${minute.toString().padStart(2, '0')}`)
  }

  return (
    <div className="time-picker">
      <div className="time-display">
        <input
          type="time"
          value={selectedTime}
          onChange={(e) => onTimeSelect(e.target.value)}
          className="time-input"
        />
      </div>

      <div className="time-selector">
        <div className="time-column">
          <label>Horas</label>
          <div className="scroll-container">
            {hours.map((hour) => (
              <button
                key={hour}
                className={`time-option ${hours_val === hour ? 'selected' : ''}`}
                onClick={() => handleHourChange(hour)}
              >
                {hour.toString().padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>

        <div className="separator">:</div>

        <div className="time-column">
          <label>Minutos</label>
          <div className="scroll-container">
            {minutes.map((minute) => (
              <button
                key={minute}
                className={`time-option ${minutes_val === minute ? 'selected' : ''}`}
                onClick={() => handleMinuteChange(minute)}
              >
                {minute.toString().padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}