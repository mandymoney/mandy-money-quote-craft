
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VolumeSelectorProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  color: 'purple' | 'pink' | 'blue' | 'green';
}

export const VolumeSelector: React.FC<VolumeSelectorProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  color
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'purple':
        return {
          gradient: 'from-purple-500 to-indigo-600',
          button: 'hover:bg-purple-100 text-purple-600',
          focus: 'focus:ring-purple-500'
        };
      case 'pink':
        return {
          gradient: 'from-pink-500 to-rose-600',
          button: 'hover:bg-pink-100 text-pink-600',
          focus: 'focus:ring-pink-500'
        };
      case 'blue':
        return {
          gradient: 'from-blue-500 to-cyan-600',
          button: 'hover:bg-blue-100 text-blue-600',
          focus: 'focus:ring-blue-500'
        };
      default:
        return {
          gradient: 'from-green-500 to-teal-600',
          button: 'hover:bg-green-100 text-green-600',
          focus: 'focus:ring-green-500'
        };
    }
  };

  const colorClasses = getColorClasses();

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min;
    const clampedValue = Math.max(min, Math.min(max, newValue));
    onChange(clampedValue);
  };

  return (
    <div className="space-y-4">
      <div className={cn('h-16 rounded-lg bg-gradient-to-r', colorClasses.gradient)}>
        <div className="flex items-center justify-center h-full">
          <h3 className="text-white font-semibold text-lg">{label}</h3>
        </div>
      </div>
      
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={value <= min}
          className={cn('rounded-full transition-all duration-200', colorClasses.button)}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <Input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          className={cn(
            'w-20 text-center text-xl font-bold border-2 transition-all duration-200',
            colorClasses.focus
          )}
        />
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={value >= max}
          className={cn('rounded-full transition-all duration-200', colorClasses.button)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        Range: {min} - {max}
      </div>
    </div>
  );
};
