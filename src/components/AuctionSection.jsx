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
  const [featuredAuction, ...upcomingAuctions] = auctions

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

        <div className="auction-section__month-card">
          <div className="auction-section__month">September</div>
          <div className="auction-section__list">
            {upcomingAuctions.map((auction) => (
              <AuctionRow auction={auction} key={auction.id} />
            ))}
          </div>
        </div>

        <div className="auction-section__mobile-card">
          <div className="auction-section__month">September</div>
          <article className="auction-section__mobile-featured">
            <div className="auction-section__image-panel">
              <img src={devilWearsPradaImage} alt="Red studded heels from The Devil Wears Prada auction" />
            </div>
            <div className="auction-section__featured-copy">
              <h3>{featuredAuction.title}</h3>
              <AuctionMeta auction={featuredAuction} />
            </div>
          </article>
          <div className="auction-section__list">
            {upcomingAuctions.map((auction) => (
              <AuctionRow auction={auction} key={auction.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AuctionSection
