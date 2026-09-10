import { useEffect, useRef, useState } from 'react'
import './HeroCarousel.css'
import hiroshigeImage from '../assets/hiroshige.png'

const slides = [
  {
    id: 1,
    label: 'Happening today',
    title: 'Hiroshige: Colors of the Four Seasons | The Alan Medaugh Collection',
    description:
      "Featuring important landscapes, bird-and-flower prints, fan prints, as well as Hiroshige's paintings and sketches.",
    date: '10 September',
    location: 'New York',
    image: hiroshigeImage,
    alt: 'Utagawa Hiroshige woodblock print of cherry blossoms at Arashiyama with a raft on blue water',
  },
  {
    id: 2,
    label: 'Happening today',
    title: 'Hiroshige: Colors of the Four Seasons | The Alan Medaugh Collection',
    description:
      "Featuring important landscapes, bird-and-flower prints, fan prints, as well as Hiroshige's paintings and sketches.",
    date: '10 September',
    location: 'New York',
    image: hiroshigeImage,
    alt: 'Utagawa Hiroshige woodblock print of cherry blossoms at Arashiyama with a raft on blue water',
  },
  {
    id: 3,
    label: 'Happening today',
    title: 'Hiroshige: Colors of the Four Seasons | The Alan Medaugh Collection',
    description:
      "Featuring important landscapes, bird-and-flower prints, fan prints, as well as Hiroshige's paintings and sketches.",
    date: '10 September',
    location: 'New York',
    image: hiroshigeImage,
    alt: 'Utagawa Hiroshige woodblock print of cherry blossoms at Arashiyama with a raft on blue water',
  },
  {
    id: 4,
    label: 'Happening today',
    title: 'Hiroshige: Colors of the Four Seasons | The Alan Medaugh Collection',
    description:
      "Featuring important landscapes, bird-and-flower prints, fan prints, as well as Hiroshige's paintings and sketches.",
    date: '10 September',
    location: 'New York',
    image: hiroshigeImage,
    alt: 'Utagawa Hiroshige woodblock print of cherry blossoms at Arashiyama with a raft on blue water',
  },
]

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12h18M12 3l9 9-9 9" />
    </svg>
  )
}

function HeroCarousel() {
  const [slideIndex, setSlideIndex] = useState(0)
  const [slideOffset, setSlideOffset] = useState(0)
  const [isResetting, setIsResetting] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const dragStart = useRef(null)
  const imageWrap = useRef(null)
  const carouselSlides = [...slides, slides[0], slides[1]]
  const activeSlide = slideIndex % slides.length
  const slide = slides[activeSlide]

  function nextSlide() {
    setSlideIndex((current) => current + 1)
    setTimerKey((current) => current + 1)
  }

  function previousSlide() {
    if (slideIndex === 0) {
      setIsResetting(true)
      setSlideIndex(slides.length)
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setIsResetting(false)
          setSlideIndex(slides.length - 1)
          setTimerKey((current) => current + 1)
        })
      })
      return
    }

    setSlideIndex((current) => current - 1)
    setTimerKey((current) => current + 1)
  }

  function goToSlide(index) {
    setSlideIndex(index)
    setTimerKey((current) => current + 1)
  }

  function handlePointerDown(event) {
    dragStart.current = event.clientX
  }

  function handlePointerUp(event) {
    if (dragStart.current === null) return

    const distance = event.clientX - dragStart.current
    dragStart.current = null

    if (Math.abs(distance) < 40) return
    if (distance < 0) {
      nextSlide()
      return
    }
    previousSlide()
  }

  function handlePointerCancel() {
    dragStart.current = null
  }

  useEffect(() => {
    const interval = window.setInterval(nextSlide, 5000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const element = imageWrap.current
    if (!element) return undefined

    const updateOffset = () => {
      const gap = window.matchMedia('(max-width: 1023px)').matches ? 0 : 24
      setSlideOffset(slideIndex * (element.clientWidth + gap))
    }

    const observer = new ResizeObserver(updateOffset)
    observer.observe(element)
    updateOffset()

    return () => observer.disconnect()
  }, [slideIndex])

  function handleTransitionEnd() {
    if (slideIndex !== slides.length) return

    setIsResetting(true)
    setSlideIndex(0)
    window.setTimeout(() => setIsResetting(false), 0)
  }

  const pagination = (className) => (
    <div className={className} aria-label="Featured exhibition slides">
      {slides.map(({ id }, index) => (
        <button
          key={id}
          className={`${index < activeSlide ? 'is-complete' : ''}${index === activeSlide ? ' is-active' : ''}`}
          type="button"
          onClick={() => goToSlide(index)}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === activeSlide ? 'true' : undefined}
        >
          <span key={index === activeSlide ? timerKey : id} />
        </button>
      ))}
    </div>
  )

  return (
    <section
      className="hero-carousel"
      style={{ '--slide-offset': `${slideOffset}px` }}
      aria-roledescription="carousel"
      aria-label="Featured exhibitions"
    >
      <div className="hero-carousel__content">
        <h2>{slide.title}</h2>
        <p>{slide.description}</p>
        <div className="hero-carousel__meta" aria-label={`${slide.date}, ${slide.location}`}>
          <span>{slide.date}</span>
          <span aria-hidden="true">|</span>
          <span>{slide.location}</span>
        </div>
        <a className="hero-carousel__cta" href="#collection">
          <ArrowIcon />
          <span>Explore the collection</span>
        </a>
      </div>

      <div className="hero-carousel__media">
        <div
          className="hero-carousel__image-wrap"
          ref={imageWrap}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerCancel}
          onPointerCancel={handlePointerCancel}
        >
          <div
            className={`hero-carousel__track${isResetting ? ' is-resetting' : ''}`}
            onTransitionEnd={handleTransitionEnd}
          >
            {carouselSlides.map(({ id, image, alt }, index) => (
              <div className="hero-carousel__slide" key={`${id}-${index}`}>
                <img src={image} alt={alt} draggable="false" />
              </div>
            ))}
          </div>
          <span className="hero-carousel__label">{slide.label}</span>
          {pagination('hero-carousel__pagination hero-carousel__pagination--mobile')}
        </div>
        <button className="hero-carousel__next" onClick={nextSlide} aria-label="Next featured exhibition">
          <ArrowIcon />
        </button>
      </div>

      {pagination('hero-carousel__pagination hero-carousel__pagination--desktop')}
    </section>
  )
}

export default HeroCarousel
