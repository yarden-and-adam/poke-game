import { themeRegistry } from './registry'
import { lightTheme, darkTheme, hanukkahTheme, christmasTheme, halloweenTheme } from './configs'

// Initialize the theme registry with all available themes
export function initializeThemes() {
  // Register base themes
  themeRegistry.register(lightTheme)
  themeRegistry.register(darkTheme)
  
  // Register seasonal themes
  themeRegistry.register(hanukkahTheme)
  themeRegistry.register(christmasTheme)
  themeRegistry.register(halloweenTheme)
  
  // Set default theme
  const savedTheme = localStorage.getItem('theme')
  const autoTheme = themeRegistry.getAutoTheme()
  
  if (savedTheme && themeRegistry.getTheme(savedTheme)) {
    themeRegistry.setActiveTheme(savedTheme)
  } else if (autoTheme) {
    themeRegistry.setActiveTheme(autoTheme)
    localStorage.setItem('theme', autoTheme)
  } else {
    themeRegistry.setActiveTheme('dark')
    localStorage.setItem('theme', 'dark')
  }
}

// Export the registry for use in components
export { themeRegistry }