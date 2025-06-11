
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Infinity, Users, Globe, BookOpen, Award, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnlimitedSchoolCardProps {
  onSelect: () => void;
  isSelected: boolean;
  price: number;
  animationDelay?: number;
}

export const UnlimitedSchoolCard: React.FC<UnlimitedSchoolCardProps> = ({
  onSelect,
  isSelected,
  price,
  animationDelay = 0
}) => {
  const features = [
    "Unlimited student access",
    "All teacher resources included",
    "Complete digital platform",
    "Physical teacher materials",
    "Professional development",
    "Ongoing support"
  ];

  const getIcon = (feature: string) => {
    if (feature.includes('student')) return Users;
    if (feature.includes('digital')) return Globe;
    if (feature.includes('physical')) return BookOpen;
    if (feature.includes('development')) return Award;
    if (feature.includes('support')) return Zap;
    return Infinity;
  };

  return (
    <Card
      className={cn(
        'relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl',
        'bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-2',
        isSelected ? 'border-purple-400 shadow-lg' : 'border-gray-200',
        'animate-scale-in'
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={onSelect}
    >
      {/* Popular badge */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1">
          Most Popular
        </Badge>
      </div>

      <div className="p-6 pt-8">
        {/* Header */}
        <div className="h-28 rounded-lg mb-4 bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-600">
          <div className="flex flex-col items-center justify-center h-full px-2">
            <div className="text-xs font-medium text-white/90 mb-1 bg-white/30 px-2 py-1 rounded">
              UNLIMITED
            </div>
            <h3 className="text-white font-bold text-lg text-center leading-tight drop-shadow-sm">
              Whole School Access
            </h3>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 min-h-[40px]">
          Perfect for schools wanting unlimited access for all students and complete teacher resources
        </p>

        {/* Pricing */}
        <div className="mb-6 rounded-lg p-4 text-center bg-purple-50">
          <div className="text-2xl font-bold text-purple-900">
            ${price.toLocaleString()}
          </div>
          <div className="text-sm text-purple-600">
            one-time payment (inc. GST)
          </div>
          <div className="mt-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
            <Infinity className="h-4 w-4 inline mr-1" />
            Unlimited Students!
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => {
            const IconComponent = getIcon(feature);
            return (
              <div key={index} className="flex items-center text-sm text-gray-700">
                <IconComponent className="h-4 w-4 mr-2 flex-shrink-0 text-purple-500" />
                <span>{feature}</span>
              </div>
            );
          })}
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="mt-4 p-2 border rounded-lg bg-purple-50 border-purple-200">
            <div className="flex items-center justify-center font-medium text-sm text-purple-700">
              <Infinity className="h-4 w-4 mr-1" />
              Selected
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
