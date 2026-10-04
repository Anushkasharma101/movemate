import React, { useState } from 'react';
import { Star, ChevronDown, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

export function Testimonials({ activeCity }) {
  const reviews = [
    {
      id: 1,
      name: 'Rohan Deshmukh',
      loc: 'Kothrud to Baner, Pune',
      rating: 5,
      bhk: '2 BHK Home Shifting',
      comment: 'Moving with MoveMate was effortlessly smooth. The coordinator managed everything on WhatsApp and the crew packed all my ceramic crockery with double bubble wrapping without a single scratch!',
      date: '2 days ago'
    },
    {
      id: 2,
      name: 'Pooja Iyer',
      loc: 'Kalyani Nagar to Hinjawadi, Pune',
      rating: 5,
      bhk: '3 BHK Villa Move',
      comment: 'The live GPS tracking and dedicated manager made moving day completely stress-free. The quote was transparent with zero hidden surprises. Best movers in Pune hands down.',
      date: '1 week ago'
    },
    {
      id: 3,
      name: 'Vikram Joshi (TechSolutions)',
      loc: 'Magarpatta City, Pune',
      rating: 5,
      bhk: '40-seat Office Relocation',
      comment: 'Relocated our entire office over Sunday. All monitors, servers and desks were dismantled, color-coded, and reassembled by 7 PM. Monday was business as usual!',
      date: '2 weeks ago'
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Happy Moves</div>
          <h2 className="section-title">Loved by 15,000+ movers in {activeCity}</h2>
          <p className="section-desc">Real stories from people who experienced moving day without the chaos.</p>
        </div>

        <div className="testimonials-grid">
          {reviews.map((rev) => (
            <div key={rev.id} className="testimonial-card">
              <div className="review-rating-row">
                <div className="review-stars">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <span className="review-bhk-tag">{rev.bhk}</span>
              </div>
              <p className="review-text">"{rev.comment}"</p>
              <div className="review-author">
                <div className="author-avatar">{rev.name.charAt(0)}</div>
                <div className="author-details">
                  <strong className="author-name">{rev.name}</strong>
                  <span className="author-loc">{rev.loc} • {rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How does MoveMate ensure transparent pricing with no hidden costs?',
      a: 'We provide an upfront, itemized quote based on your exact inventory and distance. Your quote covers vehicle transit, fuel, professional movers, toll taxes, and standard packing supplies with zero surprise charges at the end.'
    },
    {
      q: 'Who is the "dedicated coordinator" and what do they do?',
      a: 'Your move coordinator is your single point of contact. They schedule the team, manage building elevator permits, oversee inventory check-in, handle special fragile items, and ensure everything stays strictly on schedule.'
    },
    {
      q: 'Do you bring your own packing materials and boxes?',
      a: 'Yes! MoveMate supplies heavy-duty 5-ply corrugated cartons, bubble wraps, stretch film, edge guards, and wardrobe boxes. Our crew packs and labels everything room-by-room.'
    },
    {
      q: 'Can I reschedule or cancel my booking if my dates change?',
      a: 'Yes, you can reschedule your move anytime up to 24 hours prior to moving day with zero penalty fees.'
    },
    {
      q: 'Are my goods insured during transit?',
      a: 'All MoveMate shipments include complimentary transit insurance coverage. We also offer comprehensive zero-depreciation coverage for high-value electronics and antiques.'
    }
  ];

  return (
    <section className="faq-section">
      <div className="container faq-container">
        <div className="section-header">
          <div className="section-tag">Got Questions?</div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-desc">Everything you need to know about our moving services and crew.</p>
        </div>

        <div className="faq-accordion">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`faq-item ${openIdx === idx ? 'open' : ''}`}
              onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
            >
              <button 
                type="button" 
                className="faq-question-btn"
                aria-expanded={openIdx === idx}
              >
                <span>{faq.q}</span>
                <ChevronDown size={20} className={`faq-chevron ${openIdx === idx ? 'rotated' : ''}`} />
              </button>
              {openIdx === idx && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
