
import React from 'react';

interface UnlimitedBannerProps {
  className?: string;
}

export const UnlimitedBanner: React.FC<UnlimitedBannerProps> = ({ className }) => {
  return (
    <div className={className}>
      <img 
        src="https://raw.githubusercontent.com/mandymoney/mandy-money-quote-craft/main/Unlimited%20Access%20Banner.png"
        alt="Unlimited Access Banner" 
        className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
        onError={(e) => {
          console.log('Banner image failed to load, trying alternative URLs');
          // Try alternative URL formats
          const alternatives = [
            'https://github.com/mandymoney/mandy-money-quote-craft/raw/main/Unlimited%20Access%20Banner.png',
            'https://github.com/mandymoney/mandy-money-quote-craft/blob/main/Unlimited%20Access%20Banner.png?raw=true'
          ];
          
          const currentSrc = e.currentTarget.src;
          const nextIndex = alternatives.findIndex(url => url === currentSrc) + 1;
          
          if (nextIndex < alternatives.length) {
            e.currentTarget.src = alternatives[nextIndex];
          } else {
            // If all alternatives fail, hide the image
            e.currentTarget.style.display = 'none';
            console.log('All banner image URLs failed');
          }
        }}
        onLoad={() => {
          console.log('Banner image loaded successfully');
        }}
      />
    </div>
  );
};
