
import React from 'react';
import { UnlimitedTier } from './QuoteBuilder';
import { cn } from '@/lib/utils';
import { UnlimitedBanner } from './UnlimitedBanner';
import { UnlimitedPricing } from './UnlimitedPricing';
import { UnlimitedAddOns } from './UnlimitedAddOns';
import { UnlimitedInclusions } from './UnlimitedInclusions';

interface UnlimitedSchoolCardProps {
  tier: UnlimitedTier;
  isSelected: boolean;
  onSelect: () => void;
  addOns: {
    teacherBooks: number;
    studentBooks: number;
    posterA0: number;
  };
  onAddOnsChange: (addOns: { teacherBooks: number; studentBooks: number; posterA0: number }) => void;
  pricing: {
    subtotal: number;
    gst: number;
    total: number;
  };
  teacherCount: number;
  studentCount: number;
  regularPricing: {
    total: number;
  };
}

export const UnlimitedSchoolCard: React.FC<UnlimitedSchoolCardProps> = ({
  tier,
  isSelected,
  onSelect,
  addOns,
  onAddOnsChange,
  pricing,
  regularPricing
}) => {
  return (
    <div className="relative">
      {/* Main card */}
      <div
        className={cn(
          'relative cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl',
          'text-white overflow-hidden rounded-lg',
          isSelected ? 'ring-4 ring-green-300 ring-opacity-70 shadow-xl' : 'shadow-lg'
        )}
        style={{ 
          background: 'linear-gradient(135deg, #ebff00, #8ace00)'
        }}
        onClick={onSelect}
      >
        <UnlimitedPricing 
          basePrice={tier.basePrice}
          pricing={pricing}
          regularPricing={regularPricing}
        />

        <div className="p-8 pb-16">
          {/* Banner Image */}
          <UnlimitedBanner className="mb-6" />

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Main Content */}
            <div>
              <h3 className="text-3xl font-bold mb-2 text-gray-800">{tier.name}</h3>
              <p className="text-gray-700 text-lg mb-6">{tier.description}</p>

              {/* Add-on Options */}
              <UnlimitedAddOns 
                addOns={addOns}
                onAddOnsChange={onAddOnsChange}
                tierAddOns={tier.addOns}
              />
            </div>

            {/* Inclusions */}
            <UnlimitedInclusions 
              inclusions={tier.inclusions}
              addOns={addOns}
              isSelected={isSelected}
            />
          </div>
        </div>
        
        {/* Banner that doesn't cover content */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4">
          <div className="text-center font-bold text-sm">
            {tier.bestFor}
          </div>
        </div>
      </div>
    </div>
  );
};
