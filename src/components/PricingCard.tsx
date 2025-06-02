
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
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
}

export const PricingCard: React.FC<PricingCardProps> = ({
  tier,
  price,
  isSelected,
  onSelect,
  teacherCount,
  studentCount,
  animationDelay
}) => {
  const getGradientClass = () => {
    if (tier.isUnlimited) return 'from-indigo-500 to-purple-600';
    if (tier.isPopular) return 'from-pink-500 to-orange-500';
    if (tier.id === 'digital') return 'from-blue-500 to-cyan-500';
    return 'from-green-500 to-teal-500';
  };

  const getBorderClass = () => {
    if (tier.isUnlimited) return 'border-indigo-200';
    if (tier.isPopular) return 'border-pink-200';
    if (tier.id === 'digital') return 'border-blue-200';
    return 'border-green-200';
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
      
      {tier.isUnlimited && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1">
            Best for Schools
          </Badge>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className={cn('h-20 rounded-lg mb-4 bg-gradient-to-r', getGradientClass())}>
          <div className="flex items-center justify-center h-full">
            <h3 className="text-white font-bold text-lg text-center">{tier.name}</h3>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 min-h-[40px]">{tier.description}</p>

        {/* Price */}
        <div className="mb-6">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            ${price.toLocaleString()}
          </div>
          {!tier.isUnlimited && (
            <div className="text-sm text-gray-500">
              {teacherCount} teacher{teacherCount > 1 ? 's' : ''} + {studentCount} student{studentCount > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Key Inclusions */}
        <div className="space-y-2">
          {tier.inclusions.slice(0, 3).map((inclusion, index) => (
            <div key={index} className="flex items-center text-sm text-gray-700">
              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              <span>{inclusion}</span>
            </div>
          ))}
          {tier.inclusions.length > 3 && (
            <div className="text-sm text-gray-500 font-medium">
              +{tier.inclusions.length - 3} more features
            </div>
          )}
        </div>

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
