
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
  colorScheme?: 'teal' | 'yellow';
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
  includeGST = false,
  colorScheme = 'teal'
}) => {
  const getGradientClass = () => {
    if (colorScheme === 'yellow') {
      if (tier.id.includes('digital')) return 'from-yellow-400 to-yellow-500';
      if (tier.id.includes('physical')) return 'from-yellow-500 to-yellow-600';
      return 'from-yellow-600 to-yellow-700';
    } else {
      if (tier.id.includes('digital')) return 'from-teal-400 to-teal-500';
      if (tier.id.includes('physical')) return 'from-teal-500 to-teal-600';
      return 'from-teal-600 to-teal-700';
    }
  };

  const getBorderClass = () => {
    if (colorScheme === 'yellow') {
      return isSelected ? 'border-yellow-400' : 'border-gray-200';
    }
    return isSelected ? 'border-teal-400' : 'border-gray-200';
  };

  const getAccentColor = () => {
    return colorScheme === 'yellow' ? 'yellow' : 'teal';
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
        getBorderClass(),
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
          <div className={cn(
            "h-32 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed",
            colorScheme === 'yellow' ? 'bg-yellow-50 border-yellow-300' : 'bg-teal-50 border-teal-300'
          )}>
            <div className="text-center">
              <Image className={cn("h-8 w-8 mx-auto mb-2", colorScheme === 'yellow' ? 'text-yellow-400' : 'text-teal-400')} />
              <p className={cn("text-sm font-medium", colorScheme === 'yellow' ? 'text-yellow-500' : 'text-teal-500')}>
                Upload {tier.name} Image
              </p>
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
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center text-amber-800">
              <Star className="h-4 w-4 mr-2 text-amber-600" />
              <span className="text-sm font-medium">Best for: {tier.bestFor}</span>
            </div>
          </div>
        )}

        {/* Simple Pricing */}
        <div className={cn(
          "mb-6 rounded-lg p-4 text-center",
          colorScheme === 'yellow' ? 'bg-yellow-50' : 'bg-teal-50'
        )}>
          <div className={cn(
            "text-2xl font-bold",
            colorScheme === 'yellow' ? 'text-yellow-900' : 'text-teal-900'
          )}>
            ${(studentPrice || price).toLocaleString()}
          </div>
          <div className={cn(
            "text-sm",
            colorScheme === 'yellow' ? 'text-yellow-600' : 'text-teal-600'
          )}>
            per {tier.type} (inc. GST)
          </div>
        </div>

        {/* Key Features */}
        <div className="space-y-2 mb-4">
          <h4 className={cn(
            "font-semibold text-sm",
            colorScheme === 'yellow' ? 'text-yellow-700' : 'text-teal-700'
          )}>Features Included:</h4>
          {allInclusions.slice(0, 3).map((inclusion, index) => (
            <div key={index} className="flex items-center text-sm text-gray-700">
              <Check className={cn(
                "h-4 w-4 mr-2 flex-shrink-0",
                colorScheme === 'yellow' ? 'text-yellow-500' : 'text-teal-500'
              )} />
              <span>{inclusion}</span>
            </div>
          ))}
          {allInclusions.length > 3 && (
            <div className={cn(
              "text-sm font-medium",
              colorScheme === 'yellow' ? 'text-yellow-500' : 'text-teal-500'
            )}>
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
          <div className={cn(
            "mt-4 p-2 border rounded-lg",
            colorScheme === 'yellow' 
              ? 'bg-yellow-50 border-yellow-200' 
              : 'bg-teal-50 border-teal-200'
          )}>
            <div className={cn(
              "flex items-center justify-center font-medium text-sm",
              colorScheme === 'yellow' ? 'text-yellow-700' : 'text-teal-700'
            )}>
              <Check className="h-4 w-4 mr-1" />
              Selected
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
