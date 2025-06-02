
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Image, Star, X } from 'lucide-react';
import { PricingTier } from './QuoteBuilder';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  tier: PricingTier;
  price: number;
  isSelected: boolean;
  onSelect: () => void;
  teacherCount: number;
  studentCount: number;
  animationDelay: number;
  showImages?: boolean;
  studentPrice?: number;
  includeGST?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  tier,
  price,
  isSelected,
  onSelect,
  teacherCount,
  studentCount,
  animationDelay,
  showImages = false,
  studentPrice,
  includeGST = false
}) => {
  const getGradientClass = () => {
    if (tier.type === 'teacher') {
      if (tier.id.includes('digital')) return 'from-orange-500 to-orange-600';
      if (tier.id.includes('physical')) return 'from-green-500 to-teal-500';
      return 'from-orange-600 to-red-500';
    } else {
      if (tier.id.includes('digital')) return 'from-blue-500 to-cyan-500';
      if (tier.id.includes('physical')) return 'from-emerald-500 to-green-500';
      return 'from-blue-600 to-purple-500';
    }
  };

  const getBorderClass = () => {
    if (tier.type === 'teacher') {
      if (tier.id.includes('digital')) return 'border-orange-200';
      if (tier.id.includes('physical')) return 'border-green-200';
      return 'border-orange-200';
    } else {
      if (tier.id.includes('digital')) return 'border-blue-200';
      if (tier.id.includes('physical')) return 'border-emerald-200';
      return 'border-blue-200';
    }
  };

  const allInclusions = [
    ...tier.inclusions.teacher,
    ...tier.inclusions.student,
    ...tier.inclusions.classroom
  ];

  return (
    <Card
      className={cn(
        'relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl',
        'bg-white border-2',
        isSelected ? `${getBorderClass()} shadow-lg ring-4 ring-opacity-50` : 'border-gray-200',
        'animate-scale-in'
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={onSelect}
    >
      {tier.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}

      <div className="p-6">
        {/* Image Placeholder */}
        {showImages && (
          <div className="h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">Upload {tier.name} Image</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className={cn('h-20 rounded-lg mb-4 bg-gradient-to-r', getGradientClass())}>
          <div className="flex items-center justify-center h-full">
            <h3 className="text-white font-bold text-lg text-center">{tier.name}</h3>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 min-h-[40px]">{tier.description}</p>

        {/* Best For */}
        {tier.bestFor && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center text-yellow-800">
              <Star className="h-4 w-4 mr-2 text-yellow-600" />
              <span className="text-sm font-medium">Best for: {tier.bestFor}</span>
            </div>
          </div>
        )}

        {/* Simple Pricing */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            ${(studentPrice || price).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            per {tier.type}{includeGST ? '' : ' (exc. GST)'}
          </div>
        </div>

        {/* Key Inclusions */}
        <div className="space-y-2 mb-4">
          <h4 className="font-semibold text-gray-700 text-sm">What's Included:</h4>
          {allInclusions.slice(0, 3).map((inclusion, index) => (
            <div key={index} className="flex items-center text-sm text-gray-700">
              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              <span>{inclusion}</span>
            </div>
          ))}
          {allInclusions.length > 3 && (
            <div className="text-sm text-gray-500 font-medium">
              +{allInclusions.length - 3} more features
            </div>
          )}
        </div>

        {/* What's Not Included */}
        {tier.notIncluded && tier.notIncluded.length > 0 && (
          <div className="space-y-2 mb-4">
            <h4 className="font-semibold text-gray-700 text-sm">What's Not Included:</h4>
            {tier.notIncluded.slice(0, 2).map((notIncluded, index) => (
              <div key={index} className="flex items-center text-sm text-gray-500">
                <X className="h-4 w-4 text-red-400 mr-2 flex-shrink-0" />
                <span>{notIncluded}</span>
              </div>
            ))}
          </div>
        )}

        {/* Selection Indicator */}
        {isSelected && (
          <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-center text-green-700 font-medium text-sm">
              <Check className="h-4 w-4 mr-1" />
              Selected
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
