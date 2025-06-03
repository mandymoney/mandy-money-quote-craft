
import React from 'react';
import { Input } from '@/components/ui/input';

interface AddressComponents {
  streetNumber: string;
  streetName: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

interface ManualAddressInputsProps {
  value: AddressComponents;
  onChange: (field: keyof AddressComponents, fieldValue: string) => void;
}

export const ManualAddressInputs: React.FC<ManualAddressInputsProps> = ({
  value,
  onChange
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Street Number"
          value={value.streetNumber}
          onChange={(e) => onChange('streetNumber', e.target.value)}
        />
        <Input
          placeholder="Street Name"
          value={value.streetName}
          onChange={(e) => onChange('streetName', e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Suburb"
          value={value.suburb}
          onChange={(e) => onChange('suburb', e.target.value)}
        />
        <Input
          placeholder="State"
          value={value.state}
          onChange={(e) => onChange('state', e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Postcode"
          value={value.postcode}
          onChange={(e) => onChange('postcode', e.target.value)}
        />
        <Input
          placeholder="Country"
          value={value.country}
          onChange={(e) => onChange('country', e.target.value)}
        />
      </div>
    </>
  );
};
