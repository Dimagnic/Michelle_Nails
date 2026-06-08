import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';

const GalleryCarousel = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState(null); // index or null
  const [zoomed, setZoomed] = useState(false);
  const intervalRef = useRef(null);
  const total = images.length;

  const next = useCallback(() => setCurrent(p => (p + 1) % total), [total]);
  const prev = useCallback(() => setCurrent(p => (p - 1 + total) % total), [total]);

  // Auto-play
  useEffect(() => {
    if (paused || lightbox !== null) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(next, 5000);
    return () => clearInterval(intervalRef.current);
  }, [paused, lightbox, next]);

  // Keyboard nav on lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight') setLightbox(p => (p + 1) % total);
      if (e.key === 'ArrowLeft') setLightbox(p => (p - 1 + total) % total);
      if (e.key === 'Escape') { setLightbox(null); setZoomed(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, total]);

  // Touch swipe
  const touchStart = useRef(null);
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); }
    touchStart.current = null;
  };

  if (!total) return null;

  // Visible slides: prev, current, next (3-up on desktop, 1 on mobile)
  const getSlide = (offset) => images[(current + offset + total) % total];

  return (
    <>
      {/* ── CAROUSEL ── */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden', background: '#000' }}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

        {/* Track */}
        <div style={{ display: 'flex', gap: 2, padding: '0 0', transition: 'none' }}>

          {/* Desktop: 3 visible cards */}
          <div className="gallery-desktop" style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 2 }}>
            {[-1, 0, 1].map((offset) => {
              const img = getSlide(offset);
              const isCenter = offset === 0;
              return (
                <div key={offset} onClick={() => { if (isCenter) { setLightbox((current + offset + total) % total); setZoomed(false); } else { isCenter || (offset === -1 ? prev() : next()); offset !== 0 && (offset === -1 ? prev() : next()); } }}
                  style={{
                    position: 'relative', overflow: 'hidden',
                    aspectRatio: isCenter ? '4/3' : '4/3',
                    cursor: 'pointer',
                    opacity: isCenter ? 1 : 0.45,
                    transform: isCenter ? 'scale(1)' : 'scale(0.97)',
                    transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
                    filter: isCenter ? 'none' : 'brightness(0.5)',
                  }}>
                  <img src={img.image} alt={img.categoria} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s', display: 'block' }}
                    onMouseEnter={e => { if (isCenter) e.currentTarget.style.transform = 'scale(1.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }} />
                  {isCenter && (
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,20,60,0.75) 0%, transparent 50%)', pointerEvents: 'none' }} />
                  )}
                  {isCenter && (
                    <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <span style={{ border: '1px solid rgba(255,255,255,0.45)', padding: '4px 14px', fontSize: 10, letterSpacing: '2px', color: '#fff', textTransform: 'uppercase', backdropFilter: 'blur(4px)' }}>{img.categoria}</span>
                      <div style={{ width: 34, height: 34, background: 'rgba(0,102,204,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                        <ZoomIn size={15} color="#fff" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile: 1 card full */}
          <div className="gallery-mobile" style={{ width: '100%', display: 'none' }}>
            <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3' }}
              onClick={() => { setLightbox(current); setZoomed(false); }}>
              <img src={images[current].image} alt={images[current].categoria} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,20,60,0.75),transparent 50%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ border: '1px solid rgba(255,255,255,0.4)', padding: '4px 12px', fontSize: 9, letterSpacing: '2px', color: '#fff', textTransform: 'uppercase' }}>{images[current].categoria}</span>
                <ZoomIn size={15} color="#fff" />
              </div>
            </div>
          </div>
        </div>

        {/* Left Arrow */}
        <button onClick={(e) => { e.stopPropagation(); prev(); setPaused(true); }}
          style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(0,102,204,0.5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(8px)', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#0066CC'; e.currentTarget.style.borderColor = '#0066CC'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.7)'; e.currentTarget.style.borderColor = 'rgba(0,102,204,0.5)'; }}
          aria-label="Anterior">
          <ChevronLeft size={20} />
        </button>

        {/* Right Arrow */}
        <button onClick={(e) => { e.stopPropagation(); next(); setPaused(true); }}
          style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(0,102,204,0.5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(8px)', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#0066CC'; e.currentTarget.style.borderColor = '#0066CC'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.7)'; e.currentTarget.style.borderColor = 'rgba(0,102,204,0.5)'; }}
          aria-label="Siguiente">
          <ChevronRight size={20} />
        </button>

        {/* Bottom controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '20px 0 4px', background: '#000' }}>
          {/* Dots */}
          <div style={{ display: 'flex', gap: 6 }}>
            {images.map((_, i) => (
              <button key={i} onClick={() => { setCurrent(i); setPaused(true); }}
                style={{ width: i === current ? 24 : 6, height: 6, background: i === current ? '#0066CC' : 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 3, cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
            ))}
          </div>

          {/* Pause/Play */}
          <button onClick={() => setPaused(p => !p)}
            style={{ background: 'none', border: '1px solid rgba(0,102,204,0.35)', color: paused ? '#3B9EFF' : 'rgba(255,255,255,0.4)', padding: '5px 14px', fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", transition: 'all 0.2s' }}>
            {paused ? '▶ Reanudar' : '⏸ Pausar'}
          </button>

          {/* Progress bar */}
          <div style={{ width: 80, height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
            <div key={`${current}-${paused}`} style={{
              height: '100%', background: '#0066CC', borderRadius: 2,
              animation: paused ? 'none' : 'progress5s 5s linear',
              width: paused ? '0%' : '0%',
            }} />
          </div>
        </div>

        <style>{`
          @keyframes progress5s { from { width: 0% } to { width: 100% } }
          @media (max-width: 768px) {
            .gallery-desktop { display: none !important; }
            .gallery-mobile { display: block !important; }
          }
        `}</style>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.96)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => { setLightbox(null); setZoomed(false); }}>

          {/* Image */}
          <div style={{ position: 'relative', maxWidth: zoomed ? '95vw' : '75vw', maxHeight: '90vh', transition: 'max-width 0.3s' }}
            onClick={e => e.stopPropagation()}>
            <img src={images[lightbox].image} alt={images[lightbox].categoria}
              style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', display: 'block', userSelect: 'none' }} />

            {/* Category tag */}
            <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
              <span style={{ border: '1px solid rgba(255,255,255,0.35)', padding: '5px 16px', fontSize: 10, letterSpacing: '2.5px', color: '#fff', textTransform: 'uppercase', backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.4)' }}>
                {images[lightbox].categoria}
              </span>
            </div>

            {/* Counter */}
            <div style={{ position: 'absolute', top: 16, left: 16, fontSize: 10, letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', fontFamily: "'Montserrat', sans-serif" }}>
              {lightbox + 1} / {total}
            </div>
          </div>

          {/* Controls top-right */}
          <div style={{ position: 'fixed', top: 20, right: 20, display: 'flex', gap: 8 }}>
            <button onClick={(e) => { e.stopPropagation(); setZoomed(z => !z); }}
              style={{ width: 40, height: 40, background: 'rgba(0,102,204,0.3)', border: '1px solid rgba(0,102,204,0.5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(0,102,204,0.7)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(0,102,204,0.3)'}
              aria-label={zoomed ? 'Reducir' : 'Ampliar'}>
              {zoomed ? <ZoomOut size={17} /> : <ZoomIn size={17} />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); setLightbox(null); setZoomed(false); }}
              style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
              aria-label="Cerrar">
              <X size={17} />
            </button>
          </div>

          {/* Lightbox arrows */}
          <button onClick={(e) => { e.stopPropagation(); setLightbox(p => (p - 1 + total) % total); setZoomed(false); }}
            style={{ position: 'fixed', left: 16, top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,102,204,0.4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background='#0066CC'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(0,0,0,0.6)'}
            aria-label="Anterior">
            <ChevronLeft size={22} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setLightbox(p => (p + 1) % total); setZoomed(false); }}
            style={{ position: 'fixed', right: 16, top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,102,204,0.4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background='#0066CC'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(0,0,0,0.6)'}
            aria-label="Siguiente">
            <ChevronRight size={22} />
          </button>

          {/* Thumbnails strip */}
          <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, padding: '10px 16px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
            {images.map((img, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setLightbox(i); setZoomed(false); }}
                style={{ width: 48, height: 36, overflow: 'hidden', border: i === lightbox ? '2px solid #0066CC' : '2px solid transparent', padding: 0, cursor: 'pointer', opacity: i === lightbox ? 1 : 0.5, transition: 'all 0.2s', flexShrink: 0 }}>
                <img src={img.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryCarousel;
