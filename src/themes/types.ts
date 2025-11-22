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

  // Battle & Game Effects
  critical: string        // Critical hit color
  superEffective: string  // Super effective attack
  notEffective: string    // Not very effective
  immune: string          // Immune/no effect
  heal: string           // Healing effects
  dodge: string          // Dodge/miss effects
  block: string          // Block/defend effects

  // Status Conditions
  burn: string
  poison: string
  paralysis: string
  freeze: string
  sleep: string

  // Super Gauge
  gaugeEmpty: string
  gaugeFilling: string
  gaugeFull: string

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