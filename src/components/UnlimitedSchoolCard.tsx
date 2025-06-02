
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Image, Plus, X } from 'lucide-react';
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
  const handleTeacherBooksChange = (change: number) => {
    const newCount = Math.max(0, Math.min(teacherCount, addOns.teacherBooks + change));
    onAddOnsChange({ ...addOns, teacherBooks: newCount });
  };

  const handleStudentBooksChange = (change: number) => {
    const newCount = Math.max(0, Math.min(studentCount, addOns.studentBooks + change));
    onAddOnsChange({ ...addOns, studentBooks: newCount });
  };

  return (
    <Card
      className={cn(
        'relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl mb-8',
        'bg-gradient-to-r from-indigo-500 to-purple-600 border-0 text-white',
        isSelected ? 'ring-4 ring-yellow-400 ring-opacity-70 shadow-2xl' : 'shadow-lg'
      )}
      onClick={onSelect}
    >
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 text-lg font-bold">
          🏫 BEST VALUE FOR SCHOOLS
        </Badge>
      </div>

      <div className="p-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Placeholder */}
            <div className="h-32 bg-white/20 rounded-lg mb-6 flex items-center justify-center border-2 border-dashed border-white/40">
              <div className="text-center">
                <Image className="h-12 w-12 text-white/70 mx-auto mb-2" />
                <p className="text-white/70 font-medium">Upload Unlimited Access Image</p>
              </div>
            </div>

            <h3 className="text-3xl font-bold mb-2">{tier.name}</h3>
            <p className="text-white/90 text-lg mb-6">{tier.description}</p>

            {/* Base Price */}
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <div className="text-4xl font-bold mb-2">${tier.basePrice.toLocaleString()}</div>
              <div className="text-white/90">Base unlimited access for all teachers and students</div>
            </div>

            {/* Add-on Options */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-white">Optional Hard-Copy Add-ons</h4>
              
              {/* Teacher Books */}
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Teacher Hard-Copy Books (${tier.addOns.teacherBooks} each)</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTeacherBooksChange(-1);
                      }}
                      disabled={addOns.teacherBooks <= 0}
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-bold">{addOns.teacherBooks}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTeacherBooksChange(1);
                      }}
                      disabled={addOns.teacherBooks >= teacherCount}
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-white/80 text-sm">
                  ${(addOns.teacherBooks * tier.addOns.teacherBooks).toLocaleString()} total
                </div>
              </div>

              {/* Student Books */}
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Student Hard-Copy Books (${tier.addOns.studentBooks} each)</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStudentBooksChange(-1);
                      }}
                      disabled={addOns.studentBooks <= 0}
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-bold">{addOns.studentBooks}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStudentBooksChange(1);
                      }}
                      disabled={addOns.studentBooks >= studentCount}
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
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
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${pricing.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (10%):</span>
                  <span>${pricing.gst.toLocaleString()}</span>
                </div>
                <div className="border-t border-white/30 pt-2">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total:</span>
                    <span>${pricing.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Inclusions */}
            <div className="space-y-3">
              <h4 className="text-xl font-semibold">What's Included</h4>
              {tier.inclusions.slice(0, 6).map((inclusion, index) => (
                <div key={index} className="flex items-center text-white/90">
                  <Check className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
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
              <div className="mt-6 p-3 bg-yellow-400 text-black rounded-lg">
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
  );
};
