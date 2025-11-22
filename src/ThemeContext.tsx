import { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { themeRegistry } from './themes'

interface ThemeContextType {
  theme: string
  themeName: string
  setTheme: (themeId: string) => void
  toggleTheme: () => void
  availableThemes: Array<{ id: string; name: string; category: string }>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<string>('dark')
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize themes on mount
    import('./themes').then(({ initializeThemes }) => {
      initializeThemes()
      setThemeState(themeRegistry.activeTheme)
      setIsInitialized(true)
    })
  }, [])

  useEffect(() => {
    if (!isInitialized) return

    const activeTheme = themeRegistry.getActiveTheme()
    const root = document.documentElement
    
    // Set theme data attribute
    root.setAttribute('data-theme', activeTheme.id)
    
    // Apply CSS custom properties
    const colors = activeTheme.colors
    root.style.setProperty('--theme-background', colors.background)
    root.style.setProperty('--theme-surface', colors.surface)
    root.style.setProperty('--theme-card', colors.card)
    root.style.setProperty('--theme-text', colors.text)
    root.style.setProperty('--theme-text-secondary', colors.textSecondary)
    root.style.setProperty('--theme-border', colors.border)
    
    root.style.setProperty('--theme-primary', colors.primary)
    root.style.setProperty('--theme-success', colors.success)
    root.style.setProperty('--theme-warning', colors.warning)
    root.style.setProperty('--theme-danger', colors.danger)
    root.style.setProperty('--theme-info', colors.info)
    
    // Apply type colors
    Object.entries(colors.typeColors).forEach(([type, color]) => {
      root.style.setProperty(`--theme-type-${type}`, color)
    })
    
    // Apply special colors
    if (colors.accent) {
      root.style.setProperty('--theme-accent', colors.accent)
    }
    if (colors.festive) {
      root.style.setProperty('--theme-festive', colors.festive)
    }
    
    // Save to localStorage
    localStorage.setItem('theme', activeTheme.id)
  }, [theme, isInitialized])

  const setTheme = (themeId: string) => {
    if (themeRegistry.getTheme(themeId)) {
      themeRegistry.setActiveTheme(themeId)
      setThemeState(themeId)
    }
  }

  const toggleTheme = () => {
    const themes = themeRegistry.getAllThemes()
    const currentIndex = themes.findIndex(t => t.id === theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex].id)
  }

  const availableThemes = themeRegistry.getAllThemes().map(t => ({
    id: t.id,
    name: t.name,
    category: t.category
  }))

  const activeTheme = themeRegistry.getTheme(theme) || themeRegistry.getTheme('dark')!

  if (!isInitialized) {
    return <div>Loading themes...</div>
  }

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      themeName: activeTheme.name,
      setTheme, 
      toggleTheme, 
      availableThemes 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
