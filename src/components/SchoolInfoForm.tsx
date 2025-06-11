
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { AddressInput } from './AddressInput';

interface AddressComponents {
  streetNumber: string;
  streetName: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

interface SchoolInfo {
  schoolName: string;
  schoolAddress: AddressComponents;
  schoolABN: string;
  contactPhone: string;
  deliveryAddress: AddressComponents;
  deliveryIsSameAsSchool: boolean;
  billingAddress: AddressComponents;
  billingIsSameAsSchool: boolean;
  accountsEmail: string;
  coordinatorEmail: string;
  coordinatorName: string;
  coordinatorPosition: string;
  purchaseOrderNumber: string;
  paymentPreference: string;
  supplierSetupForms: string;
  questionsComments: string;
}

interface SchoolInfoFormProps {
  schoolInfo: SchoolInfo;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onAddressChange: (
    addressType: 'schoolAddress' | 'deliveryAddress' | 'billingAddress',
    field: string,
    value: string
  ) => void;
  onSameAsSchoolChange: (
    addressType: 'deliveryIsSameAsSchool' | 'billingIsSameAsSchool',
    checked: boolean
  ) => void;
}

export const SchoolInfoForm: React.FC<SchoolInfoFormProps> = ({
  schoolInfo,
  onChange,
  onAddressChange,
  onSameAsSchoolChange
}) => {
  return (
    <div className="space-y-6">
      {/* Basic School Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="schoolName">School Name *</Label>
          <Input
            id="schoolName"
            name="schoolName"
            value={schoolInfo.schoolName}
            onChange={onChange}
            placeholder="Enter school name"
          />
        </div>
        <div>
          <Label htmlFor="schoolABN">School ABN</Label>
          <Input
            id="schoolABN"
            name="schoolABN"
            value={schoolInfo.schoolABN}
            onChange={onChange}
            placeholder="Enter ABN"
          />
        </div>
      </div>

      {/* School Address */}
      <div>
        <AddressInput
          label="School Address"
          value={schoolInfo.schoolAddress}
          onChange={(address) => {
            // Update all fields of the address at once
            Object.keys(address).forEach(field => {
              onAddressChange('schoolAddress', field, address[field as keyof AddressComponents]);
            });
          }}
          placeholder="Enter school address"
        />
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="coordinatorName">Coordinator Name *</Label>
          <Input
            id="coordinatorName"
            name="coordinatorName"
            value={schoolInfo.coordinatorName}
            onChange={onChange}
            placeholder="Enter coordinator name"
          />
        </div>
        <div>
          <Label htmlFor="coordinatorPosition">Coordinator Position</Label>
          <Input
            id="coordinatorPosition"
            name="coordinatorPosition"
            value={schoolInfo.coordinatorPosition}
            onChange={onChange}
            placeholder="Enter position"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="coordinatorEmail">Coordinator Email *</Label>
          <Input
            id="coordinatorEmail"
            name="coordinatorEmail"
            type="email"
            value={schoolInfo.coordinatorEmail}
            onChange={onChange}
            placeholder="Enter email address"
          />
        </div>
        <div>
          <Label htmlFor="contactPhone">Contact Phone *</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            value={schoolInfo.contactPhone}
            onChange={onChange}
            placeholder="Enter phone number"
          />
        </div>
      </div>

      {/* Delivery Address */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Checkbox
            id="deliveryIsSameAsSchool"
            checked={schoolInfo.deliveryIsSameAsSchool}
            onCheckedChange={(checked) => onSameAsSchoolChange('deliveryIsSameAsSchool', checked as boolean)}
          />
          <Label htmlFor="deliveryIsSameAsSchool">Delivery address is same as school address</Label>
        </div>
        
        {!schoolInfo.deliveryIsSameAsSchool && (
          <AddressInput
            label="Delivery Address"
            value={schoolInfo.deliveryAddress}
            onChange={(address) => {
              // Update all fields of the address at once
              Object.keys(address).forEach(field => {
                onAddressChange('deliveryAddress', field, address[field as keyof AddressComponents]);
              });
            }}
            placeholder="Enter delivery address"
          />
        )}
      </div>

      {/* Billing Address */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Checkbox
            id="billingIsSameAsSchool"
            checked={schoolInfo.billingIsSameAsSchool}
            onCheckedChange={(checked) => onSameAsSchoolChange('billingIsSameAsSchool', checked as boolean)}
          />
          <Label htmlFor="billingIsSameAsSchool">Billing address is same as school address</Label>
        </div>
        
        {!schoolInfo.billingIsSameAsSchool && (
          <AddressInput
            label="Billing Address"
            value={schoolInfo.billingAddress}
            onChange={(address) => {
              // Update all fields of the address at once
              Object.keys(address).forEach(field => {
                onAddressChange('billingAddress', field, address[field as keyof AddressComponents]);
              });
            }}
            placeholder="Enter billing address"
          />
        )}
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="accountsEmail">Accounts Email</Label>
          <Input
            id="accountsEmail"
            name="accountsEmail"
            type="email"
            value={schoolInfo.accountsEmail}
            onChange={onChange}
            placeholder="Enter accounts email"
          />
        </div>
        <div>
          <Label htmlFor="purchaseOrderNumber">Purchase Order Number</Label>
          <Input
            id="purchaseOrderNumber"
            name="purchaseOrderNumber"
            value={schoolInfo.purchaseOrderNumber}
            onChange={onChange}
            placeholder="Enter PO number"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="questionsComments">Questions or Comments</Label>
        <Textarea
          id="questionsComments"
          name="questionsComments"
          value={schoolInfo.questionsComments}
          onChange={onChange}
          placeholder="Enter any questions or special requirements"
          rows={4}
        />
      </div>
    </div>
  );
};
