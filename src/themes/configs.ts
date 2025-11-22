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
  name: 'Light',
  description: 'Clean and bright light theme',
  category: 'base',
  colors: {
    background: '#f8f9fa',
    surface: '#ffffff',
    card: '#ffffff',
    text: '#212529',
    textSecondary: '#6c757d',
    border: '#dee2e6',
    
    primary: '#667eea',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    info: '#17a2b8',
    
    typeColors: { ...baseTypeColors },
    
    accent: '#667eea'
  }
}

export const darkTheme: ThemeConfig = {
  id: 'dark',
  name: 'Dark',
  description: 'Dark theme with purple accents',
  category: 'base',
  colors: {
    background: '#0f0f0f',
    surface: '#1a1a1a',
    card: '#242424',
    text: '#f8f9fa',
    textSecondary: '#d1d5db',
    border: '#404040',
    
    primary: '#8b5cf6',
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#f87171',
    info: '#60a5fa',
    
    typeColors: { ...baseTypeColors },
    
    accent: '#8b5cf6'
  }
}

export const hanukkahTheme: ThemeConfig = {
  id: 'hanukkah',
  name: 'Hanukkah',
  description: 'Festival of Lights theme with blue and silver colors',
  category: 'seasonal',
  colors: {
    background: '#0a1929',
    surface: '#1e3a5f',
    card: '#2d4a7c',
    text: '#e8f4fd',
    textSecondary: '#b8d4f1',
    border: '#4a7ba7',
    
    primary: '#6495ed',
    success: '#90ee90',
    warning: '#ffd700',
    danger: '#dc143c',
    info: '#87ceeb',
    
    typeColors: {
      ...baseTypeColors,
      fire: '#ff8c69', // Warmer fire for contrast
      water: '#4dabf7', // Brighter blue
      grass: '#51cf66', // Brighter green
      electric: '#ffd43b', // Brighter yellow
      ice: '#74c0fc', // Lighter ice
    },
    
    accent: '#c0c0c0', // Silver
    festive: '#ffd700', // Gold
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
  name: 'Christmas',
  description: 'Holiday theme with red, green, and gold colors',
  category: 'seasonal',
  colors: {
    background: '#0f4c2a',
    surface: '#1a5c3a',
    card: '#2d6a4f',
    text: '#f0f8f0',
    textSecondary: '#b8d4b8',
    border: '#4a7c59',
    
    primary: '#dc143c',
    success: '#228b22',
    warning: '#ffd700',
    danger: '#8b0000',
    info: '#4682b4',
    
    typeColors: {
      ...baseTypeColors,
      grass: '#228b22', // Christmas green
      ice: '#f0f8ff', // Snow white
      fire: '#dc143c', // Christmas red
      water: '#4682b4', // Steel blue
    },
    
    accent: '#ffd700', // Gold
    festive: '#dc143c', // Christmas red
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
  name: 'Halloween',
  description: 'Spooky theme with orange, black, and purple colors',
  category: 'seasonal',
  colors: {
    background: '#1a0033',
    surface: '#2d1a4d',
    card: '#402966',
    text: '#f0e6ff',
    textSecondary: '#b8a3d9',
    border: '#6b46c1',
    
    primary: '#ff6b35',
    success: '#9333ea',
    warning: '#f59e0b',
    danger: '#dc2626',
    info: '#8b5cf6',
    
    typeColors: {
      ...baseTypeColors,
      ghost: '#9333ea', // Brighter purple
      dark: '#1f2937', // Darker
      poison: '#a855f7', // Brighter poison
      psychic: '#ec4899', // Brighter psychic
      fire: '#ff6b35', // Orange fire
    },
    
    accent: '#ff6b35', // Orange
    festive: '#9333ea', // Purple
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