import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiChevronLeft, HiChevronRight, HiXMark } from 'react-icons/hi2';

const TowerGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Lock body scroll when lightbox is open
  React.useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [selectedImage]);

  if (!images || images.length === 0) return null;

  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedImage(sortedImages[index]);
    setImageError(false);
    
    // Focus the close button when lightbox opens
    setTimeout(() => {
      const closeButton = document.querySelector('[aria-label="Close lightbox"]');
      if (closeButton) closeButton.focus();
    }, 100);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setImageError(false);
    
    // Return focus to the gallery item that was clicked
    setTimeout(() => {
      const galleryButton = document.querySelector(`[aria-label*="View"][aria-label*="${sortedImages[currentIndex]?.title}"]`);
      if (galleryButton) galleryButton.focus();
    }, 100);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % sortedImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(sortedImages[nextIndex]);
  };

  const goToPrevious = () => {
    const prevIndex = (currentIndex - 1 + sortedImages.length) % sortedImages.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(sortedImages[prevIndex]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrevious();
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
        {sortedImages.map((image, index) => (
          <motion.button
            key={image.publicId || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            onClick={() => openLightbox(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
              }
            }}
            className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg aspect-video focus:outline-none focus:ring-4 focus:ring-primary-500"
            aria-label={`View ${image.title} in lightbox`}
            role="listitem"
          >
            <img
              src={image.url}
              alt={`${image.title} - ${image.category}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E';
              }}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium mb-2">
                  {image.category}
                </span>
                <h3 className="text-white font-bold text-xl mb-2">{image.title}</h3>
                {image.description && (
                  <p className="text-gray-200 text-sm line-clamp-2" title={image.description}>
                    {image.description}
                  </p>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            aria-describedby="lightbox-description"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close lightbox"
            >
              <HiXMark className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Navigation Buttons */}
            {sortedImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Previous image"
                >
                  <HiChevronLeft className="h-8 w-8" aria-hidden="true" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Next image"
                >
                  <HiChevronRight className="h-8 w-8" aria-hidden="true" />
                </button>
              </>
            )}

            {/* Image Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-7xl max-h-[90vh] w-full"
            >
              <img
                src={selectedImage.url}
                alt={`${selectedImage.title} - ${selectedImage.category}`}
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  setImageError(true);
                }}
              />
              
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
                  <p className="text-white text-lg">Failed to load image</p>
                </div>
              )}
              
              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium mb-2">
                      {selectedImage.category}
                    </span>
                    <h3 id="lightbox-title" className="text-white font-bold text-2xl mb-2">
                      {selectedImage.title}
                    </h3>
                    {selectedImage.description && (
                      <p id="lightbox-description" className="text-gray-200">
                        {selectedImage.description}
                      </p>
                    )}
                  </div>
                  <div className="text-white text-sm whitespace-nowrap" aria-live="polite" aria-atomic="true">
                    <span className="sr-only">Image </span>
                    {currentIndex + 1} 
                    <span className="sr-only"> of </span>
                    <span aria-hidden="true"> / </span>
                    {sortedImages.length}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

TowerGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    publicId: PropTypes.string,
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string,
    order: PropTypes.number
  }))
};
export default TowerGallery;