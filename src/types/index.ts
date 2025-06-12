
export interface AddressComponents {
  streetNumber: string;
  streetName: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

export interface SchoolInfo {
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

export interface QuoteItem {
  item: string;
  count: number;
  unitPrice: number;
  totalPrice: number;
  type: string;
  description: string;
  savings?: number;
}

export interface Pricing {
  subtotal: number;
  gst: number;
  total: number;
  shipping: number;
}

export interface PricingTier {
  id: string;
  name: string;
  type: 'teacher' | 'student';
  description: string;
  basePrice: {
    teacher: number;
    student: number;
  };
  inclusions: {
    teacher: string[];
    student: string[];
    classroom: string[];
  };
  notIncluded?: string[];
}

export interface UnlimitedTier {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  addOns: {
    teacherBooks: number;
    studentBooks: number;
    posterA0: number;
  };
  inclusions: string[];
  bestFor: string;
}

export interface ValidationErrors {
  [key: string]: string;
  schoolName?: string;
  schoolABN?: string;
  contactPhone?: string;
  coordinatorName?: string;
  coordinatorEmail?: string;
}
