import React, { useEffect, useState } from 'react'

interface ThemeEffectsProps {
  themeId: string
}

export default function ThemeEffects({ themeId }: ThemeEffectsProps) {
  const [effects, setEffects] = useState<JSX.Element[]>([])

  useEffect(() => {
    const newEffects: JSX.Element[] = []

    switch (themeId) {
      case 'christmas':
        // Create snowflakes
        for (let i = 0; i < 30; i++) {
          newEffects.push(
            <div
              key={`snow-${i}`}
              className="snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`,
                fontSize: `${Math.random() * 0.8 + 0.8}em`
              }}
            >
              ❄
            </div>
          )
        }
        break

      case 'hanukkah':
        // Create enhanced menorah with candles
        const shamash = (
          <div key="shamash" className="menorah-candle" style={{ height: '35px' }}>
            <div className="menorah-flame"></div>
          </div>
        )
        
        const candles = []
        for (let i = 0; i < 8; i++) {
          candles.push(
            <div key={`candle-${i}`} className="menorah-candle">
              <div className="menorah-flame"></div>
            </div>
          )
        }
        newEffects.push(
          <div key="menorah" className="menorah-container">
            {candles.slice(0, 4)}
            {shamash}
            {candles.slice(4)}
          </div>
        )
        
        // Add spinning dreidels
        for (let i = 0; i < 3; i++) {
          newEffects.push(
            <div
              key={`dreidel-${i}`}
              className="dreidel"
              style={{
                left: `${Math.random() * 90 + 5}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${Math.random() * 2 + 3}s`
              }}
            >
              נ
            </div>
          )
        }
        
        // Add star sparkles
        for (let i = 0; i < 8; i++) {
          newEffects.push(
            <div
              key={`star-${i}`}
              className="star-sparkle"
              style={{
                left: `${Math.random() * 95 + 2.5}%`,
                top: `${Math.random() * 80 + 10}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`
              }}
            >
              ✡
            </div>
          )
        }
        
        // Add floating gelt coins
        for (let i = 0; i < 5; i++) {
          newEffects.push(
            <div
              key={`gelt-${i}`}
              className="gelt-coin"
              style={{
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 70 + 15}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${Math.random() * 3 + 6}s`
              }}
            />
          )
        }
        break

      case 'halloween':
        // Create pumpkins
        for (let i = 0; i < 8; i++) {
          newEffects.push(
            <div
              key={`pumpkin-${i}`}
              className="pumpkin"
              style={{
                left: `${Math.random() * 90 + 5}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${Math.random() * 3 + 5}s`
              }}
            >
              🎃
            </div>
          )
        }
        
        // Create spiders
        for (let i = 0; i < 5; i++) {
          newEffects.push(
            <div
              key={`spider-${i}`}
              className="spider"
              style={{
                left: `${Math.random() * 90 + 5}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${Math.random() * 4 + 6}s`
              }}
            >
              🕷️
            </div>
          )
        }
        break

      case 'autumn':
        // Create falling leaves
        const leafEmojis = ['🍂', '🍁', '🍃', '🪶']
        for (let i = 0; i < 15; i++) {
          newEffects.push(
            <div
              key={`leaf-${i}`}
              className="leaf"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 5 + 8}s`
              }}
            >
              {leafEmojis[Math.floor(Math.random() * leafEmojis.length)]}
            </div>
          )
        }
        break
    }

    setEffects(newEffects)
  }, [themeId])

  if (effects.length === 0) return null

  const containerClass = 
    themeId === 'christmas' ? 'snow-container' :
    themeId === 'halloween' ? 'halloween-container' :
    themeId === 'autumn' ? 'leaves-container' :
    themeId === 'hanukkah' ? 'dreidel-container' : ''

  return <div className={containerClass}>{effects}</div>
}