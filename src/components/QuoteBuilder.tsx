
import React, { useState } from 'react';
import { PricingCard } from './PricingCard';
import { ActionButtons } from './ActionButtons';
import { VolumeSelector } from './VolumeSelector';
import { ProgramStartDate } from './ProgramStartDate';
import { UnlimitedSchoolCard } from './UnlimitedSchoolCard';
import { FormCompletionIndicator } from './FormCompletionIndicator';
import { AddressInput } from './AddressInput';
import { ManualAddressInputs } from './ManualAddressInputs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ExpandableSection } from './ExpandableSection';
import { LessonExplorer } from './LessonExplorer';
import { VideoEmbed } from './VideoEmbed';

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

export interface PricingDetails {
  subtotal: number;
  gst: number;
  total: number;
  shipping: number;
}

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  type: string;
  basePrice: number;
  inclusions: {
    teacher: string[];
    student: string[];
    classroom: string[];
  };
  notIncluded: string[];
}

export interface UnlimitedTier {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  inclusions: string[];
  addOns: {
    teacherBooks: number;
    studentBooks: number;
    posterA0: number;
  };
  bestFor: string;
}

export const QuoteBuilder = () => {
  const [teacherCount, setTeacherCount] = useState(10);
  const [studentCount, setStudentCount] = useState(200);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedUnlimitedTier, setSelectedUnlimitedTier] = useState<UnlimitedTier | null>(null);
  const [programStartDate, setProgramStartDate] = useState(new Date());
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
    paymentPreference: 'EFT',
    supplierSetupForms: '',
    questionsComments: ''
  });
  const [unlimitedAddOns, setUnlimitedAddOns] = useState({
    teacherBooks: 0,
    studentBooks: 0,
    posterA0: 0,
  });

  const pricingTiers: PricingTier[] = [
    {
      id: 'teacher-digital',
      name: 'Digital Pass + Textbook Bundle',
      description: 'Complete digital access plus physical textbooks for teachers',
      type: 'teacher',
      basePrice: 198, // Updated from 149 to 198
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
      id: 'student-digital-teacher-digital',
      name: 'Digital Classroom',
      description: 'Full digital access for teachers and students',
      type: 'classroom',
      basePrice: 0,
      inclusions: {
        teacher: [
          '12-month digital platform access',
          'Comprehensive lesson plans',
          'Assessment tools',
          'Professional development resources'
        ],
        student: [
          '12-month digital platform access',
          'Interactive learning modules',
          'Progress tracking',
          'Gamified challenges'
        ],
        classroom: [
          'Digital classroom space'
        ]
      },
      notIncluded: [
        'Physical textbooks'
      ]
    },
    {
      id: 'teacher-physical',
      name: 'Textbook Only',
      description: 'Physical textbooks for teachers',
      type: 'teacher',
      basePrice: 99,
      inclusions: {
        teacher: [
          'Physical teacher textbooks'
        ],
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
      notIncluded: [
        'Physical textbooks'
      ]
    },
    {
      id: 'student-physical',
      name: 'Textbook Only',
      description: 'Physical textbooks for students',
      type: 'student',
      basePrice: 69,
      inclusions: {
        teacher: [],
        student: [
          'Physical student textbooks'
        ],
        classroom: []
      },
      notIncluded: [
        'Digital platform access'
      ]
    }
  ];

  const unlimitedTiers: UnlimitedTier[] = [
    {
      id: 'small-school',
      name: 'Small School',
      description: 'Up to 250 students',
      basePrice: 9990,
      inclusions: [
        'Unlimited access to all digital content and resources',
        'Dedicated customer support',
        'Priority onboarding'
      ],
      addOns: {
        teacherBooks: 99,
        studentBooks: 69,
        posterA0: 49,
      },
      bestFor: 'Small schools looking for a comprehensive solution'
    },
    {
      id: 'medium-school',
      name: 'Medium School',
      description: 'Up to 500 students',
      basePrice: 14990,
      inclusions: [
        'Unlimited access to all digital content and resources',
        'Dedicated customer support',
        'Priority onboarding',
        'Customised training sessions'
      ],
      addOns: {
        teacherBooks: 99,
        studentBooks: 69,
        posterA0: 49,
      },
      bestFor: 'Medium schools seeking tailored support and training'
    },
    {
      id: 'large-school',
      name: 'Large School',
      description: 'Unlimited students',
      basePrice: 19990,
      inclusions: [
        'Unlimited access to all digital content and resources',
        'Dedicated customer support',
        'Priority onboarding',
        'Customised training sessions',
        'On-site workshops'
      ],
      addOns: {
        teacherBooks: 99,
        studentBooks: 69,
        posterA0: 49,
      },
      bestFor: 'Large schools requiring extensive support and on-site training'
    }
  ];

  const calculateIndividualPricing = (): PricingDetails => {
    let subtotal = 0;

    pricingTiers.forEach(tier => {
      if (selectedTier === tier.id) {
        if (tier.type === 'teacher') {
          subtotal += tier.basePrice * teacherCount;
        } else if (tier.type === 'student') {
          subtotal += tier.basePrice * studentCount;
        } else if (tier.type === 'classroom') {
          subtotal += tier.basePrice;
        }
      }
    });

    const gst = subtotal * 0.1;
    const total = subtotal + gst;
    return { subtotal, gst, total, shipping: 0 };
  };

  const calculateUnlimitedPricing = (): PricingDetails => {
    if (!selectedUnlimitedTier) {
      return { subtotal: 0, gst: 0, total: 0, shipping: 0 };
    }

    let subtotal = selectedUnlimitedTier.basePrice;
    subtotal += unlimitedAddOns.teacherBooks * selectedUnlimitedTier.addOns.teacherBooks;
    subtotal += unlimitedAddOns.studentBooks * selectedUnlimitedTier.addOns.studentBooks;
    subtotal += unlimitedAddOns.posterA0 * selectedUnlimitedTier.addOns.posterA0;

    const gst = subtotal * 0.1;
    const total = subtotal + gst;
    return { subtotal, gst, total, shipping: 0 };
  };

  const individualPricing = calculateIndividualPricing();
  const unlimitedPricing = calculateUnlimitedPricing();

  const generateQuoteItems = (): QuoteItem[] => {
    const items: QuoteItem[] = [];

    pricingTiers.forEach(tier => {
      if (selectedTier === tier.id) {
        let count = 0;
        if (tier.type === 'teacher') {
          count = teacherCount;
        } else if (tier.type === 'student') {
          count = studentCount;
        } else if (tier.type === 'classroom') {
          count = 1;
        }

        items.push({
          item: tier.name,
          count: count,
          unitPrice: tier.basePrice,
          totalPrice: tier.basePrice * count,
          type: tier.type,
          description: tier.description
        });
      }
    });

    return items;
  };

  const generateUnlimitedQuoteItems = (): QuoteItem[] => {
    const items: QuoteItem[] = [];

    if (selectedUnlimitedTier) {
      items.push({
        item: selectedUnlimitedTier.name + ' - Unlimited Access',
        count: 1,
        unitPrice: selectedUnlimitedTier.basePrice,
        totalPrice: selectedUnlimitedTier.basePrice,
        type: 'unlimited',
        description: selectedUnlimitedTier.description
      });

      if (unlimitedAddOns.teacherBooks > 0) {
        items.push({
          item: 'Teacher Print Textbooks',
          count: unlimitedAddOns.teacherBooks,
          unitPrice: selectedUnlimitedTier.addOns.teacherBooks,
          totalPrice: unlimitedAddOns.teacherBooks * selectedUnlimitedTier.addOns.teacherBooks,
          type: 'add-on',
          description: 'Optional add-on for teacher print textbooks'
        });
      }

      if (unlimitedAddOns.studentBooks > 0) {
        items.push({
          item: 'Student Print Textbooks',
          count: unlimitedAddOns.studentBooks,
          unitPrice: selectedUnlimitedTier.addOns.studentBooks,
          totalPrice: unlimitedAddOns.studentBooks * selectedUnlimitedTier.addOns.studentBooks,
          type: 'add-on',
          description: 'Optional add-on for student print textbooks'
        });
      }

      if (unlimitedAddOns.posterA0 > 0) {
        items.push({
          item: 'A0 Posters',
          count: unlimitedAddOns.posterA0,
          unitPrice: selectedUnlimitedTier.addOns.posterA0,
          totalPrice: unlimitedAddOns.posterA0 * selectedUnlimitedTier.addOns.posterA0,
          type: 'add-on',
          description: 'Optional add-on for A0 posters'
        });
      }
    }

    return items;
  };

  const quoteItems = generateQuoteItems();
  const unlimitedQuoteItems = generateUnlimitedQuoteItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Updated Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Instant Quote Builder
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Place an order or generate your custom quote (no personal details required).
          </p>
          
          {/* Video Embed Section */}
          <ExpandableSection title="Watch a quick tour">
            <VideoEmbed videoId="dQw4w9WgXcQ" />
          </ExpandableSection>
          
          {/* Lesson Explorer Section */}
          <ExpandableSection title="Explore our lesson library">
            <LessonExplorer />
          </ExpandableSection>
        </div>

        {/* Volume Selectors */}
        <VolumeSelector
          teacherCount={teacherCount}
          studentCount={studentCount}
          onTeacherChange={setTeacherCount}
          onStudentChange={setStudentCount}
        />

        {/* Program Start Date */}
        <ProgramStartDate
          programStartDate={programStartDate}
          onDateChange={setProgramStartDate}
        />

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {pricingTiers.map((tier, index) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              price={tier.basePrice}
              teacherCount={teacherCount}
              studentCount={studentCount}
              isSelected={selectedTier === tier.id}
              onSelect={() => setSelectedTier(tier.id)}
              animationDelay={index * 100}
            />
          ))}
        </div>

        {/* Unlimited School Options */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Or, Go Unlimited!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlimitedTiers.map((tier) => (
              <UnlimitedSchoolCard
                key={tier.id}
                tier={tier}
                isSelected={selectedUnlimitedTier?.id === tier.id}
                onSelect={() => setSelectedUnlimitedTier(tier)}
                addOns={unlimitedAddOns}
                onAddOnsChange={setUnlimitedAddOns}
                pricing={unlimitedPricing}
                teacherCount={teacherCount}
                studentCount={studentCount}
                regularPricing={individualPricing}
              />
            ))}
          </div>
        </div>

        {/* Form Section */}
        <div data-form-section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            School Information
          </h2>

          {/* School Name */}
          <div className="mb-4">
            <Label htmlFor="schoolName" className="block text-gray-700 text-sm font-bold mb-2">
              School Name
            </Label>
            <Input
              type="text"
              id="schoolName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter school name"
              value={schoolInfo.schoolName}
              onChange={(e) => setSchoolInfo({ ...schoolInfo, schoolName: e.target.value })}
            />
          </div>

          {/* School Address */}
          <AddressInput
            value={schoolInfo.schoolAddress}
            onChange={(newAddress) => setSchoolInfo({ ...schoolInfo, schoolAddress: newAddress })}
            label="School Address"
          />

          {/* Manual Address Inputs */}
          <ExpandableSection title="Enter address manually">
            <ManualAddressInputs
              value={schoolInfo.schoolAddress}
              onChange={(newAddress) => setSchoolInfo({ ...schoolInfo, schoolAddress: newAddress })}
            />
          </ExpandableSection>

          {/* School ABN */}
          <div className="mb-4">
            <Label htmlFor="schoolABN" className="block text-gray-700 text-sm font-bold mb-2">
              School ABN
            </Label>
            <Input
              type="text"
              id="schoolABN"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter school ABN"
              value={schoolInfo.schoolABN}
              onChange={(e) => setSchoolInfo({ ...schoolInfo, schoolABN: e.target.value })}
            />
          </div>

          {/* Contact Phone */}
          <div className="mb-4">
            <Label htmlFor="contactPhone" className="block text-gray-700 text-sm font-bold mb-2">
              Contact Phone
            </Label>
            <Input
              type="tel"
              id="contactPhone"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter contact phone"
              value={schoolInfo.contactPhone}
              onChange={(e) => setSchoolInfo({ ...schoolInfo, contactPhone: e.target.value })}
            />
          </div>

          {/* Delivery Address */}
          <div className="mb-4">
            <label className="inline-flex items-center">
              <Checkbox
                id="deliveryIsSameAsSchool"
                checked={schoolInfo.deliveryIsSameAsSchool}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  setSchoolInfo({ ...schoolInfo, deliveryIsSameAsSchool: isChecked });
                  if (isChecked) {
                    setSchoolInfo({ ...schoolInfo, deliveryAddress: schoolInfo.schoolAddress });
                  }
                }}
                className="mr-2"
              />
              <span className="text-gray-700 text-sm font-bold">Delivery address is the same as school address</span>
            </label>
          </div>

          {!schoolInfo.deliveryIsSameAsSchool && (
            <AddressInput
              value={schoolInfo.deliveryAddress}
              onChange={(newAddress) => setSchoolInfo({ ...schoolInfo, deliveryAddress: newAddress })}
              label="Delivery Address"
            />
          )}

          {/* Billing Address */}
          <div className="mb-4">
            <label className="inline-flex items-center">
              <Checkbox
                id="billingIsSameAsSchool"
                checked={schoolInfo.billingIsSameAsSchool}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  setSchoolInfo({ ...schoolInfo, billingIsSameAsSchool: isChecked });
                  if (isChecked) {
                    setSchoolInfo({ ...schoolInfo, billingAddress: schoolInfo.schoolAddress });
                  }
                }}
                className="mr-2"
              />
              <span className="text-gray-700 text-sm font-bold">Billing address is the same as school address</span>
            </label>
          </div>

          {!schoolInfo.billingIsSameAsSchool && (
            <AddressInput
              value={schoolInfo.billingAddress}
              onChange={(newAddress) => setSchoolInfo({ ...schoolInfo, billingAddress: newAddress })}
              label="Billing Address"
            />
          )}

          {/* Accounts Email */}
          <div className="mb-4">
            <Label htmlFor="accountsEmail" className="block text-gray-700 text-sm font-bold mb-2">
              Accounts Email
            </Label>
            <Input
              type="email"
              id="accountsEmail"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter accounts email"
              value={schoolInfo.accountsEmail}
              onChange={(e) => setSchoolInfo({ ...schoolInfo, accountsEmail: e.target.value })}
            />
          </div>

          {/* Coordinator Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="coordinatorName" className="block text-gray-700 text-sm font-bold mb-2">
                Coordinator Name
              </Label>
              <Input
                type="text"
                id="coordinatorName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter coordinator name"
                value={schoolInfo.coordinatorName}
                onChange={(e) => setSchoolInfo({ ...schoolInfo, coordinatorName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="coordinatorPosition" className="block text-gray-700 text-sm font-bold mb-2">
                Coordinator Position
              </Label>
              <Input
                type="text"
                id="coordinatorPosition"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter coordinator position"
                value={schoolInfo.coordinatorPosition}
                onChange={(e) => setSchoolInfo({ ...schoolInfo, coordinatorPosition: e.target.value })}
              />
            </div>
          </div>

          {/* Coordinator Email */}
          <div className="mb-4">
            <Label htmlFor="coordinatorEmail" className="block text-gray-700 text-sm font-bold mb-2">
              Coordinator Email
            </Label>
            <Input
              type="email"
              id="coordinatorEmail"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter coordinator email"
              value={schoolInfo.coordinatorEmail}
              onChange={(e) => setSchoolInfo({ ...schoolInfo, coordinatorEmail: e.target.value })}
            />
          </div>

          {/* Purchase Order Number */}
          <div className="mb-4">
            <Label htmlFor="purchaseOrderNumber" className="block text-gray-700 text-sm font-bold mb-2">
              Purchase Order Number
            </Label>
            <Input
              type="text"
              id="purchaseOrderNumber"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter purchase order number"
              value={schoolInfo.purchaseOrderNumber}
              onChange={(e) => setSchoolInfo({ ...schoolInfo, purchaseOrderNumber: e.target.value })}
            />
          </div>

          {/* Payment Preference */}
          <div className="mb-4">
            <Label htmlFor="paymentPreference" className="block text-gray-700 text-sm font-bold mb-2">
              Payment Preference
            </Label>
            <Select onValueChange={(value) => setSchoolInfo({ ...schoolInfo, paymentPreference: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select payment preference" defaultValue={schoolInfo.paymentPreference} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EFT">EFT</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Supplier Setup Forms */}
          <div className="mb-4">
            <Label htmlFor="supplierSetupForms" className="block text-gray-700 text-sm font-bold mb-2">
              Supplier Setup Forms
            </Label>
            <Input
              type="text"
              id="supplierSetupForms"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter supplier setup forms"
              value={schoolInfo.supplierSetupForms}
              onChange={(e) => setSchoolInfo({ ...schoolInfo, supplierSetupForms: e.target.value })}
            />
          </div>

          {/* Questions/Comments */}
          <div className="mb-4">
            <Label htmlFor="questionsComments" className="block text-gray-700 text-sm font-bold mb-2">
              Questions/Comments
            </Label>
            <Textarea
              id="questionsComments"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter any questions or comments"
              value={schoolInfo.questionsComments}
              onChange={(e) => setSchoolInfo({ ...schoolInfo, questionsComments: e.target.value })}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <ActionButtons
          selectedTier={selectedTier ? pricingTiers.find(tier => tier.id === selectedTier) : selectedUnlimitedTier}
          totalPrice={selectedTier ? individualPricing.total : unlimitedPricing.total}
          teacherCount={teacherCount}
          studentCount={studentCount}
          schoolInfo={schoolInfo}
          quoteItems={selectedTier ? quoteItems : unlimitedQuoteItems}
          pricing={selectedTier ? individualPricing : unlimitedPricing}
          programStartDate={programStartDate}
          isUnlimited={!!selectedUnlimitedTier}
        />
      </div>
    </div>
  );
};
