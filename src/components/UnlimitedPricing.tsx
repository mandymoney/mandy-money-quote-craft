
import React from 'react';
import { TrendingUp } from 'lucide-react';

interface UnlimitedPricingProps {
  basePrice: number;
  pricing: {
    subtotal: number;
    gst: number;
    total: number;
  };
  regularPricing: {
    total: number;
  };
}

export const UnlimitedPricing: React.FC<UnlimitedPricingProps> = ({
  basePrice,
  pricing,
  regularPricing
}) => {
  const savings = regularPricing.total - pricing.total;
  const percentSavings = Math.round((savings / regularPricing.total) * 100);

  return (
    <>
      {/* Savings Badge */}
      {savings > 0 && (
        <div className="absolute -top-4 -right-4 bg-red-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg">
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            Save ${savings.toLocaleString()}!
          </div>
          <div className="text-xs">{percentSavings}% savings</div>
        </div>
      )}

      {/* Base Price Display */}
      <div className="bg-white/90 rounded-lg p-6 mb-6 shadow-inner">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-800">${basePrice.toLocaleString()}</div>
            <div className="text-gray-600">Base unlimited access</div>
          </div>
        </div>
      </div>

      {/* Savings Display */}
      {savings > 0 && (
        <div className="mt-4 p-4 bg-white/90 rounded-lg shadow-inner text-center">
          <div className="text-green-600 font-bold text-lg">
            ${savings.toLocaleString()} cheaper than individual options!
          </div>
          <div className="text-green-500 text-sm">{percentSavings}% total savings</div>
        </div>
      )}
    </>
  );
};
