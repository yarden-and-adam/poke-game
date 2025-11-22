import { ThemeConfig } from './types'

// Base Pokémon type colors (high contrast)
const baseTypeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC'
}

export const lightTheme: ThemeConfig = {
  id: 'light',
  name: 'Daylight',
  description: 'Bright and energetic',
  category: 'base',
  colors: {
    background: '#e0e7ff',
    surface: '#f8fafc',
    card: '#ffffff',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#cbd5e1',

    primary: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',

    // Battle & Game Effects
    critical: '#dc2626',
    superEffective: '#10b981',
    notEffective: '#94a3b8',
    immune: '#71717a',
    heal: '#22c55e',
    dodge: '#3b82f6',
    block: '#9ca3af',

    // Status Conditions
    burn: '#f97316',
    poison: '#a855f7',
    paralysis: '#fbbf24',
    freeze: '#06b6d4',
    sleep: '#64748b',

    // Super Gauge
    gaugeEmpty: '#cbd5e1',
    gaugeFilling: '#fbbf24',
    gaugeFull: '#dc2626',

    typeColors: { ...baseTypeColors },

    accent: '#ec4899'
  }
}

export const darkTheme: ThemeConfig = {
  id: 'dark',
  name: 'Midnight',
  description: 'Deep and mysterious',
  category: 'base',
  colors: {
    background: '#1e293b',
    surface: '#334155',
    card: '#475569',
    text: '#ffffff',
    textSecondary: '#e2e8f0',
    border: '#64748b',

    primary: '#818cf8',
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#fb7185',
    info: '#22d3ee',

    // Battle & Game Effects
    critical: '#f43f5e',
    superEffective: '#4ade80',
    notEffective: '#94a3b8',
    immune: '#71717a',
    heal: '#34d399',
    dodge: '#60a5fa',
    block: '#9ca3af',

    // Status Conditions
    burn: '#fb923c',
    poison: '#c084fc',
    paralysis: '#fde047',
    freeze: '#22d3ee',
    sleep: '#94a3b8',

    // Super Gauge
    gaugeEmpty: '#475569',
    gaugeFilling: '#fbbf24',
    gaugeFull: '#f43f5e',

    typeColors: { ...baseTypeColors },

    accent: '#c084fc'
  }
}

export const hanukkahTheme: ThemeConfig = {
  id: 'hanukkah',
  name: 'Festival of Lights',
  description: 'Glowing blue and silver',
  category: 'seasonal',
  colors: {
    background: '#082f49',
    surface: '#0c4a6e',
    card: '#075985',
    text: '#f0f9ff',
    textSecondary: '#bae6fd',
    border: '#0ea5e9',

    primary: '#38bdf8',
    success: '#4ade80',
    warning: '#fcd34d',
    danger: '#f87171',
    info: '#7dd3fc',

    // Battle & Game Effects
    critical: '#fcd34d',
    superEffective: '#7dd3fc',
    notEffective: '#0c4a6e',
    immune: '#082f49',
    heal: '#bae6fd',
    dodge: '#38bdf8',
    block: '#e0f2fe',

    // Status Conditions
    burn: '#fbbf24',
    poison: '#a78bfa',
    paralysis: '#fde047',
    freeze: '#7dd3fc',
    sleep: '#64748b',

    // Super Gauge
    gaugeEmpty: '#0c4a6e',
    gaugeFilling: '#38bdf8',
    gaugeFull: '#fcd34d',

    typeColors: {
      ...baseTypeColors,
      fire: '#fbbf24',
      water: '#38bdf8',
      electric: '#fcd34d',
      ice: '#e0f2fe',
    },

    accent: '#e0f2fe',
    festive: '#fcd34d',
  },
  animations: {
    buttonHover: 'glow-blue',
    cardGlow: 'subtle-sparkle',
    specialEffects: 'menorah-flicker'
  },
  seasonal: {
    startDate: '2024-12-25',
    endDate: '2025-01-02',
    autoActivate: true
  }
}

export const christmasTheme: ThemeConfig = {
  id: 'christmas',
  name: 'Holiday Cheer',
  description: 'Festive red and green',
  category: 'seasonal',
  colors: {
    background: '#14532d',
    surface: '#166534',
    card: '#15803d',
    text: '#f0fdf4',
    textSecondary: '#bbf7d0',
    border: '#22c55e',

    primary: '#dc2626',
    success: '#22c55e',
    warning: '#fbbf24',
    danger: '#dc2626',
    info: '#3b82f6',

    // Battle & Game Effects
    critical: '#dc2626',
    superEffective: '#4ade80',
    notEffective: '#166534',
    immune: '#14532d',
    heal: '#a7f3d0',
    dodge: '#60a5fa',
    block: '#d1fae5',

    // Status Conditions
    burn: '#f97316',
    poison: '#a855f7',
    paralysis: '#fde047',
    freeze: '#7dd3fc',
    sleep: '#6b7280',

    // Super Gauge
    gaugeEmpty: '#166534',
    gaugeFilling: '#fbbf24',
    gaugeFull: '#dc2626',

    typeColors: {
      ...baseTypeColors,
      grass: '#22c55e',
      ice: '#dbeafe',
      fire: '#dc2626',
      water: '#60a5fa',
    },

    accent: '#fbbf24',
    festive: '#dc2626',
  },
  animations: {
    buttonHover: 'glow-red',
    cardGlow: 'snow-glow',
    specialEffects: 'snow-fall'
  },
  seasonal: {
    startDate: '12-01',
    endDate: '12-31',
    autoActivate: true
  }
}

export const halloweenTheme: ThemeConfig = {
  id: 'halloween',
  name: 'Spooky Night',
  description: 'Eerie purple and orange',
  category: 'seasonal',
  colors: {
    background: '#3b0764',
    surface: '#581c87',
    card: '#6b21a8',
    text: '#faf5ff',
    textSecondary: '#e9d5ff',
    border: '#a855f7',

    primary: '#fb923c',
    success: '#a855f7',
    warning: '#fbbf24',
    danger: '#f43f5e',
    info: '#c084fc',

    // Battle & Game Effects
    critical: '#fb923c',
    superEffective: '#c084fc',
    notEffective: '#581c87',
    immune: '#3b0764',
    heal: '#e879f9',
    dodge: '#818cf8',
    block: '#d8b4fe',

    // Status Conditions
    burn: '#f97316',
    poison: '#e879f9',
    paralysis: '#fde047',
    freeze: '#60a5fa',
    sleep: '#71717a',

    // Super Gauge
    gaugeEmpty: '#581c87',
    gaugeFilling: '#fb923c',
    gaugeFull: '#c084fc',

    typeColors: {
      ...baseTypeColors,
      ghost: '#c084fc',
      dark: '#27272a',
      poison: '#e879f9',
      psychic: '#f0abfc',
      fire: '#fb923c',
    },

    accent: '#fb923c',
    festive: '#c084fc',
  },
  animations: {
    buttonHover: 'glow-orange',
    cardGlow: 'spooky-glow',
    specialEffects: 'bat-swarm'
  },
  seasonal: {
    startDate: '10-01',
    endDate: '10-31',
    autoActivate: true
  }
}