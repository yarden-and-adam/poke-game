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
      case 'seasonal': return '🎄'
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
      accent: theme.colors.accent || theme.colors.primary
    }
  }

  return (
    <div className="theme-selector">
      <button
        className="theme-selector-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select theme"
        aria-expanded={isOpen}
      >
        🎨 Themes
      </button>

      {isOpen && (
        <div className="theme-selector-dropdown">
          <div className="theme-selector-header">
            <h3>Select Theme</h3>
            <button
              className="theme-selector-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close theme selector"
            >
              ✕
            </button>
          </div>

          <div className="theme-selector-grid">
            {availableThemes.map((availableTheme) => {
              const preview = getThemePreview(availableTheme.id)
              const isActive = theme === availableTheme.id
              
              return (
                <button
                  key={availableTheme.id}
                  className={`theme-option ${isActive ? 'active' : ''}`}
                  onClick={() => handleThemeChange(availableTheme.id)}
                  aria-label={`Select ${availableTheme.name} theme`}
                  aria-pressed={isActive}
                >
                  <div className="theme-preview" style={preview}>
                    <div className="theme-preview-header" style={{ background: preview.primary }}></div>
                    <div className="theme-preview-body">
                      <div className="theme-preview-accent" style={{ background: preview.accent }}></div>
                      <div className="theme-preview-text"></div>
                    </div>
                  </div>
                  <div className="theme-info">
                    <div className="theme-name">
                      {getCategoryIcon(availableTheme.category)} {availableTheme.name}
                    </div>
                    <div className="theme-category">{availableTheme.category}</div>
                  </div>
                  {isActive && (
                    <div className="theme-active-indicator">✓</div>
                  )}
                </button>
              )
            })}
          </div>

          <div className="theme-selector-footer">
            <button
              className="theme-auto-button"
              onClick={() => {
                const autoTheme = themeRegistry.getAutoTheme()
                if (autoTheme) {
                  handleThemeChange(autoTheme)
                }
              }}
            >
              🤖 Auto Seasonal Theme
            </button>
          </div>
        </div>
      )}
    </div>
  )
}