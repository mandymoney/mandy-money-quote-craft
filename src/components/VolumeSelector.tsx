
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VolumeSelectorProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  color: 'teal' | 'yellow' | 'green';
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
      case 'teal':
        return {
          button: 'bg-teal-500 hover:bg-teal-600 text-white',
          input: 'border-teal-300 focus:border-teal-500',
          label: 'text-teal-700'
        };
      case 'yellow':
        return {
          button: 'bg-yellow-500 hover:bg-yellow-600 text-white',
          input: 'border-yellow-300 focus:border-yellow-500',
          label: 'text-yellow-700'
        };
      case 'green':
        return {
          button: 'bg-green-500 hover:bg-green-600 text-white',
          input: 'border-green-300 focus:border-green-500',
          label: 'text-green-700'
        };
      default:
        return {
          button: 'bg-gray-500 hover:bg-gray-600 text-white',
          input: 'border-gray-300 focus:border-gray-500',
          label: 'text-gray-700'
        };
    }
  };

  const colors = getColorClasses();

  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min;
    const clampedValue = Math.min(Math.max(newValue, min), max);
    onChange(clampedValue);
  };

  return (
    <div className="space-y-2 text-center">
      <label className={cn("block text-sm font-medium", colors.label)}>
        {label}
      </label>
      <div className="flex items-center justify-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrease}
          disabled={value <= min}
          className={cn(colors.button)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          className={cn("w-20 text-center", colors.input)}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrease}
          disabled={value >= max}
          className={cn(colors.button)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
