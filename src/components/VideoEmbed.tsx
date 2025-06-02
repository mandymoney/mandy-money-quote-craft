
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, X } from 'lucide-react';

export const VideoEmbed: React.FC = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <Card className="mb-8 bg-white border border-gray-200">
      <div className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Watch: The Mandy Money Program Overview
          </h3>
          <p className="text-gray-600">
            Get a quick overview of what's included in our financial literacy program
          </p>
        </div>

        {!showVideo ? (
          <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg h-64 flex items-center justify-center cursor-pointer group"
               onClick={() => setShowVideo(true)}>
            <div className="text-center text-white">
              <Play className="h-16 w-16 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-lg font-semibold">Click to Play Video</p>
              <p className="text-sm opacity-90">Program Overview & Features</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 z-10 bg-white hover:bg-gray-100"
              onClick={() => setShowVideo(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Video embed placeholder - Replace with actual video URL</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
