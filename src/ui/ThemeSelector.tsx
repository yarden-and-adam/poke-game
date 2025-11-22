import { useState } from 'react'
import { useTheme } from '../ThemeContext'
import { themeRegistry } from '../themes'

interface ThemeSelectorProps {
  onClose?: () => void
}

export default function ThemeSelector({ onClose }: ThemeSelectorProps) {
  const { theme, setTheme, availableThemes } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId)
    setIsOpen(false)
    onClose?.()
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'base': return '🎨'
      case 'seasonal': return '🌟'
      case 'event': return '🎉'
      case 'custom': return '✨'
      default: return '🎨'
    }
  }

  const getThemePreview = (themeId: string) => {
    const theme = themeRegistry.getTheme(themeId)
    if (!theme) return {}

    return {
      background: theme.colors.background,
      primary: theme.colors.primary,
      accent: theme.colors.accent || theme.colors.primary,
      surface: theme.colors.surface,
      text: theme.colors.text
    }
  }

  return (
    <div className="theme-selector-container">
      <button
        className="theme-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select theme"
        aria-expanded={isOpen}
      >
        <span className="icon">🎨</span>
        <span className="label">Themes</span>
      </button>

      {isOpen && (
        <>
          <div className="theme-backdrop" onClick={() => setIsOpen(false)} />
          <div className="theme-panel">
            <div className="theme-panel-header">
              <h3>Customize Look</h3>
              <button
                className="close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close theme selector"
              >
                ✕
              </button>
            </div>

            <div className="theme-grid">
              {availableThemes.map((availableTheme) => {
                const preview = getThemePreview(availableTheme.id)
                const isActive = theme === availableTheme.id

                return (
                  <button
                    key={availableTheme.id}
                    className={`theme-card ${isActive ? 'active' : ''}`}
                    onClick={() => handleThemeChange(availableTheme.id)}
                    style={{ '--theme-accent': preview.accent } as any}
                  >
                    <div className="theme-preview-box" style={{ background: preview.background }}>
                      <div className="preview-surface" style={{ background: preview.surface }}>
                        <div className="preview-line" style={{ background: preview.text, opacity: 0.5, width: '60%' }} />
                        <div className="preview-line" style={{ background: preview.text, opacity: 0.3, width: '40%' }} />
                        <div className="preview-dot" style={{ background: preview.primary }} />
                      </div>
                    </div>

                    <div className="theme-info">
                      <span className="theme-name">
                        {availableTheme.name}
                      </span>
                      {isActive && <span className="active-badge">Active</span>}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="theme-footer">
              <button
                className="auto-theme-btn"
                onClick={() => {
                  const auto = themeRegistry.getAutoTheme()
                  if (auto) handleThemeChange(auto)
                }}
              >
                ✨ Auto-Detect Season
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}