import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiPlayCircle, HiXCircle } from 'react-icons/hi2';
import PropTypes from 'prop-types';

const VideoShowcase = ({ videos = [] }) => {
  const [playingVideo, setPlayingVideo] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  if (!videos || videos.length === 0) return null;

  const sortedVideos = [...videos].sort((a, b) => a.order - b.order);

  const getEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  };

  const handleImageError = (videoId) => {
    setImageErrors(prev => ({ ...prev, [videoId]: true }));
  };

  const handlePlayVideo = (videoId) => {
    setPlayingVideo(videoId);
  };

  const handleStopVideo = (e) => {
    e.stopPropagation();
    setPlayingVideo(null);
  };

  const handleKeyDown = (e, videoId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePlayVideo(videoId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
      {sortedVideos.map((video, index) => (
        <motion.div
          key={video.videoId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="group relative overflow-hidden rounded-2xl shadow-lg bg-white"
          role="listitem"
        >
          {playingVideo === video.videoId ? (
            // Embedded YouTube Player
            <div className="relative aspect-video">
              <iframe
                src={getEmbedUrl(video.videoId)}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
              
              {/* Close Button */}
              <button
                onClick={handleStopVideo}
                className="absolute top-4 right-4 p-2 bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label={`Stop playing ${video.title}`}
              >
                <HiXCircle className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          ) : (
            // Video Thumbnail
            <button
              onClick={() => handlePlayVideo(video.videoId)}
              onKeyDown={(e) => handleKeyDown(e, video.videoId)}
              className="relative aspect-video cursor-pointer w-full focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-offset-2 rounded-t-2xl overflow-hidden"
              aria-label={`Play video: ${video.title}`}
            >
              {imageErrors[video.videoId] ? (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <HiPlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-2" aria-hidden="true" />
                    <p className="text-gray-600 text-sm">Video thumbnail unavailable</p>
                  </div>
                </div>
              ) : (
                <img
                  src={video.thumbnailUrl}
                  alt={`${video.title} video thumbnail`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-focus:scale-110"
                  loading="lazy"
                  onError={() => handleImageError(video.videoId)}
                />
              )}
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 group-focus:bg-black/50 transition-colors">
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 group-focus:scale-110 transition-transform shadow-2xl">
                  <HiPlayCircle className="h-16 w-16 text-red-600" aria-hidden="true" />
                </div>
              </div>

              {/* Video Info Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none">
                <div className="p-6 w-full">
                  <span className="inline-block px-3 py-1 bg-red-600 rounded-full text-white text-xs font-medium mb-2">
                    {video.category}
                  </span>
                  <h3 className="text-white font-bold text-lg mb-1">{video.title}</h3>
                  {video.description && (
                    <p className="text-gray-200 text-sm line-clamp-2" title={video.description}>
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          )}

          {/* Video Info Below (Always Visible) */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{video.title}</h4>
                {video.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2" title={video.description}>
                    {video.description}
                  </p>
                )}
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full whitespace-nowrap flex-shrink-0">
                {video.category}
              </span>
            </div>
            
            {/* Playing Indicator */}
            {playingVideo === video.videoId && (
              <div className="mt-3 flex items-center text-sm text-primary-600">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-600"></span>
                </span>
                Now playing
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

VideoShowcase.propTypes = {
  videos: PropTypes.arrayOf(PropTypes.shape({
    videoId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
    description: PropTypes.string,
    order: PropTypes.number
  }))
};

export default VideoShowcase;