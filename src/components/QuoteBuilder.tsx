import React, { useState, useEffect } from 'react';
import { PricingCard } from './PricingCard';
import { SchoolInfoForm } from './SchoolInfoForm';
import { ActionButtons } from './ActionButtons';
import { FormCompletionIndicator } from './FormCompletionIndicator';
import { format } from 'date-fns';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  type: 'teacher' | 'student';
  basePrice: number;
  inclusions: {
    teacher: string[];
    student: string[];
    classroom: string[];
  };
  notIncluded?: string[];
}

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

interface QuoteItem {
  item: string;
  count: number;
  unitPrice: number;
  totalPrice: number;
  type: string;
  description: string;
  savings?: number;
}

export const QuoteBuilder = () => {
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [teacherCount, setTeacherCount] = useState<number>(10);
  const [studentCount, setStudentCount] = useState<number>(250);
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>({
    schoolName: '',
    schoolAddress: {
      streetNumber: '',
      streetName: '',
      suburb: '',
      state: '',
      postcode: '',
      country: 'Australia'
    },
    schoolABN: '',
    contactPhone: '',
    deliveryAddress: {
      streetNumber: '',
      streetName: '',
      suburb: '',
      state: '',
      postcode: '',
      country: 'Australia'
    },
    deliveryIsSameAsSchool: true,
    billingAddress: {
      streetNumber: '',
      streetName: '',
      suburb: '',
      state: '',
      postcode: '',
      country: 'Australia'
    },
    billingIsSameAsSchool: true,
    accountsEmail: '',
    coordinatorEmail: '',
    coordinatorName: '',
    coordinatorPosition: '',
    purchaseOrderNumber: '',
    paymentPreference: '',
    supplierSetupForms: '',
    questionsComments: ''
  });
  const [programStartDate, setProgramStartDate] = useState<Date>(new Date());
  const [isUnlimited, setIsUnlimited] = useState<boolean>(false);

  const pricingTiers: PricingTier[] = [
    {
      id: 'teacher-digital',
      name: 'Digital Pass + Textbook Bundle',
      description: 'Complete digital access plus physical textbooks for teachers',
      type: 'teacher',
      basePrice: 198, // Updated price
      inclusions: {
        teacher: [
          '12-month digital platform access',
          'Physical teacher textbooks',
          'Comprehensive lesson plans',
          'Assessment tools',
          'Professional development resources'
        ],
        student: [],
        classroom: []
      },
      notIncluded: []
    },
    {
      id: 'teacher-physical',
      name: 'Textbook Only',
      description: 'Physical textbooks for teachers',
      type: 'teacher',
      basePrice: 99,
      inclusions: {
        teacher: ['Physical teacher textbooks'],
        student: [],
        classroom: []
      },
      notIncluded: [
        'Digital platform access',
        'Lesson plans',
        'Assessment tools',
        'Professional development'
      ]
    },
    {
      id: 'student-digital',
      name: 'Digital Pass',
      description: 'Full digital access for students',
      type: 'student',
      basePrice: 49,
      inclusions: {
        teacher: [],
        student: [
          '12-month digital platform access',
          'Interactive learning modules',
          'Progress tracking',
          'Gamified challenges'
        ],
        classroom: []
      },
      notIncluded: ['Physical textbooks']
    },
    {
      id: 'student-physical',
      name: 'Textbook Only',
      description: 'Physical textbooks for students',
      type: 'student',
      basePrice: 69,
      inclusions: {
        teacher: [],
        student: ['Physical student textbooks'],
        classroom: []
      },
      notIncluded: ['Digital platform access']
    }
  ];

  const calculateQuote = (): { items: QuoteItem[]; pricing: any } => {
    const items: QuoteItem[] = [];
    let subtotal = 0;

    if (selectedTier) {
      const teacherTier = pricingTiers.find(
        tier => tier.type === 'teacher' && tier.id.includes(selectedTier.id.split('-')[1])
      );
      const studentTier = pricingTiers.find(
        tier => tier.type === 'student' && tier.id.includes(selectedTier.id.split('-')[1])
      );

      if (teacherTier) {
        const teacherTotalPrice = teacherTier.basePrice * teacherCount;
        items.push({
          item: teacherTier.name,
          count: teacherCount,
          unitPrice: teacherTier.basePrice,
          totalPrice: teacherTotalPrice,
          type: 'teacher',
          description: teacherTier.description
        });
        subtotal += teacherTotalPrice;
      }

      if (studentTier) {
        const studentTotalPrice = studentTier.basePrice * studentCount;
        items.push({
          item: studentTier.name,
          count: studentCount,
          unitPrice: studentTier.basePrice,
          totalPrice: studentTotalPrice,
          type: 'student',
          description: studentTier.description
        });
        subtotal += studentTotalPrice;
      }
    }

    const gst = subtotal * 0.1;
    const total = subtotal + gst;
    const shipping = total > 90 ? 0 : 15;

    return {
      items: items,
      pricing: {
        subtotal,
        gst,
        total,
        shipping
      }
    };
  };

  const { items: quoteItems, pricing } = calculateQuote();

  const handleSchoolInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSchoolInfo(prevInfo => {
      // Split the name to handle nested objects
      const nameParts = name.split('.');
      if (nameParts.length === 1) {
        return { ...prevInfo, [name]: value };
      } else {
        const [topLevelKey, nestedKey] = nameParts;
        return {
          ...prevInfo,
          [topLevelKey]: {
            ...(prevInfo[topLevelKey] as AddressComponents),
            [nestedKey]: value
          }
        };
      }
    });
  };

  const handleAddressChange = (
    addressType: 'schoolAddress' | 'deliveryAddress' | 'billingAddress',
    field: string,
    value: string
  ) => {
    setSchoolInfo(prevInfo => ({
      ...prevInfo,
      [addressType]: {
        ...prevInfo[addressType],
        [field]: value
      }
    }));
  };

  const handleSameAsSchoolChange = (
    addressType: 'deliveryIsSameAsSchool' | 'billingIsSameAsSchool',
    checked: boolean
  ) => {
    setSchoolInfo(prevInfo => ({
      ...prevInfo,
      [addressType]: checked
    }));

    // If setting address to same as school, copy school address
    if (checked) {
      setSchoolInfo(prevInfo => ({
        ...prevInfo,
        [addressType === 'deliveryIsSameAsSchool' ? 'deliveryAddress' : 'billingAddress']:
          prevInfo.schoolAddress
      }));
    }
  };

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy');
  };

  return (
    <div className="grid gap-6">
      {/* Pricing Tier Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricingTiers.map((tier, index) => (
          <PricingCard
            key={tier.id}
            tier={tier}
            price={tier.basePrice}
            isSelected={selectedTier?.id === tier.id}
            onSelect={() => setSelectedTier(tier)}
            teacherCount={teacherCount}
            studentCount={studentCount}
            animationDelay={index * 100}
          />
        ))}
      </div>

      {/* Volume Selector */}
      {selectedTier && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Customise Volume
          </h3>

          <div className="mb-4">
            <Label htmlFor="teacherCount" className="block text-sm font-medium text-gray-700">
              Number of Teachers
            </Label>
            <Slider
              id="teacherCount"
              min={1}
              max={50}
              step={1}
              defaultValue={[teacherCount]}
              onValueChange={value => setTeacherCount(value[0])}
              className="max-w-xl"
            />
            <Input
              type="number"
              id="teacherCountInput"
              value={teacherCount}
              onChange={e => setTeacherCount(Number(e.target.value))}
              className="w-24 mt-2"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="studentCount" className="block text-sm font-medium text-gray-700">
              Number of Students
            </Label>
            <Slider
              id="studentCount"
              min={1}
              max={1000}
              step={10}
              defaultValue={[studentCount]}
              onValueChange={value => setStudentCount(value[0])}
              className="max-w-xl"
            />
            <Input
              type="number"
              id="studentCountInput"
              value={studentCount}
              onChange={e => setStudentCount(Number(e.target.value))}
              className="w-24 mt-2"
            />
          </div>
        </div>
      )}

      {/* School Information Form */}
      {selectedTier && (
        <div data-form-section className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            School Information
          </h3>
          <SchoolInfoForm
            schoolInfo={schoolInfo}
            onChange={handleSchoolInfoChange}
            onAddressChange={handleAddressChange}
            onSameAsSchoolChange={handleSameAsSchoolChange}
          />
        </div>
      )}

      {/* Program Start Date */}
      {selectedTier && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Program Start Date
          </h3>
          <Input
            type="date"
            value={formatDate(programStartDate)}
            onChange={e => setProgramStartDate(new Date(e.target.value))}
          />
        </div>
      )}

      {/* Action Buttons */}
      {selectedTier && (
        <ActionButtons
          selectedTier={selectedTier}
          totalPrice={pricing.total}
          teacherCount={teacherCount}
          studentCount={studentCount}
          schoolInfo={schoolInfo}
          quoteItems={quoteItems}
          pricing={pricing}
          programStartDate={programStartDate}
          isUnlimited={isUnlimited}
        />
      )}
    </div>
  );
};
