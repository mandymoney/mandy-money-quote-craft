import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Image, TrendingUp } from 'lucide-react';
import { UnlimitedTier } from './QuoteBuilder';
import { cn } from '@/lib/utils';

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
  teacherCount,
  studentCount,
  regularPricing
}) => {
  const handleTeacherBooksChange = (value: string) => {
    const newCount = Math.max(0, parseInt(value) || 0);
    onAddOnsChange({ ...addOns, teacherBooks: newCount });
  };

  const handleStudentBooksChange = (value: string) => {
    const newCount = Math.max(0, parseInt(value) || 0);
    onAddOnsChange({ ...addOns, studentBooks: newCount });
  };

  const handlePosterA0Change = (value: string) => {
    const newCount = Math.max(0, parseInt(value) || 0);
    onAddOnsChange({ ...addOns, posterA0: newCount });
  };

  const savings = regularPricing.total - pricing.total;
  const percentSavings = Math.round((savings / regularPricing.total) * 100);

  // Get all inclusions including add-ons
  const getAllInclusions = () => {
    const inclusions = [...tier.inclusions];
    
    if (addOns.teacherBooks > 0) {
      inclusions.push(`${addOns.teacherBooks} x Teacher Print Textbook${addOns.teacherBooks > 1 ? 's' : ''}`);
    }
    if (addOns.studentBooks > 0) {
      inclusions.push(`${addOns.studentBooks} x Student Print Textbook${addOns.studentBooks > 1 ? 's' : ''}`);
    }
    if (addOns.posterA0 > 0) {
      inclusions.push(`${addOns.posterA0} x A0 Poster${addOns.posterA0 > 1 ? 's' : ''}`);
    }
    
    return inclusions;
  };

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
        {/* Savings Badge */}
        {savings > 0 && (
          <div className="absolute -top-4 -right-4 bg-red-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              Save ${savings.toLocaleString()}!
            </div>
            <div className="text-xs">{percentSavings}% savings</div>
          </div>
        )}

        <div className="p-8 pb-16">
          {/* Banner Image */}
          <div className="mb-6">
            <img 
              src="https://raw.githubusercontent.com/mandymoney/mandy-money-quote-craft/main/Unlimited%20Access%20Banner.png"
              alt="Unlimited Access Banner" 
              className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
              onError={(e) => {
                console.log('Banner image failed to load');
                // Fallback to a placeholder or hide the image
                e.currentTarget.style.display = 'none';
              }}
              onLoad={() => {
                console.log('Banner image loaded successfully');
              }}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Main Content */}
            <div>
              <h3 className="text-3xl font-bold mb-2 text-gray-800">{tier.name}</h3>
              <p className="text-gray-700 text-lg mb-6">{tier.description}</p>

              {/* Base Price - Clean and Simple */}
              <div className="bg-white/90 rounded-lg p-6 mb-6 shadow-inner">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-800">${tier.basePrice.toLocaleString()}</div>
                    <div className="text-gray-600">Base unlimited access</div>
                  </div>
                </div>
              </div>

              {/* Add-on Options */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-800 flex items-center">
                  Optional Hard-Copy Add-ons
                </h4>
                
                {/* Print Teacher Textbooks */}
                <div className="bg-white/80 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Image className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-800">Print Teacher Textbooks</span>
                      <span className="text-sm text-gray-600">(${tier.addOns.teacherBooks} each)</span>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      value={addOns.teacherBooks}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleTeacherBooksChange(e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-20 bg-white text-gray-800 border-gray-300"
                      placeholder="0"
                    />
                  </div>
                  <div className="text-gray-600 text-sm">
                    Total: ${(addOns.teacherBooks * tier.addOns.teacherBooks).toLocaleString()}
                  </div>
                </div>

                {/* Print Student Textbooks */}
                <div className="bg-white/80 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Image className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-800">Print Student Textbooks</span>
                      <span className="text-sm text-gray-600">(${tier.addOns.studentBooks} each)</span>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      value={addOns.studentBooks}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStudentBooksChange(e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-20 bg-white text-gray-800 border-gray-300"
                      placeholder="0"
                    />
                  </div>
                  <div className="text-gray-600 text-sm">
                    Total: ${(addOns.studentBooks * tier.addOns.studentBooks).toLocaleString()}
                  </div>
                </div>

                {/* A0 Posters */}
                <div className="bg-white/80 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Image className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-800">A0 Posters</span>
                      <span className="text-sm text-gray-600">(${tier.addOns.posterA0} each)</span>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      value={addOns.posterA0}
                      onChange={(e) => {
                        e.stopPropagation();
                        handlePosterA0Change(e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-20 bg-white text-gray-800 border-gray-300"
                      placeholder="0"
                    />
                  </div>
                  <div className="text-gray-600 text-sm">
                    Total: ${(addOns.posterA0 * tier.addOns.posterA0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Inclusions */}
            <div>
              {/* Key Inclusions */}
              <div className="space-y-3">
                <h4 className="text-xl font-semibold text-gray-800">What's Included</h4>
                {getAllInclusions().map((inclusion, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>{inclusion}</span>
                  </div>
                ))}
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="mt-6 p-3 bg-orange-400 text-white rounded-lg shadow-lg">
                  <div className="flex items-center justify-center font-bold">
                    <Check className="h-5 w-5 mr-2" />
                    Selected Option
                  </div>
                </div>
              )}

              {savings > 0 && (
                <div className="mt-4 p-4 bg-white/90 rounded-lg shadow-inner text-center">
                  <div className="text-green-600 font-bold text-lg">
                    ${savings.toLocaleString()} cheaper than individual options!
                  </div>
                  <div className="text-green-500 text-sm">{percentSavings}% total savings</div>
                </div>
              )}
            </div>
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
