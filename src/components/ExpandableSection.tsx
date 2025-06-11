
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpandableSectionProps {
  title: string;
  items: string[];
  colorScheme?: 'teal' | 'yellow';
  isPositive?: boolean;
  className?: string;
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  items,
  colorScheme = 'teal',
  isPositive = true,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getButtonClass = () => {
    if (isPositive) {
      return colorScheme === 'yellow' 
        ? 'bg-yellow-50 text-yellow-700' 
        : 'bg-teal-50 text-teal-700';
    }
    return 'bg-gray-50 text-gray-700';
  };

  const getIconClass = () => {
    if (isPositive) {
      return colorScheme === 'yellow' ? 'text-yellow-500' : 'text-teal-500';
    }
    return 'text-red-400';
  };

  return (
    <div className={className}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className={cn(
          "w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold",
          getButtonClass()
        )}
      >
        <span>{title} ({items.length})</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-2 space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center text-sm text-gray-700 px-3">
              {isPositive ? (
                <Check className={cn("h-3 w-3 mr-2 flex-shrink-0", getIconClass())} />
              ) : (
                <X className="h-3 w-3 text-red-400 mr-2 flex-shrink-0" />
              )}
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
