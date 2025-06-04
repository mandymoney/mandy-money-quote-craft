
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Image } from 'lucide-react';
import { PricingTier } from './QuoteBuilder';
import { cn } from '@/lib/utils';
import { ExpandableSection } from './ExpandableSection';
import { PricingDisplay } from './PricingDisplay';

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
  customGradient?: string;
  showSavings?: boolean;
  savings?: number;
  volumeSelector?: React.ReactNode;
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
  colorScheme = 'teal',
  customGradient,
  showSavings = false,
  savings = 0,
  volumeSelector
}) => {
  const getGradientClass = () => {
    if (customGradient) return '';
    if (colorScheme === 'yellow') {
      if (tier.id.includes('digital')) return 'from-yellow-800 via-yellow-700 to-yellow-600';
      if (tier.id.includes('physical')) return 'from-yellow-900 via-yellow-800 to-yellow-700';
      return 'from-yellow-900 via-yellow-800 to-yellow-600';
    } else {
      if (tier.id.includes('digital')) return 'from-teal-800 via-teal-700 to-teal-600';
      if (tier.id.includes('physical')) return 'from-teal-900 via-teal-800 to-teal-700';
      return 'from-teal-900 via-teal-800 to-teal-600';
    }
  };

  const getBorderClass = () => {
    if (colorScheme === 'yellow') {
      return isSelected ? 'border-yellow-400' : 'border-gray-200';
    }
    return isSelected ? 'border-teal-400' : 'border-gray-200';
  };

  // Get the appropriate product image based on tier ID
  const getProductImage = () => {
    const imageMap = {
      'teacher-digital': 'https://raw.githubusercontent.com/mandymoney/mandy-money-quote-craft/24586180d5908f398c59c364ae1084346bc6b776/100.png',
      'teacher-physical': 'https://raw.githubusercontent.com/mandymoney/mandy-money-quote-craft/24586180d5908f398c59c364ae1084346bc6b776/101.png',
      'teacher-bundle': 'https://raw.githubusercontent.com/mandymoney/mandy-money-quote-craft/63bcf350cc96ecea41b5b6012e725100d0d26886/102.png',
      'student-digital': 'https://raw.githubusercontent.com/mandymoney/mandy-money-quote-craft/24586180d5908f398c59c364ae1084346bc6b776/103.png',
      'student-physical': 'https://raw.githubusercontent.com/mandymoney/mandy-money-quote-craft/24586180d5908f398c59c364ae1084346bc6b776/104.png',
      'student-bundle': 'https://raw.githubusercontent.com/mandymoney/mandy-money-quote-craft/24586180d5908f398c59c364ae1084346bc6b776/105.png'
    };
    return imageMap[tier.id as keyof typeof imageMap];
  };

  // Get display name for tier
  const getDisplayName = () => {
    if (tier.name.includes('Digital Pass + Textbook Bundle')) {
      return tier.name.replace('Digital Pass + Textbook Bundle', 'Combo Bundle');
    }
    return tier.name;
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
      <div className="p-6">
        {/* Volume Selector at top */}
        {volumeSelector && (
          <div className="mb-4 pb-4 border-b border-gray-200">
            {volumeSelector}
          </div>
        )}

        {/* Product Image - always show for bundle tiers or when showImages is true */}
        {(showImages || tier.id.includes('bundle')) && getProductImage() && (
          <div className="mb-4">
            <img 
              src={getProductImage()}
              alt={tier.name}
              className="w-full h-32 object-contain aspect-square rounded-sm"
            />
          </div>
        )}

        {/* Header with increased height for alignment */}
        <div 
          className={cn('h-28 rounded-lg mb-4', customGradient ? '' : 'bg-gradient-to-br ' + getGradientClass())}
          style={customGradient ? { background: customGradient } : {}}
        >
          <div className="flex flex-col items-center justify-center h-full px-2">
            <div className={cn(
              "text-xs font-medium text-white/90 mb-1",
              tier.type === 'teacher' ? 'bg-white/30' : 'bg-white/30',
              "px-2 py-1 rounded"
            )}>
              {tier.type.toUpperCase()}
            </div>
            <h3 className="text-white font-bold text-lg text-center leading-tight drop-shadow-sm">{getDisplayName()}</h3>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 min-h-[40px]">{tier.description}</p>

        {/* Pricing with savings */}
        <PricingDisplay
          price={price}
          studentPrice={studentPrice}
          tierType={tier.type}
          showSavings={showSavings}
          savings={savings}
          colorScheme={colorScheme}
        />

        {/* Mobile: Expandable Inclusions */}
        <ExpandableSection
          title="Inclusions"
          items={allInclusions}
          colorScheme={colorScheme}
          isPositive={true}
          className="md:hidden mb-4"
        />

        {/* Desktop: All Inclusions - displayed without expandable */}
        <div className="hidden md:block space-y-2 mb-4">
          <h4 className={cn(
            "font-semibold text-sm",
            colorScheme === 'yellow' ? 'text-yellow-700' : 'text-teal-700'
          )}>Inclusions:</h4>
          {allInclusions.map((inclusion, index) => (
            <div key={index} className="flex items-center text-sm text-gray-700">
              <Check className={cn(
                "h-4 w-4 mr-2 flex-shrink-0",
                colorScheme === 'yellow' ? 'text-yellow-500' : 'text-teal-500'
              )} />
              <span>{inclusion}</span>
            </div>
          ))}
        </div>

        {/* What's Not Included - Mobile: Expandable, Desktop: Always shown */}
        {tier.notIncluded && tier.notIncluded.length > 0 && (
          <>
            {/* Mobile: Expandable */}
            <ExpandableSection
              title="What's Not Included"
              items={tier.notIncluded}
              isPositive={false}
              className="md:hidden mb-4"
            />

            {/* Desktop: Always shown */}
            <div className="hidden md:block space-y-2 mb-4">
              <h4 className="font-semibold text-gray-700 text-sm">What's Not Included:</h4>
              {tier.notIncluded.map((notIncluded, index) => (
                <div key={index} className="flex items-center text-sm text-gray-500">
                  <Check className="h-4 w-4 text-red-400 mr-2 flex-shrink-0" />
                  <span>{notIncluded}</span>
                </div>
              ))}
            </div>
          </>
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
