
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

// Product image mapping
const getProductImage = (tierId: string): string => {
  const imageMap: { [key: string]: string } = {
    'teacher-digital': 'https://raw.githubusercontent.com/mandymoney/mandy-money-quote-craft/24586180d5908f398c59c364ae1084346bc6b776/100.png',
    'teacher-physical': 'https://raw.githubusercontent.com/mandymoney/mandy-money-quote-craft/24586180d5908f398c59c364ae1084346bc6b776/101.png',
    'teacher-bundle': 'https://raw.githubusercontent.com/mandymoney/mandy-money-quote-craft/24586180d5908f398c59c364ae1084346bc6b776/102.png',
    'student-digital': 'https://raw.githubusercontent.com/mandymoney/mandy-money-quote-craft/24586180d5908f398c59c364ae1084346bc6b776/103.png',
    'student-physical': 'https://raw.githubusercontent.com/mandymoney/mandy-money-quote-craft/24586180d5908f398c59c364ae1084346bc6b776/104.png',
    'student-bundle': 'https://raw.githubusercontent.com/mandymoney/mandy-money-quote-craft/24586180d5908f398c59c364ae1084346bc6b776/105.png'
  };
  return imageMap[tierId] || '';
};

// Get product type and name with subheading
const getProductInfo = (tier: PricingTier) => {
  const isTeacher = tier.id.includes('teacher');
  const productType = isTeacher ? 'Teacher' : 'Student';
  const subheading = isTeacher ? 'TEACHER' : 'STUDENT';
  
  // Clean the tier name and ensure it includes the product type
  let productName = tier.name;
  if (!productName.toLowerCase().includes('teacher') && !productName.toLowerCase().includes('student')) {
    productName = `${productType} ${productName}`;
  }
  
  return { productType, subheading, productName };
};

export const PricingCard: React.FC<PricingCardProps> = ({
  tier,
  price,
  isSelected,
  onSelect,
  teacherCount,
  studentCount,
  animationDelay,
  showImages = true,
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

  const allInclusions = [
    ...tier.inclusions.teacher,
    ...tier.inclusions.student,
    ...tier.inclusions.classroom
  ];

  const productInfo = getProductInfo(tier);
  const productImage = getProductImage(tier.id);

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
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 hidden md:block">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}

      <div className="p-6">
        {/* Volume Selector at top */}
        {volumeSelector && (
          <div className="mb-4 pb-4 border-b border-gray-200">
            {volumeSelector}
          </div>
        )}

        {/* Product Image */}
        {showImages && productImage && (
          <div className="h-32 rounded-lg mb-4 overflow-hidden">
            <img 
              src={productImage}
              alt={`${productInfo.productName} Image`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.className = cn(
                    "h-32 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed",
                    colorScheme === 'yellow' ? 'bg-yellow-50 border-yellow-300' : 'bg-teal-50 border-teal-300'
                  );
                  parent.innerHTML = `
                    <div class="text-center">
                      <div class="h-8 w-8 mx-auto mb-2 ${colorScheme === 'yellow' ? 'text-yellow-400' : 'text-teal-400'}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                      </div>
                      <p class="text-sm font-medium ${colorScheme === 'yellow' ? 'text-yellow-500' : 'text-teal-500'}">
                        ${productInfo.productName}
                      </p>
                    </div>
                  `;
                }
              }}
            />
          </div>
        )}

        {/* Header with subheading */}
        <div className="mb-4">
          {/* Product Type Subheading */}
          <div className={cn(
            "text-xs font-bold uppercase tracking-wide mb-1",
            colorScheme === 'yellow' ? 'text-yellow-600' : 'text-teal-600'
          )}>
            {productInfo.subheading}
          </div>
          
          {/* Product Header */}
          <div 
            className={cn('h-20 rounded-lg flex items-center justify-center', customGradient ? '' : 'bg-gradient-to-r ' + getGradientClass())}
            style={customGradient ? { background: customGradient } : {}}
          >
            <h3 className="text-white font-bold text-lg text-center px-2">{productInfo.productName}</h3>
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
