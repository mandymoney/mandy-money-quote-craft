
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { ManualAddressInputs } from './ManualAddressInputs';
import { formatDisplayAddress } from '@/utils/addressUtils';

interface AddressComponents {
  streetNumber: string;
  streetName: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

interface AddressInputProps {
  label: string;
  value: AddressComponents;
  onChange: (address: AddressComponents) => void;
  placeholder?: string;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "Start typing your address..."
}) => {
  const [searchValue, setSearchValue] = useState('');
  const { isLoaded, inputRef } = useGoogleMaps((components) => {
    onChange(components);
    setSearchValue(formatDisplayAddress(components));
  });

  const handleManualChange = (field: keyof AddressComponents, fieldValue: string) => {
    const newAddress = { ...value, [field]: fieldValue };
    onChange(newAddress);
  };

  // Update search value when value prop changes
  useEffect(() => {
    if (value) {
      setSearchValue(formatDisplayAddress(value));
    }
  }, [value]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="address-search" className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            id="address-search"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={placeholder}
            className="pl-10"
          />
        </div>
        {!isLoaded && (
          <p className="text-xs text-gray-500 mt-1">Loading address search...</p>
        )}
      </div>

      <ManualAddressInputs 
        value={value}
        onChange={handleManualChange}
      />
    </div>
  );
};
