
import { useState, useEffect, useRef } from 'react';

interface AddressComponents {
  streetNumber: string;
  streetName: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

// Declare global google types
declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

export const useGoogleMaps = (
  onChange: (address: AddressComponents) => void
) => {
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

  return {
    isLoaded,
    inputRef
  };
};
