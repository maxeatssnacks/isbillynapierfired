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
            
            // If fired state, try to auto-play immediately
            if (isFired) {
                setHasUserInteracted(true)
                audioRef.current.play().then(() => {
                    setIsPlaying(true)
                    console.log('Audio started playing automatically')
                }).catch((error) => {
                    console.error('Auto-play failed:', error)
                    setHasUserInteracted(false)
                })
            }
        }
    }, []) // Run only on mount

    // Handle user interaction to enable audio
    const handleUserInteraction = async () => {
        if (!hasUserInteracted && audioRef.current) {
            setHasUserInteracted(true)
            try {
                await audioRef.current.play()
                setIsPlaying(true)
                console.log('Audio started playing after user interaction')
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
                console.log('Audio switched and playing')
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
            
            {/* Debug info - remove this later */}
            <div style={{ 
                position: 'fixed', 
                top: '10px', 
                right: '10px', 
                background: 'rgba(0,0,0,0.8)', 
                color: 'white', 
                padding: '10px', 
                fontSize: '12px',
                zIndex: 1000
            }}>
                <div>isFired: {isFired.toString()}</div>
                <div>hasUserInteracted: {hasUserInteracted.toString()}</div>
                <div>isPlaying: {isPlaying.toString()}</div>
                <div>isMuted: {isMuted.toString()}</div>
                <div>Audio src: {isFired ? audioFiles.fired : audioFiles.notFired}</div>
            </div>
        </div>
    )
}

export default AudioPlayer
