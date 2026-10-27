import React from 'react';
import { Video } from 'lucide-react';
import { getYouTubeEmbedUrl } from '../utils/youtube';

export default function VideoPlayer({ videoUrl, title = 'Product Showcase' }) {
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  if (!embedUrl) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-400 text-xs font-medium">
        <Video className="w-6 h-6 mb-1 opacity-50" />
        <span>No video available</span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 bg-black">
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}