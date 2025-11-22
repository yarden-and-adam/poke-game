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

    // Apply CSS custom properties - Base colors
    const colors = activeTheme.colors

    // Set BOTH naming schemes for backwards compatibility
    // Old components use --color-*, new theme system uses --theme-*
    root.style.setProperty('--theme-background', colors.background)
    root.style.setProperty('--color-bg', colors.background)

    root.style.setProperty('--theme-surface', colors.surface)
    root.style.setProperty('--color-surface', colors.surface)

    root.style.setProperty('--theme-card', colors.card)
    root.style.setProperty('--color-card', colors.card)

    root.style.setProperty('--theme-text', colors.text)
    root.style.setProperty('--color-text', colors.text)

    root.style.setProperty('--theme-text-secondary', colors.textSecondary)
    root.style.setProperty('--color-text-secondary', colors.textSecondary)

    root.style.setProperty('--theme-border', colors.border)
    root.style.setProperty('--color-border', colors.border)

    // Semantic colors
    root.style.setProperty('--theme-primary', colors.primary)
    root.style.setProperty('--color-primary', colors.primary)

    root.style.setProperty('--theme-success', colors.success)
    root.style.setProperty('--color-success', colors.success)

    root.style.setProperty('--theme-warning', colors.warning)
    root.style.setProperty('--color-warning', colors.warning)

    root.style.setProperty('--theme-danger', colors.danger)
    root.style.setProperty('--color-danger', colors.danger)

    root.style.setProperty('--theme-info', colors.info)
    root.style.setProperty('--color-info', colors.info)

    // Battle & Game Effects
    root.style.setProperty('--theme-critical', colors.critical)
    root.style.setProperty('--theme-super-effective', colors.superEffective)
    root.style.setProperty('--theme-not-effective', colors.notEffective)
    root.style.setProperty('--theme-immune', colors.immune)
    root.style.setProperty('--theme-heal', colors.heal)
    root.style.setProperty('--theme-dodge', colors.dodge)
    root.style.setProperty('--theme-block', colors.block)

    // Status Conditions
    root.style.setProperty('--theme-burn', colors.burn)
    root.style.setProperty('--theme-poison', colors.poison)
    root.style.setProperty('--theme-paralysis', colors.paralysis)
    root.style.setProperty('--theme-freeze', colors.freeze)
    root.style.setProperty('--theme-sleep', colors.sleep)

    // Super Gauge
    root.style.setProperty('--theme-gauge-empty', colors.gaugeEmpty)
    root.style.setProperty('--theme-gauge-filling', colors.gaugeFilling)
    root.style.setProperty('--theme-gauge-full', colors.gaugeFull)

    // Apply type colors
    Object.entries(colors.typeColors).forEach(([type, color]) => {
      root.style.setProperty(`--theme-type-${type}`, color)
      root.style.setProperty(`--type-${type}`, color)
    })

    // Apply special colors
    if (colors.accent) {
      root.style.setProperty('--theme-accent', colors.accent)
      root.style.setProperty('--color-accent', colors.accent)
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
