
import { useState, useCallback } from 'react';

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

interface ValidationErrors {
  schoolName?: string;
  schoolAddress?: string;
  coordinatorName?: string;
  coordinatorEmail?: string;
  contactPhone?: string;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isValidating, setIsValidating] = useState(false);

  // Pure validation function - no side effects
  const getValidationErrors = useCallback((schoolInfo: SchoolInfo): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!schoolInfo.schoolName.trim()) {
      newErrors.schoolName = 'School name is required';
    }

    if (!schoolInfo.coordinatorName.trim()) {
      newErrors.coordinatorName = 'Coordinator name is required';
    }

    if (!schoolInfo.coordinatorEmail.trim()) {
      newErrors.coordinatorEmail = 'Coordinator email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoolInfo.coordinatorEmail)) {
      newErrors.coordinatorEmail = 'Please enter a valid email address';
    }

    if (!schoolInfo.contactPhone.trim()) {
      newErrors.contactPhone = 'Contact phone is required';
    }

    // Check if address is complete
    const { streetNumber, streetName, suburb, state, postcode } = schoolInfo.schoolAddress;
    if (!streetNumber || !streetName || !suburb || !state || !postcode) {
      newErrors.schoolAddress = 'Complete school address is required';
    }

    return newErrors;
  }, []);

  // Pure validation check - returns boolean without side effects
  const isSchoolInfoValid = useCallback((schoolInfo: SchoolInfo): boolean => {
    const validationErrors = getValidationErrors(schoolInfo);
    return Object.keys(validationErrors).length === 0;
  }, [getValidationErrors]);

  // Validation function that updates state - only call when you want to show errors
  const validateSchoolInfo = useCallback((schoolInfo: SchoolInfo): boolean => {
    const newErrors = getValidationErrors(schoolInfo);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [getValidationErrors]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    isValidating,
    setIsValidating,
    validateSchoolInfo,
    isSchoolInfoValid,
    clearErrors
  };
};
