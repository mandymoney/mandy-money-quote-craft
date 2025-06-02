
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Image, Star, Plus, Zap, TrendingUp } from 'lucide-react';
import { UnlimitedTier } from './QuoteBuilder';
import { cn } from '@/lib/utils';

interface UnlimitedSchoolCardProps {
  tier: UnlimitedTier;
  isSelected: boolean;
  onSelect: () => void;
  addOns: {
    teacherBooks: number;
    studentBooks: number;
    posterA0: number;
  };
  onAddOnsChange: (addOns: { teacherBooks: number; studentBooks: number; posterA0: number }) => void;
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

  const handlePosterA0Change = (value: string) => {
    const newCount = Math.max(0, parseInt(value) || 0);
    onAddOnsChange({ ...addOns, posterA0: newCount });
  };

  const regularPrice = studentCount * 55 + teacherCount * 189; // Approximate comparison
  const savings = regularPrice > tier.basePrice ? regularPrice - tier.basePrice : 0;

  return (
    <div className="mb-8 relative">
      <Card
        className={cn(
          'relative cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl',
          'bg-gradient-to-r from-yellow-300 via-lime-300 to-green-400 border-0 text-gray-800 overflow-hidden',
          isSelected ? 'ring-4 ring-yellow-300 ring-opacity-70 shadow-2xl scale-[1.02]' : 'shadow-lg',
          'animate-pulse hover:animate-none'
        )}
        onClick={onSelect}
      >
        {/* Exciting Banner */}
        <div className="absolute top-4 right-4 transform rotate-12 z-10">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 text-sm font-bold shadow-lg">
            🔥 BEST VALUE
          </Badge>
        </div>

        <div className="p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Main Content */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <Zap className="h-8 w-8 text-yellow-600 animate-bounce" />
                <h3 className="text-3xl font-bold">{tier.name}</h3>
              </div>
              <p className="text-gray-700 text-lg mb-6">{tier.description}</p>

              {/* Value Comparison */}
              {savings > 0 && (
                <div className="bg-white/80 rounded-lg p-4 mb-6 border-2 border-green-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-bold text-green-800">MASSIVE SAVINGS!</span>
                  </div>
                  <div className="text-sm text-gray-700">
                    Save over ${savings.toLocaleString()} vs individual pricing!
                  </div>
                </div>
              )}

              {/* Base Price */}
              <div className="bg-white/90 rounded-lg p-6 mb-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Base Package</div>
                    <div className="text-3xl font-bold text-gray-800">${tier.basePrice.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Unlimited digital access for all</div>
                  </div>
                  <Check className="h-8 w-8 text-green-500" />
                </div>
              </div>

              {/* Add-on Options */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Plus className="h-5 w-5 text-gray-700" />
                  <h4 className="text-xl font-semibold">+ Optional Hard-Copy Add-ons</h4>
                </div>
                
                {/* Teacher Books */}
                <div className="bg-white/70 rounded-lg p-4 hover:bg-white/90 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-teal-500 rounded flex items-center justify-center">
                        <Image className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="font-semibold">+ Teacher Books</span>
                        <div className="text-sm text-gray-600">${tier.addOns.teacherBooks} each</div>
                      </div>
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
                      className="w-20 bg-white border-gray-300"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Total: ${(addOns.teacherBooks * tier.addOns.teacherBooks).toLocaleString()}
                  </div>
                </div>

                {/* Student Books */}
                <div className="bg-white/70 rounded-lg p-4 hover:bg-white/90 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded flex items-center justify-center">
                        <Image className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="font-semibold">+ Student Books</span>
                        <div className="text-sm text-gray-600">${tier.addOns.studentBooks} each</div>
                      </div>
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
                      className="w-20 bg-white border-gray-300"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Total: ${(addOns.studentBooks * tier.addOns.studentBooks).toLocaleString()}
                  </div>
                </div>

                {/* A0 Poster */}
                <div className="bg-white/70 rounded-lg p-4 hover:bg-white/90 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center">
                        <Image className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="font-semibold">+ A0 Poster</span>
                        <div className="text-sm text-gray-600">${tier.addOns.posterA0} each</div>
                      </div>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      value={addOns.posterA0}
                      onChange={(e) => {
                        e.stopPropagation();
                        handlePosterA0Change(e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-20 bg-white border-gray-300"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Total: ${(addOns.posterA0 * tier.addOns.posterA0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Inclusions */}
            <div>
              {/* Key Inclusions */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xl font-semibold">What's Included</h4>
                {tier.inclusions.map((inclusion, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>{inclusion}</span>
                  </div>
                ))}
              </div>

              {/* Call to Action */}
              {isSelected && (
                <div className="mt-6 p-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg">
                  <div className="flex items-center justify-center font-bold text-lg">
                    <Check className="h-6 w-6 mr-2" />
                    Selected Option ✨
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Bottom Banner */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 rotate-1">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-2 rounded-full shadow-lg transform skew-x-12">
          <span className="font-bold text-sm">Perfect for schools looking to prioritise financial empowerment as a core learning pillar</span>
        </div>
      </div>
    </div>
  );
};
