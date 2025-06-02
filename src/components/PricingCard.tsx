
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Image } from 'lucide-react';
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
  studentPrice
}) => {
  const getGradientClass = () => {
    if (tier.type === 'teacher') {
      if (tier.id.includes('digital')) return 'from-blue-500 to-cyan-500';
      if (tier.id.includes('physical')) return 'from-green-500 to-teal-500';
      return 'from-purple-500 to-indigo-500';
    } else {
      if (tier.id.includes('digital')) return 'from-orange-500 to-red-500';
      if (tier.id.includes('physical')) return 'from-emerald-500 to-green-500';
      return 'from-pink-500 to-rose-500';
    }
  };

  const getBorderClass = () => {
    if (tier.type === 'teacher') {
      if (tier.id.includes('digital')) return 'border-blue-200';
      if (tier.id.includes('physical')) return 'border-green-200';
      return 'border-purple-200';
    } else {
      if (tier.id.includes('digital')) return 'border-orange-200';
      if (tier.id.includes('physical')) return 'border-emerald-200';
      return 'border-pink-200';
    }
  };

  const allInclusions = [
    ...tier.inclusions.teacher,
    ...tier.inclusions.student,
    ...tier.inclusions.classroom
  ];

  const getItemPrice = () => {
    if (tier.type === 'teacher') {
      return tier.basePrice.teacher;
    } else {
      return studentPrice || tier.basePrice.student;
    }
  };

  const getQuantity = () => {
    return tier.type === 'teacher' ? teacherCount : studentCount;
  };

  return (
    <Card
      className={cn(
        'relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl',
        'bg-white/90 backdrop-blur-sm border-2',
        isSelected ? `${getBorderClass()} shadow-lg ring-4 ring-opacity-50` : 'border-gray-200',
        'animate-scale-in'
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={onSelect}
    >
      {tier.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-1">
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

        {/* Pricing Breakdown */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-2">Per {tier.type} price:</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ${getItemPrice().toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mb-3">
            × {getQuantity()} {tier.type}{getQuantity() > 1 ? 's' : ''}
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold text-gray-900">${price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Key Inclusions */}
        <div className="space-y-2">
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

        {/* Classroom Space Notice */}
        {(teacherCount > 0 && studentCount > 0) && tier.inclusions.classroom.length > 0 && (
          <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-blue-700 font-medium text-sm">
              ✓ Includes classroom space & student tracking
            </div>
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
