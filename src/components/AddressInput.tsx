
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

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

// Declare global google types
declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

export const AddressInput: React.FC<AddressInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "Start typing your address..."
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const autocompleteRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load Google Maps API
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places&callback=initAutocomplete`;
    script.async = true;
    script.defer = true;

    window.initAutocomplete = () => {
      setIsLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize autocomplete when Google Maps is loaded
  useEffect(() => {
    if (isLoaded && inputRef.current && window.google && !autocompleteRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'AU' } // Restrict to Australia
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.address_components) {
          const components = parseAddressComponents(place.address_components);
          onChange(components);
          setSearchValue(formatDisplayAddress(components));
        }
      });

      autocompleteRef.current = autocomplete;
    }
  }, [isLoaded, onChange]);

  const parseAddressComponents = (components: any[]): AddressComponents => {
    const result: AddressComponents = {
      streetNumber: '',
      streetName: '',
      suburb: '',
      state: '',
      postcode: '',
      country: ''
    };

    components.forEach(component => {
      const types = component.types;
      const value = component.long_name;

      if (types.includes('street_number')) {
        result.streetNumber = value;
      } else if (types.includes('route')) {
        result.streetName = value;
      } else if (types.includes('locality') || types.includes('sublocality_level_1')) {
        result.suburb = value;
      } else if (types.includes('administrative_area_level_1')) {
        result.state = value;
      } else if (types.includes('postal_code')) {
        result.postcode = value;
      } else if (types.includes('country')) {
        result.country = value;
      }
    });

    return result;
  };

  const formatDisplayAddress = (address: AddressComponents): string => {
    const parts = [
      address.streetNumber,
      address.streetName,
      address.suburb,
      address.state,
      address.postcode
    ].filter(Boolean);
    return parts.join(' ');
  };

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

      {/* Manual address component inputs */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Street Number"
          value={value.streetNumber}
          onChange={(e) => handleManualChange('streetNumber', e.target.value)}
        />
        <Input
          placeholder="Street Name"
          value={value.streetName}
          onChange={(e) => handleManualChange('streetName', e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Suburb"
          value={value.suburb}
          onChange={(e) => handleManualChange('suburb', e.target.value)}
        />
        <Input
          placeholder="State"
          value={value.state}
          onChange={(e) => handleManualChange('state', e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Postcode"
          value={value.postcode}
          onChange={(e) => handleManualChange('postcode', e.target.value)}
        />
        <Input
          placeholder="Country"
          value={value.country}
          onChange={(e) => handleManualChange('country', e.target.value)}
        />
      </div>
    </div>
  );
};
