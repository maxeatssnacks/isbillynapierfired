import { useState, useEffect, useRef } from 'react'

function AudioPlayer({ isFired }) {
    const [isMuted, setIsMuted] = useState(false)
    const [hasUserInteracted, setHasUserInteracted] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef(null)

    // Audio file paths - you'll need to add these files to public/audio/
    const audioFiles = {
        notFired: '/audio/not-fired.mp3', // Add your "not fired" track here
        fired: '/audio/fired.mp3'         // Add your "fired" track here
    }

    // Auto-play on mount if fired state
    useEffect(() => {
        if (isFired && audioRef.current) {
            setHasUserInteracted(true)
            audioRef.current.loop = true
            audioRef.current.src = audioFiles.fired
            audioRef.current.load()
            
            // Try to auto-play immediately
            audioRef.current.play().then(() => {
                setIsPlaying(true)
            }).catch((error) => {
                console.error('Auto-play failed:', error)
                // If auto-play fails, show play button
                setHasUserInteracted(false)
            })
        }
    }, [isFired])

    // Handle user interaction to enable audio (for not-fired state or if auto-play failed)
    const handleUserInteraction = async () => {
        if (!hasUserInteracted && audioRef.current) {
            setHasUserInteracted(true)
            audioRef.current.loop = true
            try {
                await audioRef.current.play()
                setIsPlaying(true)
            } catch (error) {
                console.error('Audio play failed:', error)
            }
        }
    }

    // Switch audio source when isFired state changes
    useEffect(() => {
        if (audioRef.current && hasUserInteracted) {
            const newSrc = isFired ? audioFiles.fired : audioFiles.notFired
            audioRef.current.src = newSrc
            audioRef.current.loop = true
            audioRef.current.load()

            // Auto-play the new track if user has interacted
            audioRef.current.play().catch(console.error)
        }
    }, [isFired, hasUserInteracted])

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }

    // Handle audio events
    const handleAudioPlay = () => setIsPlaying(true)
    const handleAudioPause = () => setIsPlaying(false)

    return (
        <div className="audio-player">
            <audio
                ref={audioRef}
                preload="auto"
                loop
                onPlay={handleAudioPlay}
                onPause={handleAudioPause}
                onError={(e) => console.error('Audio error:', e)}
            >
                <source src={isFired ? audioFiles.fired : audioFiles.notFired} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>

            <div className="audio-controls">
                {!hasUserInteracted && !isFired ? (
                    <button
                        className="audio-button play"
                        onClick={handleUserInteraction}
                        title="Click to enable audio"
                    >
                        ▶️
                    </button>
                ) : (
                    <button
                        className="audio-button mute"
                        onClick={toggleMute}
                        title={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? '🔇' : '🔊'}
                    </button>
                )}
            </div>
        </div>
    )
}

export default AudioPlayer
