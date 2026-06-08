import React from 'react';

const GalleryFilter = ({ categories, activeCategory, onCategoryChange }) => (
  <div style={{ display: 'flex', gap: 2, marginBottom: 32, flexWrap: 'wrap' }}>
    {categories.map(cat => (
      <button key={cat} onClick={() => onCategoryChange(cat)} style={{
        background: activeCategory === cat ? '#0066CC' : 'transparent',
        color: activeCategory === cat ? '#fff' : 'rgba(255,255,255,0.45)',
        border: `1px solid ${activeCategory === cat ? '#0066CC' : 'rgba(255,255,255,0.12)'}`,
        padding: '8px 20px', fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase',
        cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", transition: 'all 0.2s',
      }}
      onMouseEnter={e => { if (activeCategory !== cat) e.currentTarget.style.borderColor = '#0066CC'; }}
      onMouseLeave={e => { if (activeCategory !== cat) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
      >{cat}</button>
    ))}
  </div>
);

export default GalleryFilter;
