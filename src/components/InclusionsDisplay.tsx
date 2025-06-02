
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Image } from 'lucide-react';
import { PricingTier } from './QuoteBuilder';

interface InclusionsDisplayProps {
  tier: PricingTier;
  price: number;
  teacherCount: number;
  studentCount: number;
}

export const InclusionsDisplay: React.FC<InclusionsDisplayProps> = ({
  tier,
  price,
  teacherCount,
  studentCount
}) => {
  const getGradientClass = () => {
    if (tier.isUnlimited) return 'from-indigo-500 to-purple-600';
    if (tier.isPopular) return 'from-pink-500 to-orange-500';
    if (tier.id === 'digital') return 'from-blue-500 to-cyan-500';
    return 'from-green-500 to-teal-500';
  };

  const getPriceBreakdown = () => {
    if (tier.isUnlimited) {
      return [
        { label: 'Unlimited School Access', amount: price }
      ];
    }

    let studentPrice = tier.basePrice.student;
    if (studentCount >= 50) {
      studentPrice = tier.volumeDiscounts.students50Plus;
    } else if (studentCount >= 12) {
      studentPrice = tier.volumeDiscounts.students12Plus;
    }

    return [
      { 
        label: `${teacherCount} Teacher${teacherCount > 1 ? 's' : ''} × $${tier.basePrice.teacher}`, 
        amount: tier.basePrice.teacher * teacherCount 
      },
      { 
        label: `${studentCount} Student${studentCount > 1 ? 's' : ''} × $${studentPrice}`, 
        amount: studentPrice * studentCount 
      }
    ];
  };

  return (
    <Card className="mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg animate-fade-in">
      <div className="p-8">
        {/* Header */}
        <div className={`h-24 rounded-lg bg-gradient-to-r ${getGradientClass()} mb-8`}>
          <div className="flex items-center justify-between h-full px-6">
            <div>
              <h2 className="text-white text-2xl font-bold">{tier.name}</h2>
              <p className="text-white/90">{tier.description}</p>
            </div>
            <div className="text-right">
              <div className="text-white text-3xl font-bold">${price.toLocaleString()}</div>
              <div className="text-white/90 text-sm">Total Quote</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Price Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Price Breakdown</h3>
            <div className="space-y-3">
              {getPriceBreakdown().map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-semibold text-gray-900">${item.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-2xl">${price.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Volume Discount Badge */}
            {!tier.isUnlimited && studentCount >= 12 && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                🎉 Volume discount applied!
              </Badge>
            )}
          </div>

          {/* Full Inclusions */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">What's Included</h3>
            <div className="space-y-3">
              {tier.inclusions.map((inclusion, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg transition-all duration-200 hover:from-green-100 hover:to-emerald-100">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{inclusion}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Preview */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Preview Materials</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-300">
                <div className="text-center">
                  <Image className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-purple-600 font-medium">Digital Materials</p>
                </div>
              </div>
              <div className="aspect-square bg-gradient-to-br from-orange-100 to-pink-100 rounded-lg flex items-center justify-center border-2 border-dashed border-orange-300">
                <div className="text-center">
                  <Image className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-orange-600 font-medium">Physical Books</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Upload your own preview images to customize this section
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
