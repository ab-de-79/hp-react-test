import { useEffect, useRef, useState } from 'react'
import './App.css'
import categoryImage from './assets/category-1.png'

const categories = Array.from({ length: 5 }, (_, id) => ({ id, name: 'Category' }))

function Arrow({ direction = 'right' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={direction === 'left' ? 'M21 12H3m9-9-9 9 9 9' : 'M3 12h18M12 3l9 9-9 9'} />
    </svg>
  )
}

function App() {
  const carousel = useRef(null)
  const [progress, setProgress] = useState(0)
  const [canScroll, setCanScroll] = useState(false)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const element = carousel.current
    const update = () => {
      const max = element.scrollWidth - element.clientWidth
      setCanScroll(max > 1)
      setProgress(max > 1 ? Math.min(1, Math.max(0, element.scrollLeft / max)) : 0)
    }
    const observer = new ResizeObserver(update)
    observer.observe(element)
    element.addEventListener('scroll', update, { passive: true })
    update()
    return () => {
      observer.disconnect()
      element.removeEventListener('scroll', update)
    }
  }, [showAll])

  function scroll(direction) {
    const element = carousel.current
    const card = element.firstElementChild
    const gap = parseFloat(getComputedStyle(element).columnGap)
    element.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
  }

  return (
    <main className="page">
      <section className={`category-section${showAll ? ' category-section--expanded' : ''}`} aria-labelledby="category-heading">
        <header className="category-header">
          <h1 id="category-heading">Browse <span className="desktop-copy">categories</span><span className="mobile-copy">Categories</span></h1>
          <button className="category-cta" onClick={() => setShowAll(!showAll)} aria-expanded={showAll} aria-controls="categories">
            <span className="desktop-copy">{showAll ? 'Show fewer categories' : 'View all categories'}</span>
            <span className="mobile-copy">{showAll ? 'Show less' : 'View all'}</span>
            <Arrow />
          </button>
        </header>

        <div className="category-carousel" id="categories" ref={carousel} role="list" aria-label="Categories" tabIndex={canScroll ? 0 : undefined}>
          {categories.map(({ id, name }) => (
            <article className="category-card" key={id} role="listitem">
              <img src={categoryImage} alt="Emerald and diamond floral jewellery on a pink background" />
              <p>{name}</p>
            </article>
          ))}
        </div>

        <div className="category-controls">
          <div className="category-progress" aria-hidden="true">
            <span style={{ left: `${progress * (100 - 100 / 7)}%` }} />
          </div>
          <div className="category-arrows">
            <button onClick={() => scroll(-1)} disabled={!canScroll || progress <= 0.001} aria-label="Previous categories" aria-controls="categories"><Arrow direction="left" /></button>
            <button onClick={() => scroll(1)} disabled={!canScroll || progress >= 0.999} aria-label="Next categories" aria-controls="categories"><Arrow /></button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
