
import React from 'react';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { useFormValidation } from '@/hooks/useFormValidation';

interface SchoolInfo {
  schoolName: string;
  schoolAddress: {
    streetNumber: string;
    streetName: string;
    suburb: string;
    state: string;
    postcode: string;
    country: string;
  };
  coordinatorName: string;
  coordinatorEmail: string;
  contactPhone: string;
}

interface FormCompletionIndicatorProps {
  schoolInfo: SchoolInfo;
  isComplete: boolean;
}

export const FormCompletionIndicator: React.FC<FormCompletionIndicatorProps> = ({
  schoolInfo,
  isComplete
}) => {
  const { isBasicInfoValid, isEssentialInfoValid, isFullInfoValid } = useFormValidation();
  
  const isBasicComplete = isBasicInfoValid(schoolInfo);
  const isEssentialComplete = isEssentialInfoValid(schoolInfo);
  const isFullComplete = isFullInfoValid(schoolInfo);

  return (
    <div className="flex items-center space-x-4 text-sm">
      <div className="flex items-center space-x-1">
        {isBasicComplete ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        )}
        <span className={isBasicComplete ? 'text-green-700' : 'text-yellow-700'}>
          Quote Ready
        </span>
      </div>
      
      <div className="flex items-center space-x-1">
        {isEssentialComplete ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <Circle className="h-4 w-4 text-gray-400" />
        )}
        <span className={isEssentialComplete ? 'text-green-700' : 'text-gray-500'}>
          Enquiry Ready
        </span>
      </div>
      
      <div className="flex items-center space-x-1">
        {isFullComplete ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <Circle className="h-4 w-4 text-gray-400" />
        )}
        <span className={isFullComplete ? 'text-green-700' : 'text-gray-500'}>
          Order Ready
        </span>
      </div>
    </div>
  );
};
