import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiChevronLeft, HiChevronRight, HiXMark } from 'react-icons/hi2';

const TowerGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedImage(sortedImages[index]);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedImages.map((image, index) => (
          <motion.div
            key={image.publicId || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            onClick={() => openLightbox(index)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg aspect-video"
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium mb-2">
                  {image.category}
                </span>
                <h3 className="text-white font-bold text-xl mb-2">{image.title}</h3>
                {image.description && (
                  <p className="text-gray-200 text-sm line-clamp-2">{image.description}</p>
                )}
              </div>
            </div>
          </motion.div>
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
            tabIndex={0}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
            >
              <HiXMark className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            {sortedImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                >
                  <HiChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                >
                  <HiChevronRight className="h-8 w-8" />
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
                alt={selectedImage.title}
                className="w-full h-full object-contain rounded-lg"
              />
              
              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium mb-2">
                      {selectedImage.category}
                    </span>
                    <h3 className="text-white font-bold text-2xl mb-2">{selectedImage.title}</h3>
                    {selectedImage.description && (
                      <p className="text-gray-200">{selectedImage.description}</p>
                    )}
                  </div>
                  <div className="text-white text-sm">
                    {currentIndex + 1} / {sortedImages.length}
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

export default TowerGallery;