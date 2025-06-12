import React, { useState, useEffect } from 'react';
import { VolumeSelector } from '@/components/VolumeSelector';
import { ProgramStartDate } from '@/components/ProgramStartDate';
import { PricingDisplay } from '@/components/PricingDisplay';
import { InclusionsDisplay } from '@/components/InclusionsDisplay';
import { ActionButtons } from '@/components/ActionButtons';
import { SchoolInfo as SchoolInfoType } from '@/types';
import { AddressInput } from '@/components/AddressInput';
import { Button } from '@/components/ui/button';
import { FormCompletionIndicator } from '@/components/FormCompletionIndicator';
import { useFormValidation } from '@/hooks/useFormValidation';
import { ExpandableSection } from '@/components/ExpandableSection';

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

interface Pricing {
  subtotal: number;
  gst: number;
  total: number;
  shipping: number;
}

export const QuoteBuilder = () => {
  const [teacherCount, setTeacherCount] = useState(10);
  const [studentCount, setStudentCount] = useState(250);
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [programStartDate, setProgramStartDate] = useState<Date>(new Date());
  const [accessPeriod, setAccessPeriod] = useState(12); // Default to 12 months

  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [pricing, setPricing] = useState<Pricing>({
    subtotal: 0,
    gst: 0,
    total: 0,
    shipping: 0,
  });

  const initialSchoolInfo: SchoolInfo = {
    schoolName: '',
    schoolAddress: {
      streetNumber: '',
      streetName: '',
      suburb: '',
      state: '',
      postcode: '',
      country: 'Australia', // Default to Australia
    },
    schoolABN: '',
    contactPhone: '',
    deliveryAddress: {
      streetNumber: '',
      streetName: '',
      suburb: '',
      state: '',
      postcode: '',
      country: 'Australia', // Default to Australia
    },
    deliveryIsSameAsSchool: true,
    billingAddress: {
      streetNumber: '',
      streetName: '',
      suburb: '',
      state: '',
      postcode: '',
      country: 'Australia', // Default to Australia
    },
    billingIsSameAsSchool: true,
    accountsEmail: '',
    coordinatorEmail: '',
    coordinatorName: '',
    coordinatorPosition: '',
    purchaseOrderNumber: '',
    paymentPreference: '',
    supplierSetupForms: '',
    questionsComments: '',
  };

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(initialSchoolInfo);
  const { errors } = useFormValidation();

  useEffect(() => {
    // Load school info from local storage on component mount
    const storedSchoolInfo = localStorage.getItem('schoolInfo');
    if (storedSchoolInfo) {
      setSchoolInfo(JSON.parse(storedSchoolInfo));
    }
  }, []);

  useEffect(() => {
    // Save school info to local storage whenever it changes
    localStorage.setItem('schoolInfo', JSON.stringify(schoolInfo));
  }, [schoolInfo]);

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const getEndDate = (startDate: Date, accessPeriod: number): Date => {
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + accessPeriod);
    return endDate;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Mandy Money Program Quote Builder
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Volume Selection */}
        <VolumeSelector
          teacherCount={teacherCount}
          studentCount={studentCount}
          onTeacherCountChange={setTeacherCount}
          onStudentCountChange={setStudentCount}
          selectedTier={selectedTier}
          onTierChange={setSelectedTier}
        />

        {selectedTier && (
          <>
            {/* Program Start Date */}
            <ProgramStartDate
              programStartDate={programStartDate}
              onDateChange={setProgramStartDate}
            />

            {/* What's Included and Pricing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* What's Included Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">What's Included</h2>
                <InclusionsDisplay 
                  selectedTier={selectedTier}
                  teacherCount={teacherCount}
                  studentCount={studentCount}
                  isUnlimited={selectedTier.id === 'unlimited'}
                />
              </div>

              {/* Investment Breakdown */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Investment Breakdown</h2>
                <PricingDisplay 
                  selectedTier={selectedTier}
                  teacherCount={teacherCount}
                  studentCount={studentCount}
                  onQuoteItemsChange={setQuoteItems}
                  onPricingChange={setPricing}
                  customPricing={{
                    teacherDigitalTextbookBundle: 198
                  }}
                />
              </div>
            </div>

            {/* Official Program Quote Section with Access Period */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Official Program Quote</h2>
              
              {/* Access Period Summary - now with translucent green background */}
              <div className="bg-green-50/50 border border-green-200/30 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Access Period Summary</h3>
                <div className="text-gray-600 mb-4">
                  <p><span className="font-medium">Program Start:</span> {formatDate(programStartDate)}</p>
                  <p><span className="font-medium">Program End:</span> {formatDate(getEndDate(programStartDate, accessPeriod))}</p>
                  <p><span className="font-medium">Total Duration:</span> {accessPeriod} months of access</p>
                </div>
                
                {/* Program Access Period Selector moved here */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Program Access Period</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[12, 18, 24].map((months) => (
                      <button
                        key={months}
                        onClick={() => setAccessPeriod(months)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                          accessPeriod === months
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-green-300 text-gray-600'
                        }`}
                      >
                        <div className="font-medium">{months} Months</div>
                        <div className="text-sm opacity-75">
                          {months === 12 ? 'Standard' : months === 18 ? 'Extended' : 'Premium'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* What's Included in this section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Student Resources</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {studentCount} Student Digital Passes
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Access to all 12 comprehensive lessons
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Interactive digital activities
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Progress tracking and assessments
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Teacher Resources</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      {teacherCount} Teacher Digital Pass + Textbook Bundle{teacherCount > 1 ? 's' : ''}
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Comprehensive teaching guides
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Lesson plans and resources
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Professional development support
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* First Action Buttons - "Ready to Get Started?" */}
            <div className="mb-8">
              <ActionButtons
                selectedTier={selectedTier}
                totalPrice={pricing.total}
                teacherCount={teacherCount}
                studentCount={studentCount}
                schoolInfo={schoolInfo}
                quoteItems={quoteItems}
                pricing={pricing}
                programStartDate={programStartDate}
                isUnlimited={selectedTier.id === 'unlimited'}
                titleOverride="Ready to Get Started?"
                descriptionOverride="Complete your information below to proceed"
              />
            </div>

            {/* School Information Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8" data-form-section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">School Information</h2>
                <FormCompletionIndicator schoolInfo={schoolInfo} />
              </div>
              
              {/* Basic School Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Name *
                  </label>
                  <input
                    type="text"
                    value={schoolInfo.schoolName}
                    onChange={(e) => setSchoolInfo(prev => ({ ...prev, schoolName: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.schoolName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your school name"
                  />
                  {errors.schoolName && <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School ABN
                  </label>
                  <input
                    type="text"
                    value={schoolInfo.schoolABN}
                    onChange={(e) => setSchoolInfo(prev => ({ ...prev, schoolABN: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.schoolABN ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter ABN (optional)"
                  />
                  {errors.schoolABN && <p className="text-red-500 text-sm mt-1">{errors.schoolABN}</p>}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={schoolInfo.contactPhone}
                    onChange={(e) => setSchoolInfo(prev => ({ ...prev, contactPhone: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter contact phone number"
                  />
                  {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
                </div>
              </div>

              {/* School Address */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">School Address</h3>
                <AddressInput
                  address={schoolInfo.schoolAddress}
                  onAddressChange={(address) => setSchoolInfo(prev => ({ ...prev, schoolAddress: address }))}
                  placeholder="Enter school address"
                  errors={errors}
                  fieldPrefix="schoolAddress"
                />
              </div>

              {/* Program Coordinator Details */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Program Coordinator Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coordinator Name *
                    </label>
                    <input
                      type="text"
                      value={schoolInfo.coordinatorName}
                      onChange={(e) => setSchoolInfo(prev => ({ ...prev, coordinatorName: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.coordinatorName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter coordinator's full name"
                    />
                    {errors.coordinatorName && <p className="text-red-500 text-sm mt-1">{errors.coordinatorName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position/Title
                    </label>
                    <input
                      type="text"
                      value={schoolInfo.coordinatorPosition}
                      onChange={(e) => setSchoolInfo(prev => ({ ...prev, coordinatorPosition: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Head of Business Studies"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coordinator Email *
                    </label>
                    <input
                      type="email"
                      value={schoolInfo.coordinatorEmail}
                      onChange={(e) => setSchoolInfo(prev => ({ ...prev, coordinatorEmail: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.coordinatorEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter coordinator's email address"
                    />
                    {errors.coordinatorEmail && <p className="text-red-500 text-sm mt-1">{errors.coordinatorEmail}</p>}
                  </div>
                </div>
              </div>

              {/* Additional Details for Orders */}
              <ExpandableSection title="Additional Details for Orders" defaultExpanded={false}>
                <div className="space-y-6">
                  {/* Purchase Order and Payment Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Purchase Order Number
                      </label>
                      <input
                        type="text"
                        value={schoolInfo.purchaseOrderNumber}
                        onChange={(e) => setSchoolInfo(prev => ({ ...prev, purchaseOrderNumber: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter PO number (if required)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Preference
                      </label>
                      <select
                        value={schoolInfo.paymentPreference}
                        onChange={(e) => setSchoolInfo(prev => ({ ...prev, paymentPreference: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select payment method</option>
                        <option value="invoice">Invoice (30 days)</option>
                        <option value="credit-card">Credit Card</option>
                        <option value="bank-transfer">Bank Transfer</option>
                        <option value="purchase-order">Purchase Order</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Accounts/Finance Email
                    </label>
                    <input
                      type="email"
                      value={schoolInfo.accountsEmail}
                      onChange={(e) => setSchoolInfo(prev => ({ ...prev, accountsEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter accounts department email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier Setup Forms Required
                    </label>
                    <select
                      value={schoolInfo.supplierSetupForms}
                      onChange={(e) => setSchoolInfo(prev => ({ ...prev, supplierSetupForms: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Do you require supplier setup forms?</option>
                      <option value="yes">Yes - Please send supplier forms</option>
                      <option value="no">No - We can process without forms</option>
                      <option value="unsure">Unsure - Please advise</option>
                    </select>
                  </div>

                  {/* Delivery Address Options */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="different-delivery"
                        checked={!schoolInfo.deliveryIsSameAsSchool}
                        onChange={(e) => setSchoolInfo(prev => ({ 
                          ...prev, 
                          deliveryIsSameAsSchool: !e.target.checked 
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="different-delivery" className="text-sm font-medium text-gray-700">
                        Use different delivery address
                      </label>
                    </div>

                    {!schoolInfo.deliveryIsSameAsSchool && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-3">Delivery Address</h4>
                        <AddressInput
                          address={schoolInfo.deliveryAddress}
                          onAddressChange={(address) => setSchoolInfo(prev => ({ ...prev, deliveryAddress: address }))}
                          placeholder="Enter delivery address"
                          errors={errors}
                          fieldPrefix="deliveryAddress"
                        />
                      </div>
                    )}
                  </div>

                  {/* Billing Address Options */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="different-billing"
                        checked={!schoolInfo.billingIsSameAsSchool}
                        onChange={(e) => setSchoolInfo(prev => ({ 
                          ...prev, 
                          billingIsSameAsSchool: !e.target.checked 
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="different-billing" className="text-sm font-medium text-gray-700">
                        Use different billing address
                      </label>
                    </div>

                    {!schoolInfo.billingIsSameAsSchool && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-3">Billing Address</h4>
                        <AddressInput
                          address={schoolInfo.billingAddress}
                          onAddressChange={(address) => setSchoolInfo(prev => ({ ...prev, billingAddress: address }))}
                          placeholder="Enter billing address"
                          errors={errors}
                          fieldPrefix="billingAddress"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </ExpandableSection>

              {/* Questions and Comments */}
              <ExpandableSection 
                title="Any Questions or Comments?" 
                defaultExpanded={false}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    value={schoolInfo.questionsComments}
                    onChange={(e) => setSchoolInfo(prev => ({ ...prev, questionsComments: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Please share any questions, special requirements, or additional information..."
                  />
                </div>
              </ExpandableSection>
            </div>

            {/* Join Community Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-green-800 mb-4">Join the Mandy Money Community</h2>
              <p className="text-green-700 mb-4">
                Connect with other educators, access exclusive resources, and stay updated with the latest financial literacy teaching strategies.
              </p>
              <Button 
                onClick={() => window.open('https://www.facebook.com/groups/mandymoneyeducators', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Join Our Facebook Group
              </Button>
            </div>

            {/* Second Action Buttons - "You're Ready to Get Started!" */}
            <ActionButtons
              selectedTier={selectedTier}
              totalPrice={pricing.total}
              teacherCount={teacherCount}
              studentCount={studentCount}
              schoolInfo={schoolInfo}
              quoteItems={quoteItems}
              pricing={pricing}
              programStartDate={programStartDate}
              isUnlimited={selectedTier.id === 'unlimited'}
              titleOverride="You're Ready to Get Started!"
            />
          </>
        )}
      </div>
    </div>
  );
};
