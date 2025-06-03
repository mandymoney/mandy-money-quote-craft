
import React from 'react';
import { cn } from '@/lib/utils';

interface PricingDisplayProps {
  price: number;
  studentPrice?: number;
  tierType: string;
  showSavings?: boolean;
  savings?: number;
  colorScheme?: 'teal' | 'yellow';
}

export const PricingDisplay: React.FC<PricingDisplayProps> = ({
  price,
  studentPrice,
  tierType,
  showSavings = false,
  savings = 0,
  colorScheme = 'teal'
}) => {
  return (
    <div className={cn(
      "mb-6 rounded-lg p-4 text-center",
      colorScheme === 'yellow' ? 'bg-yellow-50' : 'bg-teal-50'
    )}>
      <div className={cn(
        "text-2xl font-bold",
        colorScheme === 'yellow' ? 'text-yellow-900' : 'text-teal-900'
      )}>
        ${(studentPrice || price).toLocaleString()}
      </div>
      <div className={cn(
        "text-sm",
        colorScheme === 'yellow' ? 'text-yellow-600' : 'text-teal-600'
      )}>
        per {tierType} (inc. GST)
      </div>
      
      {showSavings && savings > 0 && (
        <div className="mt-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
          Save ${savings}/student!
        </div>
      )}
    </div>
  );
};
