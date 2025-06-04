
import React from 'react';
import { Check } from 'lucide-react';

interface UnlimitedInclusionsProps {
  inclusions: string[];
  addOns: {
    teacherBooks: number;
    studentBooks: number;
    posterA0: number;
  };
  isSelected: boolean;
}

export const UnlimitedInclusions: React.FC<UnlimitedInclusionsProps> = ({
  inclusions,
  addOns,
  isSelected
}) => {
  // Get all inclusions including add-ons
  const getAllInclusions = () => {
    const allInclusions = [...inclusions];
    
    if (addOns.teacherBooks > 0) {
      allInclusions.push(`${addOns.teacherBooks} x Teacher Print Textbook${addOns.teacherBooks > 1 ? 's' : ''}`);
    }
    if (addOns.studentBooks > 0) {
      allInclusions.push(`${addOns.studentBooks} x Student Print Textbook${addOns.studentBooks > 1 ? 's' : ''}`);
    }
    if (addOns.posterA0 > 0) {
      allInclusions.push(`${addOns.posterA0} x A0 Poster${addOns.posterA0 > 1 ? 's' : ''}`);
    }
    
    return allInclusions;
  };

  return (
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
    </div>
  );
};
