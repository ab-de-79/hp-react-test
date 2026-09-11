import { useEffect, useRef, useState } from 'react'
import './AuctionSection.css'
import devilWearsPradaImage from '../assets/Devil Wears Prada.png'

const auctions = [
  {
    id: 1,
    title: 'The Auction: Inside The Devil Wears Prada 2',
    status: 'Live now',
    date: '1-15 Sept',
    location: 'New York',
    featured: true,
  },
  {
    id: 2,
    title: 'Fine and Rare Wines & Spirits Online: London Edition',
    status: 'Open for bidding',
    date: '2-16 Sept',
    location: 'London',
  },
  {
    id: 3,
    title: 'Hiroshige: Colors of the Four Seasons | The Alan Medaugh Collection',
    status: 'Registration open',
    date: '15 Sept',
    location: 'New York',
  },
  {
    id: 4,
    title: 'South Asian Modern + Contemporary Art',
    status: 'Open for bidding',
    date: '16 Sept',
    location: 'New York',
  },
  {
    id: 5,
    title: "Marr's Guitars: The Johnny Marr Collection",
    status: 'Registration open',
    date: '17 Sept',
    location: 'London',
  },
  {
    id: 6,
    title: 'Ritual, Cosmos, and Imperial Splendor',
    status: 'Registration open',
    date: '17 Sept',
    location: 'New York',
  },
  {
    id: 7,
    title: 'Important Chinese Art Including Ceramics from the Art Institute of Chicago',
    status: 'Registration open',
    date: '17-18 Sept',
    location: 'New York',
  },
]

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12h18M12 3l9 9-9 9" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 10.4C19 16 12 21 12 21S5 16 5 10.4a7 7 0 1 1 14 0Z" />
      <path d="M12 13a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z" />
    </svg>
  )
}

function AuctionMeta({ auction }) {
  return (
    <div className="auction-section__meta">
      <span className={`auction-section__status${auction.featured ? ' auction-section__status--live' : ''}`}>
        {auction.status}
      </span>
      <span className="auction-section__date">{auction.date}</span>
      <span className="auction-section__divider" aria-hidden="true" />
      <span className="auction-section__location">
        <LocationIcon />
        {auction.location}
      </span>
    </div>
  )
}

function AuctionRow({ auction }) {
  return (
    <article className="auction-section__row">
      <h3>{auction.title}</h3>
      <AuctionMeta auction={auction} />
    </article>
  )
}

function AuctionSection() {
  const calendar = useRef(null)
  const october = useRef(null)
  const isSnappingCalendar = useRef(false)
  const lastCalendarScrollTop = useRef(0)
  const [isScrolledToOctober, setIsScrolledToOctober] = useState(false)
  const [isCalendarAtEnd, setIsCalendarAtEnd] = useState(false)
  const [featuredAuction, ...supportingAuctions] = auctions
  const septemberAuctions = supportingAuctions.slice(0, 3)
  const octoberAuctions = supportingAuctions.slice(3)

  function scrollCalendar() {
    const element = calendar.current
    const target = october.current
    if (!element || !target) return

    isSnappingCalendar.current = true
    element.scrollTo({
      top: target.offsetTop,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
    setIsScrolledToOctober(true)
    window.setTimeout(() => {
      isSnappingCalendar.current = false
      lastCalendarScrollTop.current = element.scrollTop
      updateCalendarState()
    }, 500)
  }

  function updateCalendarState() {
    const element = calendar.current
    const target = october.current
    if (!element || !target) return

    setIsScrolledToOctober(element.scrollTop >= target.offsetTop - 8)
    setIsCalendarAtEnd(element.scrollTop + element.clientHeight >= element.scrollHeight - 4)
  }

  function handleCalendarScroll() {
    const element = calendar.current
    const target = october.current
    if (!element || !target) return

    const isScrollingDown = element.scrollTop > lastCalendarScrollTop.current
    const isLeavingTop = lastCalendarScrollTop.current <= 1 && element.scrollTop > 0
    const isMovingDownToOctober = isLeavingTop && isScrollingDown && element.scrollTop < target.offsetTop - 8

    if (isMovingDownToOctober && !isSnappingCalendar.current) {
      scrollCalendar()
      return
    }

    lastCalendarScrollTop.current = element.scrollTop
    updateCalendarState()
  }

  useEffect(() => {
    const element = calendar.current
    if (!element) return undefined

    const observer = new ResizeObserver(updateCalendarState)
    observer.observe(element)
    updateCalendarState()

    return () => observer.disconnect()
  }, [])

  return (
    <section className="auction-section" aria-labelledby="auction-heading">
      <header className="auction-section__header">
        <h2 id="auction-heading">Upcoming auctions</h2>
        <a href="#auction-calendar">
          <span>View auction calendar</span>
          <ArrowIcon />
        </a>
      </header>

      <div className="auction-section__layout">
        <article className="auction-section__featured">
          <div className="auction-section__image-panel">
            <img src={devilWearsPradaImage} alt="Red studded heels from The Devil Wears Prada auction" />
          </div>
          <div className="auction-section__featured-copy">
            <h3>{featuredAuction.title}</h3>
            <AuctionMeta auction={featuredAuction} />
          </div>
        </article>

        <div className={`auction-section__month-card${isScrolledToOctober ? ' is-showing-october' : ''}${isCalendarAtEnd ? ' is-at-end' : ''}`}>
          <div className="auction-section__calendar" ref={calendar} onScroll={handleCalendarScroll}>
            <section className="auction-section__calendar-month" aria-label="September auctions">
              <div className="auction-section__month">September</div>
              <div className="auction-section__list">
                {septemberAuctions.map((auction) => (
                  <AuctionRow auction={auction} key={auction.id} />
                ))}
              </div>
            </section>
            <section className="auction-section__calendar-month" aria-label="October auctions" ref={october}>
              <div className="auction-section__month auction-section__month--october">October</div>
              <div className="auction-section__list">
                {octoberAuctions.map((auction) => (
                  <AuctionRow auction={auction} key={auction.id} />
                ))}
              </div>
            </section>
          </div>
          <button
            className="auction-section__calendar-next"
            type="button"
            onClick={scrollCalendar}
            disabled={isCalendarAtEnd}
            aria-label="Scroll to more auctions"
          >
            <ArrowIcon />
          </button>
        </div>

        <article className="auction-section__mobile-featured">
          <div className="auction-section__image-panel">
            <img src={devilWearsPradaImage} alt="Red studded heels from The Devil Wears Prada auction" />
          </div>
          <div className="auction-section__featured-copy">
            <h3>{featuredAuction.title}</h3>
            <AuctionMeta auction={featuredAuction} />
          </div>
        </article>

        <div className="auction-section__mobile-month-card">
          <div className="auction-section__month">September</div>
          <div className="auction-section__list">
            {supportingAuctions.map((auction) => (
              <AuctionRow auction={auction} key={auction.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AuctionSection
