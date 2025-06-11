import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExpandableSection } from './ExpandableSection';
import { PricingTier } from './QuoteBuilder';

interface PricingCardProps {
  tier: PricingTier;
  price: number;
  teacherCount: number;
  studentCount: number;
  isSelected: boolean;
  onSelect: () => void;
  animationDelay: number;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  tier,
  price,
  teacherCount,
  studentCount,
  isSelected,
  onSelect,
  animationDelay
}) => {
  const calculateTotalPrice = () => {
    if (tier.type === 'teacher') {
      return price * teacherCount;
    } else if (tier.type === 'student') {
      return price * studentCount;
    } else if (tier.type === 'classroom') {
      return price;
    }
    return price;
  };

  const renderPriceDisplay = () => {
    if (tier.type === 'classroom' && price === 0) {
      return (
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-green-600">FREE</div>
          <div className="text-sm text-gray-500">Digital access only</div>
        </div>
      );
    }

    const totalPrice = calculateTotalPrice();
    const unitLabel = tier.type === 'teacher' ? 'teacher' : tier.type === 'student' ? 'student' : 'classroom';
    const count = tier.type === 'teacher' ? teacherCount : tier.type === 'student' ? studentCount : 1;

    return (
      <div className="text-center mb-4">
        <div className="text-sm text-gray-500 mb-1">
          ${price} per {unitLabel} × {count}
        </div>
        <div className="text-3xl font-bold text-gray-900">
          ${totalPrice.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500">Total price</div>
      </div>
    );
  };

  const getCardClasses = () => {
    const baseClasses = "h-full transition-all duration-300 hover:shadow-lg cursor-pointer border-2";
    
    if (isSelected) {
      return cn(baseClasses, "border-blue-500 bg-blue-50 shadow-lg transform scale-105");
    }
    
    return cn(baseClasses, "border-gray-200 hover:border-blue-300");
  };

  const getAllInclusions = () => {
    return [
      ...tier.inclusions.teacher,
      ...tier.inclusions.student,
      ...tier.inclusions.classroom
    ].filter(Boolean);
  };

  return (
    <Card 
      className={getCardClasses()}
      onClick={onSelect}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold text-gray-900">
          {tier.name}
        </CardTitle>
        <p className="text-gray-600 text-sm">{tier.description}</p>
        {renderPriceDisplay()}
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        <ExpandableSection 
          title="What's included"
          items={getAllInclusions()}
          colorScheme="teal"
          isPositive={true}
          className="mb-4"
        >
          <div></div>
        </ExpandableSection>

        {tier.notIncluded.length > 0 && (
          <ExpandableSection 
            title="Not included"
            items={tier.notIncluded}
            isPositive={false}
            className="mb-4"
          >
            <div></div>
          </ExpandableSection>
        )}

        <Button 
          className={cn(
            "w-full font-semibold transition-all duration-300",
            isSelected 
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" 
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {isSelected ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Selected
            </>
          ) : (
            'Select This Option'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
