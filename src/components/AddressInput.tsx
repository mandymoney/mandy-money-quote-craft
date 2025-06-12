
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, CheckCircle } from 'lucide-react';
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
  const [hasValidAddress, setHasValidAddress] = useState(false);
  const { isLoaded, inputRef } = useGoogleMaps((components) => {
    onChange(components);
    setSearchValue(formatDisplayAddress(components));
    setHasValidAddress(true);
  });

  const handleManualChange = (field: keyof AddressComponents, fieldValue: string) => {
    const newAddress = { ...value, [field]: fieldValue };
    onChange(newAddress);
    // Check if we have a reasonably complete address
    const isComplete = newAddress.streetNumber && newAddress.streetName && newAddress.suburb && newAddress.state && newAddress.postcode;
    setHasValidAddress(!!isComplete);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    
    // If user clears the search, reset the validation
    if (!newValue) {
      setHasValidAddress(false);
    }
  };

  // Update search value when value prop changes
  useEffect(() => {
    if (value) {
      const formatted = formatDisplayAddress(value);
      setSearchValue(formatted);
      // Check if address is complete
      const isComplete = value.streetNumber && value.streetName && value.suburb && value.state && value.postcode;
      setHasValidAddress(!!isComplete);
    }
  }, [value]);

  return (
    <div className="space-y-4">
      {label && (
        <Label htmlFor="address-search" className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </Label>
      )}
      
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        {hasValidAddress && (
          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
        )}
        <Input
          ref={inputRef}
          id="address-search"
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className={`pl-10 ${hasValidAddress ? 'pr-10 border-green-300 bg-green-50' : 'pr-4'} transition-all duration-200 focus:ring-2 focus:ring-opacity-20 hover:shadow-sm`}
        />
      </div>
      
      {!isLoaded && (
        <div className="flex items-center gap-2 text-xs text-blue-600">
          <div className="animate-spin h-3 w-3 border border-blue-600 border-t-transparent rounded-full"></div>
          <span>Loading address search...</span>
        </div>
      )}

      <ManualAddressInputs 
        value={value}
        onChange={handleManualChange}
      />
    </div>
  );
};
