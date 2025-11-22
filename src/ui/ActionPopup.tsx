import React, { useEffect, useState } from 'react'

interface ActionPopupProps {
    message: string
    type: 'critical' | 'effective' | 'block' | 'dodge' | 'heal'
    onComplete: () => void
}

export default function ActionPopup({ message, type, onComplete }: ActionPopupProps) {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false)
            setTimeout(onComplete, 300) // Wait for fade out
        }, 1500)
        return () => clearTimeout(timer)
    }, [onComplete])

    return (
        <div className={`action-popup type-${type} ${visible ? 'visible' : 'hiding'}`}>
            <span className="popup-text">{message}</span>
        </div>
    )
}
