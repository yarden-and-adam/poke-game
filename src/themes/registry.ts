import { ThemeConfig, ThemeRegistry } from './types'

export class ThemeRegistryImpl implements ThemeRegistry {
  public themes: Map<string, ThemeConfig> = new Map()
  public activeTheme: string = 'dark'

  register(theme: ThemeConfig): void {
    this.themes.set(theme.id, theme)
  }

  unregister(themeId: string): void {
    this.themes.delete(themeId)
  }

  getTheme(id: string): ThemeConfig | undefined {
    return this.themes.get(id)
  }

  getAllThemes(): ThemeConfig[] {
    return Array.from(this.themes.values())
  }

  getSeasonalThemes(): ThemeConfig[] {
    return this.getAllThemes().filter(theme => theme.category === 'seasonal')
  }

  getActiveTheme(): ThemeConfig {
    const theme = this.themes.get(this.activeTheme)
    if (!theme) {
      throw new Error(`Active theme '${this.activeTheme}' not found`)
    }
    return theme
  }

  setActiveTheme(id: string): void {
    if (!this.themes.has(id)) {
      throw new Error(`Theme '${id}' not found`)
    }
    this.activeTheme = id
  }

  getAutoTheme(): string | null {
    const now = new Date()
    const currentYear = now.getFullYear()
    
    for (const theme of this.getSeasonalThemes()) {
      if (theme.seasonal?.autoActivate && theme.seasonal.startDate && theme.seasonal.endDate) {
        const startDate = new Date(theme.seasonal.startDate.includes('-') 
          ? theme.seasonal.startDate 
          : `${currentYear}-${theme.seasonal.startDate}`)
        const endDate = new Date(theme.seasonal.endDate.includes('-') 
          ? theme.seasonal.endDate 
          : `${currentYear}-${theme.seasonal.endDate}`)
        
        if (now >= startDate && now <= endDate) {
          return theme.id
        }
      }
    }
    return null
  }
}

// Singleton instance
export const themeRegistry = new ThemeRegistryImpl()