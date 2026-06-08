import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';

const useIsMobile = () => {
  const [mobile, setMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return mobile;
};

const GalleryCarousel = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [zoomed, setZoomed] = useState(false);
  const intervalRef = useRef(null);
  const touchStart = useRef(null);
  const isMobile = useIsMobile();
  const total = images.length;

  const next = useCallback(() => setCurrent(p => (p + 1) % total), [total]);
  const prev = useCallback(() => setCurrent(p => (p - 1 + total) % total), [total]);

  useEffect(() => {
    if (paused || lightbox !== null) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(next, 5000);
    return () => clearInterval(intervalRef.current);
  }, [paused, lightbox, next]);

  useEffect(() => {
    if (lightbox === null) return;
    const h = (e) => {
      if (e.key === 'ArrowRight') setLightbox(p => (p + 1) % total);
      if (e.key === 'ArrowLeft') setLightbox(p => (p - 1 + total) % total);
      if (e.key === 'Escape') { setLightbox(null); setZoomed(false); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [lightbox, total]);

  useEffect(() => {
    if (lightbox !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); setPaused(true); }
    touchStart.current = null;
  };

  if (!total) return null;

  const getSlide = (offset) => images[(current + offset + total) % total];

  const arrowStyle = (side) => ({
    position: 'absolute',
    [side]: isMobile ? 8 : 16,
    top: '50%',
    transform: 'translateY(-50%)',
    width: isMobile ? 36 : 44,
    height: isMobile ? 36 : 44,
    background: 'rgba(0,0,0,0.75)',
    border: '1px solid rgba(0,102,204,0.55)',
    color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', zIndex: 10,
    backdropFilter: 'blur(6px)',
    transition: 'background 0.2s',
    borderRadius: 2,
    flexShrink: 0,
  });

  return (
    <>
      {/* ── CAROUSEL ── */}
      <div
        style={{ position: 'relative', width: '100%', background: '#000', userSelect: 'none' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* ── DESKTOP: 3 slides ── */}
        {!isMobile && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 2 }}>
            {[-1, 0, 1].map((offset) => {
              const img = getSlide(offset);
              const isCenter = offset === 0;
              return (
                <div
                  key={offset}
                  onClick={() => {
                    if (isCenter) { setLightbox(current); setZoomed(false); }
                    else { offset === -1 ? prev() : next(); }
                  }}
                  style={{
                    position: 'relative', overflow: 'hidden', aspectRatio: '4/3',
                    cursor: 'pointer',
                    opacity: isCenter ? 1 : 0.4,
                    filter: isCenter ? 'none' : 'brightness(0.45)',
                    transition: 'all 0.5s',
                  }}
                >
                  <img
                    src={img.image} alt={img.categoria}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s' }}
                    onMouseEnter={e => { if (isCenter) e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />
                  {isCenter && (
                    <>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,15,50,0.8) 0%,transparent 55%)', pointerEvents: 'none' }} />
                      <div style={{ position: 'absolute', bottom: 18, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <span style={{ border: '1px solid rgba(255,255,255,0.4)', padding: '4px 14px', fontSize: 10, letterSpacing: '2px', color: '#fff', textTransform: 'uppercase', backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.2)' }}>{img.categoria}</span>
                        <div style={{ width: 34, height: 34, background: 'rgba(0,102,204,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ZoomIn size={15} color="#fff" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── MOBILE: 1 slide full width ── */}
        {isMobile && (
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden' }}
            onClick={() => { setLightbox(current); setZoomed(false); }}>
            <img
              src={images[current].image} alt={images[current].categoria}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,15,50,0.8) 0%,transparent 55%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ border: '1px solid rgba(255,255,255,0.4)', padding: '4px 10px', fontSize: 9, letterSpacing: '1.5px', color: '#fff', textTransform: 'uppercase', background: 'rgba(0,0,0,0.3)' }}>{images[current].categoria}</span>
              <div style={{ width: 30, height: 30, background: 'rgba(0,102,204,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ZoomIn size={13} color="#fff" />
              </div>
            </div>
          </div>
        )}

        {/* Arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); prev(); setPaused(true); }}
          style={arrowStyle('left')}
          onMouseEnter={e => e.currentTarget.style.background = '#0066CC'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.75)'}
          aria-label="Anterior"
        >
          <ChevronLeft size={isMobile ? 18 : 20} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); next(); setPaused(true); }}
          style={arrowStyle('right')}
          onMouseEnter={e => e.currentTarget.style.background = '#0066CC'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.75)'}
          aria-label="Siguiente"
        >
          <ChevronRight size={isMobile ? 18 : 20} />
        </button>

        {/* ── CONTROLS BAR ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexWrap: 'wrap', gap: isMobile ? 10 : 20,
          padding: isMobile ? '14px 16px' : '18px 0 6px',
          background: '#000',
        }}>
          {/* Dots */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {images.map((_, i) => (
              <button key={i} onClick={() => { setCurrent(i); setPaused(true); }}
                style={{
                  width: i === current ? (isMobile ? 18 : 24) : (isMobile ? 5 : 6),
                  height: isMobile ? 5 : 6,
                  background: i === current ? '#0066CC' : 'rgba(255,255,255,0.2)',
                  border: 'none', borderRadius: 3, cursor: 'pointer',
                  transition: 'all 0.3s', padding: 0, flexShrink: 0,
                }}
              />
            ))}
          </div>

          {/* Pause / Play */}
          <button
            onClick={() => setPaused(p => !p)}
            style={{
              background: 'none',
              border: `1px solid ${paused ? 'rgba(59,158,255,0.6)' : 'rgba(0,102,204,0.3)'}`,
              color: paused ? '#3B9EFF' : 'rgba(255,255,255,0.4)',
              padding: isMobile ? '5px 10px' : '5px 14px',
              fontSize: isMobile ? 8 : 9,
              letterSpacing: isMobile ? '1px' : '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: "'Montserrat', sans-serif",
              whiteSpace: 'nowrap',
            }}
          >
            {paused ? '▶ Reanudar' : '⏸ Pausar'}
          </button>

          {/* Progress bar — solo desktop */}
          {!isMobile && (
            <div style={{ width: 72, height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
              <div
                key={`${current}-${paused}`}
                style={{
                  height: '100%', background: '#0066CC', borderRadius: 2,
                  animation: paused ? 'none' : 'gc_progress 5s linear forwards',
                  width: '0%',
                }}
              />
            </div>
          )}

          {/* Counter */}
          <span style={{ fontSize: isMobile ? 9 : 10, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.3)', fontFamily: "'Montserrat', sans-serif", flexShrink: 0 }}>
            {current + 1} / {total}
          </span>
        </div>

        <style>{`@keyframes gc_progress { from { width:0% } to { width:100% } }`}</style>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox !== null && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.97)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => { setLightbox(null); setZoomed(false); }}
        >
          {/* Top bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '12px 16px' : '16px 24px', background: 'linear-gradient(to bottom,rgba(0,0,0,0.8),transparent)', zIndex: 2 }}>
            <span style={{ fontSize: isMobile ? 10 : 11, letterSpacing: '2px', color: 'rgba(255,255,255,0.45)', fontFamily: "'Montserrat', sans-serif" }}>
              {images[lightbox].categoria} &nbsp;·&nbsp; {lightbox + 1} / {total}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={(e) => { e.stopPropagation(); setZoomed(z => !z); }}
                style={{ width: isMobile ? 36 : 40, height: isMobile ? 36 : 40, background: 'rgba(0,102,204,0.25)', border: '1px solid rgba(0,102,204,0.5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: 2 }}
                aria-label={zoomed ? 'Reducir' : 'Ampliar'}
              >
                {zoomed ? <ZoomOut size={15} /> : <ZoomIn size={15} />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox(null); setZoomed(false); }}
                style={{ width: isMobile ? 36 : 40, height: isMobile ? 36 : 40, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: 2 }}
                aria-label="Cerrar"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Image */}
          <div
            style={{
              position: 'relative',
              width: zoomed ? '98vw' : (isMobile ? '96vw' : '78vw'),
              maxHeight: isMobile ? '70vh' : '78vh',
              transition: 'width 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={e => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={(e) => {
              if (!touchStart.current) return;
              const diff = touchStart.current - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 40) { diff > 0 ? setLightbox(p => (p+1)%total) : setLightbox(p => (p-1+total)%total); setZoomed(false); }
              touchStart.current = null;
            }}
          >
            <img
              src={images[lightbox].image}
              alt={images[lightbox].categoria}
              style={{ maxWidth: '100%', maxHeight: isMobile ? '70vh' : '78vh', objectFit: 'contain', display: 'block', userSelect: 'none' }}
            />
          </div>

          {/* Side arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(p => (p-1+total)%total); setZoomed(false); }}
            style={{ position: 'absolute', left: isMobile ? 6 : 20, top: '50%', transform: 'translateY(-50%)', width: isMobile ? 38 : 48, height: isMobile ? 38 : 48, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,102,204,0.4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 3, borderRadius: 2 }}
            aria-label="Anterior"
          >
            <ChevronLeft size={isMobile ? 18 : 22} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(p => (p+1)%total); setZoomed(false); }}
            style={{ position: 'absolute', right: isMobile ? 6 : 20, top: '50%', transform: 'translateY(-50%)', width: isMobile ? 38 : 48, height: isMobile ? 38 : 48, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,102,204,0.4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 3, borderRadius: 2 }}
            aria-label="Siguiente"
          >
            <ChevronRight size={isMobile ? 18 : 22} />
          </button>

          {/* Thumbnails — desktop solo */}
          {!isMobile && (
            <div
              style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, padding: '10px 16px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
              onClick={e => e.stopPropagation()}
            >
              {images.map((img, i) => (
                <button key={i} onClick={() => { setLightbox(i); setZoomed(false); }}
                  style={{ width: 52, height: 38, overflow: 'hidden', border: `2px solid ${i === lightbox ? '#0066CC' : 'transparent'}`, padding: 0, cursor: 'pointer', opacity: i === lightbox ? 1 : 0.45, transition: 'all 0.2s', flexShrink: 0, borderRadius: 1 }}
                >
                  <img src={img.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </button>
              ))}
            </div>
          )}

          {/* Mobile: dot strip in lightbox */}
          {isMobile && (
            <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}
              onClick={e => e.stopPropagation()}>
              {images.map((_, i) => (
                <button key={i} onClick={() => { setLightbox(i); setZoomed(false); }}
                  style={{ width: i === lightbox ? 18 : 6, height: 5, background: i === lightbox ? '#0066CC' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: 3, padding: 0, cursor: 'pointer', transition: 'all 0.3s' }} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default GalleryCarousel;
