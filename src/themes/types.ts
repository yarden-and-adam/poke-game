export interface ThemeColors {
  // Base colors
  background: string
  surface: string
  card: string
  text: string
  textSecondary: string
  border: string
  
  // Semantic colors
  primary: string
  success: string
  warning: string
  danger: string
  info: string
  
  // Pokémon type colors (can be overridden per theme)
  typeColors: Record<string, string>
  
  // Special theme colors
  accent?: string
  festive?: string
}

export interface ThemeAnimations {
  buttonHover?: string
  cardGlow?: string
  specialEffects?: string
}

export interface ThemeSeasonal {
  startDate?: string
  endDate?: string
  autoActivate?: boolean
}

export type ThemeCategory = 'base' | 'seasonal' | 'event' | 'custom'

export interface ThemeConfig {
  id: string
  name: string
  description: string
  category: ThemeCategory
  colors: ThemeColors
  customCSS?: string
  animations?: ThemeAnimations
  seasonal?: ThemeSeasonal
}

export interface ThemeRegistry {
  themes: Map<string, ThemeConfig>
  activeTheme: string
  register(theme: ThemeConfig): void
  unregister(themeId: string): void
  getTheme(id: string): ThemeConfig | undefined
  getAllThemes(): ThemeConfig[]
  getSeasonalThemes(): ThemeConfig[]
  getActiveTheme(): ThemeConfig
  setActiveTheme(id: string): void
  getAutoTheme(): string | null
}