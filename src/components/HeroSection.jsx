import React from 'react';
import { 
  Search, 
  Truck, 
  ShieldCheck, 
  Award
} from 'lucide-react';

export default function HeroSection({ searchQuery, setSearchQuery }) {
  return (
    <section style={{
      padding: '70px 0 40px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'radial-gradient(ellipse at top, #141417 0%, #000000 70%)'
    }}>
      <div className="container" style={{ maxWidth: '880px', textAlign: 'center' }}>
        {/* Subtle monochrome badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 14px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '24px'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e4e4e7', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Executive Hardware & Physical Goods Delivered Nationwide
          </span>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)',
          fontWeight: 800,
          marginBottom: '18px',
          letterSpacing: '-0.035em',
          lineHeight: 1.15,
          color: '#ffffff'
        }}>
          Physical Tools for <br />
          The High-Stakes Founder.
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: 'var(--text-muted)',
          maxWidth: '620px',
          margin: '0 auto 36px',
          lineHeight: 1.6
        }}>
          Precision presenter clickers, studio-grade pitch microphones, handcrafted full-grain leather notebooks, and heavy founder apparel. Dispatched via express courier with real-time tracking.
        </p>

        {/* Search Bar Input */}
        <div style={{
          position: 'relative',
          maxWidth: '540px',
          margin: '0 auto 40px'
        }}>
          <Search 
            size={18} 
            color="#71717a" 
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input
            type="text"
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search presenters, leather journals, microphones, apparel..."
            style={{
              paddingLeft: '46px',
              paddingRight: '36px',
              height: '50px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.92rem',
              background: '#0a0a0c',
              border: '1px solid var(--border-medium)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#71717a',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Value Highlights */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          textAlign: 'left'
        }}>
          <div className="glass-card" style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <Truck size={16} color="#ffffff" />
              <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#ffffff' }}>Express Courier</div>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Dispatched within 24-48 hours</div>
          </div>

          <div className="glass-card" style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <Award size={16} color="#ffffff" />
              <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#ffffff' }}>Aerospace & Leather</div>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Engineered with premium materials</div>
          </div>

          <div className="glass-card" style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <ShieldCheck size={16} color="#ffffff" />
              <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#ffffff' }}>1-Year Replacement</div>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Hassle-free hardware warranty</div>
          </div>
        </div>
      </div>
    </section>
  );
}
