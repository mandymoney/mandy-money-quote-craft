
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

  // Basic validation - for quotes (optional but recommended)
  const getBasicValidationErrors = useCallback((schoolInfo: SchoolInfo): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    // Only validate email format if provided
    if (schoolInfo.coordinatorEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoolInfo.coordinatorEmail)) {
      newErrors.coordinatorEmail = 'Please enter a valid email address';
    }

    return newErrors;
  }, []);

  // Essential validation - for enquiries (school name, coordinator name, email)
  const getEssentialValidationErrors = useCallback((schoolInfo: SchoolInfo): ValidationErrors => {
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

    return newErrors;
  }, []);

  // Full validation - for orders (all required fields)
  const getFullValidationErrors = useCallback((schoolInfo: SchoolInfo): ValidationErrors => {
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

  // Pure validation checks - return boolean without side effects
  const isBasicInfoValid = useCallback((schoolInfo: SchoolInfo): boolean => {
    const validationErrors = getBasicValidationErrors(schoolInfo);
    return Object.keys(validationErrors).length === 0;
  }, [getBasicValidationErrors]);

  const isEssentialInfoValid = useCallback((schoolInfo: SchoolInfo): boolean => {
    const validationErrors = getEssentialValidationErrors(schoolInfo);
    return Object.keys(validationErrors).length === 0;
  }, [getEssentialValidationErrors]);

  const isFullInfoValid = useCallback((schoolInfo: SchoolInfo): boolean => {
    const validationErrors = getFullValidationErrors(schoolInfo);
    return Object.keys(validationErrors).length === 0;
  }, [getFullValidationErrors]);

  // Validation functions that update state - only call when you want to show errors
  const validateBasicInfo = useCallback((schoolInfo: SchoolInfo): boolean => {
    const newErrors = getBasicValidationErrors(schoolInfo);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [getBasicValidationErrors]);

  const validateEssentialInfo = useCallback((schoolInfo: SchoolInfo): boolean => {
    const newErrors = getEssentialValidationErrors(schoolInfo);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [getEssentialValidationErrors]);

  const validateFullInfo = useCallback((schoolInfo: SchoolInfo): boolean => {
    const newErrors = getFullValidationErrors(schoolInfo);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [getFullValidationErrors]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    isValidating,
    setIsValidating,
    validateBasicInfo,
    validateEssentialInfo,
    validateFullInfo,
    isBasicInfoValid,
    isEssentialInfoValid,
    isFullInfoValid,
    clearErrors
  };
};
