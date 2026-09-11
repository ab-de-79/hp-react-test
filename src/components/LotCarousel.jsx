import { useEffect, useRef, useState } from 'react'
import './LotCarousel.css'
import lot01 from '../assets/Lot_01.png'
import lot02 from '../assets/Lot_02.png'
import lot03 from '../assets/Lot_03.png'
import lot04 from '../assets/Lot_04.png'

const lots = [
  {
    id: 1,
    image: lot01,
    maker: 'Bernardo Bellotto (Venice 1722-1780 Warsaw)',
    title: 'Venice, the Bacino di San Marco from the Canale della Giudecca',
    estimate: 'GBP 4,000,000 - GBP 6,000,000',
  },
  {
    id: 2,
    image: lot02,
    maker: 'Rolex. A sporty stainless steel automatic wristwatch',
    title: "GMT-Master II 'Batman' model, reference 116710BLNR",
    estimate: 'USD 8,000 - USD 12,000',
  },
  {
    id: 3,
    image: lot03,
    maker: 'François-Xavier Lalanne (1927-2008)',
    title: "An Important Set of Four 'Grenouille' Fountain Sculptures",
    estimate: 'USD 2,500,000 - USD 3,500,000',
  },
  {
    id: 4,
    image: lot04,
    maker: 'Anastasia Levedev',
    title: 'From Eden',
    estimate: 'GBP 300 - GBP 500',
  },
]

function ArrowIcon({ direction = 'right' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={direction === 'left' ? 'M21 12H3m9-9-9 9 9 9' : 'M3 12h18M12 3l9 9-9 9'} />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.8 5.8a5.4 5.4 0 0 0-7.6 0L12 7l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 22l8.8-8.6a5.4 5.4 0 0 0 0-7.6Z" />
    </svg>
  )
}

function LotCarousel() {
  const carousel = useRef(null)
  const [progress, setProgress] = useState(0)
  const [canScroll, setCanScroll] = useState(false)

  useEffect(() => {
    const element = carousel.current
    if (!element) return undefined

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
  }, [])

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
    <section className="lot-carousel-section" aria-labelledby="lot-carousel-heading">
      <header className="lot-carousel-section__header">
        <h2 id="lot-carousel-heading">Recommended lots</h2>
        <a href="#lots">
          <span>View all lots</span>
          <ArrowIcon />
        </a>
      </header>

      <div className="lot-carousel" id="lots" ref={carousel} role="list" aria-label="Recommended lots">
        {lots.map((lot) => (
          <article className="lot-card" role="listitem" key={lot.id}>
            <button className="lot-card__favorite" type="button" aria-label={`Save ${lot.maker}`}>
              <HeartIcon />
            </button>
            <div className="lot-card__image">
              <img src={lot.image} alt="" />
            </div>
            <div className="lot-card__copy">
              <h3>{lot.maker}</h3>
              <p className="lot-card__title">{lot.title}</p>
              <div className="lot-card__estimate">
                <span>Estimate</span>
                <p>{lot.estimate}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="lot-carousel-section__controls">
        <div className="lot-carousel-section__progress" aria-hidden="true">
          <span style={{ width: canScroll ? `${20 + progress * 30}%` : '50%' }} />
        </div>
        <div className="lot-carousel-section__arrows">
          <button onClick={() => scroll(-1)} disabled={!canScroll || progress <= 0.001} aria-label="Previous lots">
            <ArrowIcon direction="left" />
          </button>
          <button onClick={() => scroll(1)} disabled={!canScroll || progress >= 0.999} aria-label="Next lots">
            <ArrowIcon />
          </button>
        </div>
      </div>
    </section>
  )
}

export default LotCarousel
