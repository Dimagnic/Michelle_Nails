import React from 'react';
import { Button } from '@/components/ui/button';

const GalleryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      {categories.map((category) => (
        <Button
          key={category}
          onClick={() => onCategoryChange(category)}
          variant="outline"
          className={`transition-all duration-300 rounded-full px-6 py-2 border ${
            activeCategory === category
              ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105'
              : 'bg-white text-foreground border-border hover:border-secondary hover:text-secondary hover:bg-accent/50'
          }`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default GalleryFilter;