import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useAlbum } from '../hooks/useAlbum'
import './Album.css'

function UploadModal({ onClose, onUpload, uploading }) {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [dateLabel, setDateLabel] = useState('')
  const [preview, setPreview] = useState(null)
  const inputRef = useRef()

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !title.trim()) return
    await onUpload(file, title.trim(), dateLabel.trim() || null)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">Agregar foto al álbum</h3>
        <form onSubmit={handleSubmit}>
          <div
            className="photo-drop"
            onClick={() => inputRef.current?.click()}
          >
            {preview
              ? <img src={preview} alt="preview" className="photo-preview" />
              : <span>Toca para elegir una foto 📷</span>
            }
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{ display: 'none' }}
            />
          </div>
          <input
            className="modal-input"
            type="text"
            placeholder="Título *"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <input
            className="modal-input"
            type="text"
            placeholder="Fecha o etiqueta (opcional) — ej. Septiembre 2026"
            value={dateLabel}
            onChange={e => setDateLabel(e.target.value)}
          />
          <div className="modal-actions">
            <button type="button" className="modal-btn-cancel" onClick={onClose}>Cancelar</button>
            <button
              type="submit"
              className="modal-btn-submit"
              disabled={!file || !title.trim() || uploading}
            >
              {uploading ? 'Subiendo…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EntryCard({ entry, canDelete, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const isMessage = entry.type === 'mensaje'
  const preview = entry.content && entry.content.length > 180
    ? entry.content.slice(0, 180) + '…'
    : entry.content

  return (
    <article className={`album-card album-card--${entry.type}`}>
      {entry.image_url && (
        <div className="album-card-img-wrap">
          <img src={entry.image_url} alt={entry.title} className="album-card-img" />
        </div>
      )}
      <div className="album-card-body">
        {entry.date_label && (
          <span className="album-card-date">{entry.date_label}</span>
        )}
        <h3 className="album-card-title">{entry.title}</h3>
        {entry.content && (
          <p className="album-card-content">
            {expanded ? entry.content : preview}
            {entry.content.length > 180 && (
              <button
                className="album-card-expand"
                onClick={() => setExpanded(v => !v)}
              >
                {expanded ? ' ver menos' : ' ver más'}
              </button>
            )}
          </p>
        )}
        <div className="album-card-footer">
          <span className="album-card-author">
            {isMessage ? '✉️' : '📷'} {entry.created_by_role === 'lalo' ? 'Lalo' : 'Mariana'}
          </span>
          {canDelete && (
            <button
              className="album-card-delete"
              onClick={() => onDelete(entry.id)}
              title="Eliminar entrada"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export const Album = () => {
  const { user, isAuthenticated } = useAuth()
  const { entries, loading, uploading, error, uploadPhoto, deleteEntry } = useAlbum()
  const [showUpload, setShowUpload] = useState(false)
  const isLalo = user?.role === 'lalo'

  if (!isAuthenticated) {
    return (
      <div className="album-empty">
        <p>Debes iniciar sesión para ver el álbum.</p>
        <Link to="/pareja/login">Iniciar sesión</Link>
      </div>
    )
  }

  return (
    <div className="album-page">
      <header className="album-header">
        <Link to="/pareja" className="album-back">← Volver</Link>
        <div className="album-header-center">
          <span className="album-header-emoji">🌻</span>
          <h1 className="album-header-title">Álbum de recuerdos</h1>
          <p className="album-header-sub">Momentos, mensajes y fotos guardadas para siempre</p>
        </div>
        <button
          className="album-add-btn"
          onClick={() => setShowUpload(true)}
        >
          + Foto
        </button>
      </header>

      {error && <p className="album-error">{error}</p>}

      {loading ? (
        <div className="album-loading">
          <span className="album-loading-spinner" />
        </div>
      ) : entries.length === 0 ? (
        <div className="album-empty">
          <p>El álbum está vacío por ahora 🌱</p>
        </div>
      ) : (
        <div className="album-grid">
          {entries.map(entry => (
            <EntryCard
              key={entry.id}
              entry={entry}
              canDelete={isLalo}
              onDelete={deleteEntry}
            />
          ))}
        </div>
      )}

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUpload={uploadPhoto}
          uploading={uploading}
        />
      )}
    </div>
  )
}
