
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Check, Image, Star, TrendingUp, DollarSign } from 'lucide-react';
import { UnlimitedTier } from './QuoteBuilder';
import { cn } from '@/lib/utils';

interface UnlimitedSchoolCardProps {
  tier: UnlimitedTier;
  isSelected: boolean;
  onSelect: () => void;
  addOns: {
    teacherBooks: number;
    studentBooks: number;
  };
  onAddOnsChange: (addOns: { teacherBooks: number; studentBooks: number }) => void;
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

  const savings = regularPricing.total - pricing.total;
  const percentSavings = Math.round((savings / regularPricing.total) * 100);

  return (
    <Card className="mb-8 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Alternative: Unlimited School Access</h2>
        <p className="text-gray-600">Perfect for schools with 50+ students seeking maximum value</p>
      </div>

      <Card
        className={cn(
          'relative cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl',
          'border-0 text-white overflow-hidden',
          isSelected ? 'ring-4 ring-green-300 ring-opacity-70 shadow-2xl animate-pulse' : 'shadow-lg hover:animate-pulse'
        )}
        style={{ 
          background: 'linear-gradient(135deg, #ebff00, #8ace00)',
          animation: isSelected ? 'pulse 2s infinite' : ''
        }}
        onClick={onSelect}
      >
        {/* Animated Value Comparison */}
        {savings > 0 && (
          <div className="absolute -top-4 -right-4 bg-red-500 text-white px-6 py-3 rounded-full text-sm font-bold animate-bounce shadow-lg">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              Save ${savings.toLocaleString()}!
            </div>
            <div className="text-xs">{percentSavings}% savings</div>
          </div>
        )}

        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-2 text-lg font-bold animate-bounce">
            🏫 BEST VALUE FOR SCHOOLS
          </Badge>
        </div>

        <div className="p-8">
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
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Includes all teachers</div>
                    <div className="text-sm text-gray-500">& all students</div>
                  </div>
                </div>
              </div>

              {/* Add-on Options - Simplified */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-800">Optional Hard-Copy Add-ons</h4>
                
                {/* Teacher Books */}
                <div className="bg-white/80 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Image className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-800">Teacher Books</span>
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

                {/* Student Books */}
                <div className="bg-white/80 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Image className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-800">Student Books</span>
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
              </div>
            </div>

            {/* Pricing & Inclusions */}
            <div>
              {/* Total Pricing - Prominent */}
              <div className="bg-white/90 rounded-lg p-6 mb-6 shadow-inner">
                <h4 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Total Price
                </h4>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 text-gray-800">${pricing.total.toLocaleString()}</div>
                  <div className="text-gray-600 text-sm">Complete Package</div>
                  {savings > 0 && (
                    <div className="mt-2 text-green-600 font-bold">
                      ${savings.toLocaleString()} cheaper than individual options!
                    </div>
                  )}
                </div>
              </div>

              {/* Key Inclusions */}
              <div className="space-y-3">
                <h4 className="text-xl font-semibold text-gray-800">What's Included</h4>
                {tier.inclusions.slice(0, 6).map((inclusion, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>{inclusion}</span>
                  </div>
                ))}
                {tier.inclusions.length > 6 && (
                  <div className="text-gray-700 font-medium">
                    +{tier.inclusions.length - 6} more inclusions
                  </div>
                )}
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="mt-6 p-3 bg-orange-400 text-white rounded-lg shadow-lg animate-pulse">
                  <div className="flex items-center justify-center font-bold">
                    <Check className="h-5 w-5 mr-2" />
                    Selected Option
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Card>
  );
};
