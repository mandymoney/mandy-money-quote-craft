
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
            Watch: Meet The Award Winning Mandy Money Program 🏆
          </h3>
          <p className="text-gray-600">
            See how financial empowerment can become an effortless part of your students' learning outcomes
          </p>
        </div>

        {!showVideo ? (
          <div className="relative cursor-pointer group"
               onClick={() => setShowVideo(true)}>
            <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img
                src="https://vumbnail.com/1090351165.jpg"
                alt="Mandy Money Program Overview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                <div className="text-center text-white">
                  <Play className="h-16 w-16 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-lg font-semibold">Click to Play Video</p>
                  <p className="text-sm opacity-90">Program Overview & Features</p>
                </div>
              </div>
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
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                src="https://player.vimeo.com/video/1090351165?badge=0&autopause=0&player_id=0&app_id=58479"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                title="The Mandy Money Program Overview"
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
