import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiPlayCircle } from 'react-icons/hi2';

const VideoShowcase = ({ videos = [] }) => {
  const [playingVideo, setPlayingVideo] = useState(null);

  if (!videos || videos.length === 0) return null;

  const sortedVideos = [...videos].sort((a, b) => a.order - b.order);

  const getEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedVideos.map((video, index) => (
        <motion.div
          key={video.videoId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="group relative overflow-hidden rounded-2xl shadow-lg bg-white"
        >
          {playingVideo === video.videoId ? (
            // Embedded YouTube Player
            <div className="aspect-video">
              <iframe
                src={getEmbedUrl(video.videoId)}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            // Video Thumbnail
            <div
              onClick={() => setPlayingVideo(video.videoId)}
              className="relative aspect-video cursor-pointer"
            >
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HiPlayCircle className="h-16 w-16 text-red-600" />
                </div>
              </div>

              {/* Video Info Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-6 w-full">
                  <span className="inline-block px-3 py-1 bg-red-600 rounded-full text-white text-xs font-medium mb-2">
                    {video.category}
                  </span>
                  <h3 className="text-white font-bold text-lg mb-1">{video.title}</h3>
                  {video.description && (
                    <p className="text-gray-200 text-sm line-clamp-2">{video.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Video Info Below (Always Visible) */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{video.title}</h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{video.description}</p>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                {video.category}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default VideoShowcase;