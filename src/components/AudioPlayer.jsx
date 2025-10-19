import { useState, useEffect, useRef } from 'react'

function AudioPlayer({ isFired }) {
    const [isMuted, setIsMuted] = useState(false)
    const [hasUserInteracted, setHasUserInteracted] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef(null)

    // Audio file paths
    const audioFiles = {
        notFired: '/audio/not-fired.mp3',
        fired: '/audio/fired.mp3'
    }

    // Initialize audio on mount
    useEffect(() => {
        if (audioRef.current) {
            const currentSrc = isFired ? audioFiles.fired : audioFiles.notFired
            audioRef.current.src = currentSrc
            audioRef.current.loop = true
            audioRef.current.load()
        }
    }, []) // Run only on mount

    // Handle user interaction to enable audio
    const handleUserInteraction = async () => {
        if (!hasUserInteracted && audioRef.current) {
            setHasUserInteracted(true)
            try {
                // If fired state, start at 9 seconds
                if (isFired) {
                    audioRef.current.currentTime = 9
                }
                await audioRef.current.play()
                setIsPlaying(true)
                console.log(`Audio started playing after user interaction${isFired ? ' at 9 seconds' : ''}`)
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

            // Auto-play the new track
            audioRef.current.play().then(() => {
                // If switching to fired track, start at 9 seconds
                if (isFired) {
                    audioRef.current.currentTime = 9
                    console.log('Audio switched to fired track, starting at 9 seconds')
                } else {
                    console.log('Audio switched to not-fired track')
                }
            }).catch(console.error)
        }
    }, [isFired, hasUserInteracted])

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }

    // Handle audio events
    const handleAudioPlay = () => {
        setIsPlaying(true)
        console.log('Audio play event fired')
    }
    const handleAudioPause = () => {
        setIsPlaying(false)
        console.log('Audio pause event fired')
    }
    const handleAudioError = (e) => {
        console.error('Audio error:', e)
        console.error('Audio error details:', e.target.error)
    }
    const handleAudioLoadStart = () => {
        console.log('Audio load started')
    }
    const handleAudioCanPlay = () => {
        console.log('Audio can play')
    }

    return (
        <div className="audio-player">
            <audio
                ref={audioRef}
                preload="auto"
                loop
                onPlay={handleAudioPlay}
                onPause={handleAudioPause}
                onError={handleAudioError}
                onLoadStart={handleAudioLoadStart}
                onCanPlay={handleAudioCanPlay}
                style={{ display: 'none' }}
            >
                <source src={isFired ? audioFiles.fired : audioFiles.notFired} type="audio/mpeg" />
            </audio>

            <div className="audio-controls">
                {!hasUserInteracted ? (
                    <button
                        className="audio-button play"
                        onClick={handleUserInteraction}
                        title={isFired ? "Click to start music at 9 seconds" : "Click to enable audio"}
                    >
                        {isFired ? "🎵 Start Music" : "▶️"}
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
