import { useState, useEffect } from 'react'

function App() {
  const [isFired, setIsFired] = useState(false)
  const [viewCount, setViewCount] = useState(0)

  // Load and increment view count on component mount
  useEffect(() => {
    const incrementViewCount = async () => {
      try {
        // First get current count
        const getResponse = await fetch('/api/view-counter')
        const getData = await getResponse.json()
        setViewCount(getData.count)

        // Then increment it
        const postResponse = await fetch('/api/view-counter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const postData = await postResponse.json()
        setViewCount(postData.count)
      } catch (error) {
        console.error('Error updating view count:', error)
        // Fallback to localStorage if API fails
        const currentCount = parseInt(localStorage.getItem('viewCount') || '0')
        const newCount = currentCount + 1
        setViewCount(newCount)
        localStorage.setItem('viewCount', newCount.toString())
      }
    }

    incrementViewCount()
  }, [])

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: isFired ? 'url(/images/background-fired.jpg)' : 'url(/images/background.webp)'
      }}
    >
      {/* Semi-transparent overlay for better text readability */}
      <div className="overlay"></div>

      {/* Buy me a beer link - top right */}
      <a
        href="https://buymeacoffee.com/maxeatssnacks"
        target="_blank"
        rel="noopener noreferrer"
        className="buy-beer-link"
      >
        <div className="beer-button-content">
          <div className="beer-main-text">🍺 Buy Me A Beer</div>
          <div className="beer-subtext">(I drank all mine watching this offense)</div>
        </div>
      </a>

      {/* Main content */}
      <div className="main-content">
        {/* Title */}
        <h1 className="title">
          Is Billy Napier fired yet?
        </h1>

        {/* Image - replace with your actual images */}
        <div className="image-container">
          {isFired ? (
            <img
              src="/images/fired.jpg"
              alt="Billy Napier fired"
              className="image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : (
            <img
              src="/images/not-fired.jpg"
              alt="Billy Napier not fired"
              className="image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          )}
          {/* Fallback placeholder if image fails to load */}
          <div
            className="image-placeholder"
            style={{ display: 'none' }}
          >
            <span>
              {isFired ? 'Fired Image' : 'Not Fired Image'}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="status">
          {isFired ? 'Yes.' : 'No.'}
        </div>
      </div>

      {/* View counter - bottom right */}
      <div className="view-counter">
        Sun Belt Billy Haters: {viewCount.toLocaleString()}
      </div>

    </div>
  )
}

export default App