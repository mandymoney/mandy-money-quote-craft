
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Check, Image, Star } from 'lucide-react';
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
}

export const UnlimitedSchoolCard: React.FC<UnlimitedSchoolCardProps> = ({
  tier,
  isSelected,
  onSelect,
  addOns,
  onAddOnsChange,
  pricing,
  teacherCount,
  studentCount
}) => {
  const handleTeacherBooksChange = (value: string) => {
    const newCount = Math.max(0, parseInt(value) || 0);
    onAddOnsChange({ ...addOns, teacherBooks: newCount });
  };

  const handleStudentBooksChange = (value: string) => {
    const newCount = Math.max(0, parseInt(value) || 0);
    onAddOnsChange({ ...addOns, studentBooks: newCount });
  };

  return (
    <Card className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Alternative: Unlimited School Access</h2>
        <p className="text-gray-600">Perfect for schools with 50+ students seeking maximum value</p>
      </div>

      <Card
        className={cn(
          'relative cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl',
          'bg-gradient-to-r from-green-400 to-green-500 border-0 text-white',
          isSelected ? 'ring-4 ring-green-300 ring-opacity-70 shadow-2xl' : 'shadow-lg'
        )}
        onClick={onSelect}
      >
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-2 text-lg font-bold">
            🏫 BEST VALUE FOR SCHOOLS
          </Badge>
        </div>

        <div className="p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Main Content */}
            <div>
              <h3 className="text-3xl font-bold mb-2">{tier.name}</h3>
              <p className="text-white/90 text-lg mb-6">{tier.description}</p>

              {/* Base Price */}
              <div className="bg-white/20 rounded-lg p-6 mb-6">
                <div className="text-4xl font-bold mb-2">${tier.basePrice.toLocaleString()}</div>
                <div className="text-white/90">Base unlimited access for all teachers and students</div>
              </div>

              {/* Add-on Options */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white">Optional Hard-Copy Add-ons</h4>
                
                {/* Teacher Books */}
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded flex items-center justify-center">
                        <Image className="h-6 w-6 text-white/70" />
                      </div>
                      <span className="font-semibold">Teacher Books (${tier.addOns.teacherBooks} each)</span>
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
                      className="w-20 bg-white/20 text-white border-white/30"
                    />
                  </div>
                  <div className="text-white/80 text-sm">
                    ${(addOns.teacherBooks * tier.addOns.teacherBooks).toLocaleString()} total
                  </div>
                </div>

                {/* Student Books */}
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded flex items-center justify-center">
                        <Image className="h-6 w-6 text-white/70" />
                      </div>
                      <span className="font-semibold">Student Books (${tier.addOns.studentBooks} each)</span>
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
                      className="w-20 bg-white/20 text-white border-white/30"
                    />
                  </div>
                  <div className="text-white/80 text-sm">
                    ${(addOns.studentBooks * tier.addOns.studentBooks).toLocaleString()} total
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Inclusions */}
            <div>
              {/* Total Pricing */}
              <div className="bg-white/20 rounded-lg p-6 mb-6">
                <h4 className="text-xl font-semibold mb-4">Total Price</h4>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">${pricing.total.toLocaleString()}</div>
                  <div className="text-white/90 text-sm">Total Price</div>
                </div>
              </div>

              {/* Key Inclusions */}
              <div className="space-y-3">
                <h4 className="text-xl font-semibold">What's Included</h4>
                {tier.inclusions.slice(0, 6).map((inclusion, index) => (
                  <div key={index} className="flex items-center text-white/90">
                    <Check className="h-5 w-5 text-green-200 mr-3 flex-shrink-0" />
                    <span>{inclusion}</span>
                  </div>
                ))}
                {tier.inclusions.length > 6 && (
                  <div className="text-white/80 font-medium">
                    +{tier.inclusions.length - 6} more features
                  </div>
                )}
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="mt-6 p-3 bg-orange-400 text-white rounded-lg">
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
