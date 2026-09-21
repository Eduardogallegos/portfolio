import { useState } from "react";
import { usePlans } from "../hooks/usePlans";
import { useBookings } from "../hooks/useBookings";
import { useAuth } from "../hooks/useAuth";
import { Calendar } from "./Calendar";
import "./DateBooking.css";

export const DateBooking = () => {
  const { user } = useAuth();
  const { planes, loading: planesLoading } = usePlans();
  const {
    bookings,
    createBooking,
    loading: bookingLoading,
    error,
  } = useBookings();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("19:00");
  const [success, setSuccess] = useState(false);

  const handleBooking = async () => {
    if (!selectedPlan || !selectedDate) {
      alert("Por favor selecciona un plan y una fecha");
      return;
    }

    try {
      const dateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(":");
      dateTime.setHours(parseInt(hours), parseInt(minutes));

      await createBooking(
        selectedPlan.id,
        dateTime.toISOString(),
        selectedTime,
      );
      setSuccess(true);
      setSelectedPlan(null);
      setSelectedDate(null);
      setSelectedTime("19:00");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      // Error manejado por el hook
    }
  };

  const downloadICalendar = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/bookings/export/ical",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dates.ics";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error downloading iCalendar:", err);
      alert("Error al descargar el calendario");
    }
  };

  const openGoogleCalendar = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/bookings/export/google-calendar",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      const data = await response.json();

      if (data.events.length === 0) {
        alert("No hay dates para agregar");
        return;
      }

      // Abrir el primer evento en Google Calendar
      // (en la práctica, podrías crear una página para elegir cuál abrir)
      window.open(data.events[0].google_url, "_blank");
    } catch (err) {
      console.error("Error opening Google Calendar:", err);
      alert("Error al abrir Google Calendar");
    }
  };

  return (
    <div className="date-booking-container">
      <div className="date-booking-card">
        <h1>💕 Agendar un Date</h1>

        {success && (
          <div className="alert alert-success">
            ✓ ¡Date agendado exitosamente!
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {/* Rol de usuario */}
        <div className="user-role">
          <p>
            Conectado como:{" "}
            <strong>{user?.role === "pareja" ? "💑 Pareja" : "👨 Lalo"}</strong>
          </p>
          {user?.role !== "pareja" && (
            <p className="warning">⚠️ Solo la pareja puede agendar dates</p>
          )}
        </div>

        {/* Seleccionar Plan */}
        <div className="section">
          <h2>1. Elige un Plan</h2>
          {planesLoading ? (
            <div className="loading"></div>
          ) : planes.length === 0 ? (
            <p className="empty">
              No hay planes disponibles. Lalo debe crear algunos primero.
            </p>
          ) : (
            <div className="plans-grid">
              {planes.map((plan) => (
                <div
                  key={plan.id}
                  className={`plan-card ${selectedPlan?.id === plan.id ? "selected" : ""}`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <h3>{plan.nombre}</h3>
                  <p>{plan.descripcion}</p>
                  <p className="duration">⏱️ {plan.duracion_minutos} minutos</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Seleccionar Fecha */}
        {selectedPlan && (
          <div className="section">
            <h2>2. Elige una Fecha</h2>
            <Calendar
              onDateSelect={setSelectedDate}
              selectedDate={selectedDate}
            />
          </div>
        )}

        {/* Seleccionar Hora */}
        {selectedPlan && selectedDate && (
          <div className="section">
            <h2>3. Elige una Hora</h2>
            <div className="time-picker-wrapper">
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="time-input-simple"
              />
            </div>
          </div>
        )}

        {/* Botón de Agendar */}
        {user?.role === "pareja" && selectedPlan && selectedDate && (
          <button
            className="btn-primary btn-large"
            onClick={handleBooking}
            disabled={bookingLoading}
          >
            {bookingLoading ? (
              <span className="loading"></span>
            ) : (
              "💕 Agendar Date"
            )}
          </button>
        )}

        {/* Lista de Bookings */}
        {bookings.length > 0 && (
          <div className="section">
            <h2>📅 Dates Agendados</h2>

            {/* Botones de exportar */}
            <div className="export-buttons">
              <button
                className="btn-secondary"
                onClick={() => downloadICalendar()}
              >
                📥 Descargar como .ics
              </button>
              <button
                className="btn-secondary"
                onClick={() => openGoogleCalendar()}
              >
                📅 Abrir en Google Calendar
              </button>
            </div>

            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-item">
                  <h4>{booking.plan.nombre}</h4>
                  <p>📅 {new Date(booking.fecha).toLocaleDateString()}</p>
                  <p>⏰ {booking.hora_inicio}</p>
                  <p className="description">{booking.plan.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
