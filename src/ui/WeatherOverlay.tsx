import React from 'react'
import { Weather } from '../types'

interface WeatherOverlayProps {
    weather: Weather
}

export default function WeatherOverlay({ weather }: WeatherOverlayProps) {
    if (weather === 'clear') return null

    return (
        <div className={`weather-overlay weather-${weather}`}>
            {weather === 'rainy' && (
                <div className="rain-container">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="rain-drop" style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 1}s`,
                            animationDuration: `${0.5 + Math.random() * 0.5}s`
                        }} />
                    ))}
                </div>
            )}
            {weather === 'sunny' && (
                <div className="sun-container">
                    <div className="sun-rays" />
                    <div className="sun-glare" />
                </div>
            )}
            {weather === 'stormy' && (
                <div className="storm-container">
                    <div className="rain-container">
                        {Array.from({ length: 30 }).map((_, i) => (
                            <div key={i} className="rain-drop storm-drop" style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 0.5}s`
                            }} />
                        ))}
                    </div>
                    <div className="lightning-flash" />
                </div>
            )}
        </div>
    )
}
