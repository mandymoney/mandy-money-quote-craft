import React, { useState } from 'react';
import { PricingCard } from './PricingCard';
import { VolumeSelector } from './VolumeSelector';
import { InclusionsDisplay } from './InclusionsDisplay';
import { ActionButtons } from './ActionButtons';
import { UnlimitedSchoolCard } from './UnlimitedSchoolCard';
import { VideoEmbed } from './VideoEmbed';
import { LessonExplorer } from './LessonExplorer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, ArrowDown, ChevronDown, Upload, RotateCw } from 'lucide-react';
import { addMonths, format } from 'date-fns';

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  basePrice: {
    teacher: number;
    student: number;
  };
  volumeDiscounts: {
    students12Plus: number;
    students50Plus: number;
  };
  inclusions: {
    teacher: string[];
    student: string[];
    classroom: string[];
  };
  notIncluded?: string[];
  isPopular?: boolean;
  type: 'teacher' | 'student' | 'combined';
  bestFor?: string;
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

interface TierSelection {
  [tierId: string]: number;
}

interface SchoolInfo {
  schoolName: string;
  schoolAddress: string;
  schoolABN: string;
  contactPhone: string;
  deliveryAddress: string;
  deliveryIsSameAsSchool: boolean;
  billingAddress: string;
  billingIsSameAsSchool: boolean;
  accountsEmail: string;
  coordinatorEmail: string;
  coordinatorName: string;
  coordinatorPosition: string;
  purchaseOrderNumber: string;
  paymentPreference: string;
  supplierSetupForms: string;
}

interface MicroCredential {
  id: string;
  title: string;
  description: string;
  image: string;
  details: string;
}

// ... keep existing code (teacherTiers, studentTiers, unlimitedTier arrays)

const teacherTiers: PricingTier[] = [
  {
    id: 'teacher-digital',
    name: 'Digital Pass Only',
    description: 'Complete digital access for teachers',
    basePrice: { teacher: 119, student: 0 },
    volumeDiscounts: { students12Plus: 0, students50Plus: 0 },
    inclusions: {
      teacher: [
        '42 x Click & Play Powerpoint Lessons',
        '168 x Theory Videos',
        '168 x Printable Worksheets',
        'Classroom Lesson Quizzes',
        'Lesson Plans',
        'Curriculum Alignment Guides',
        'Digital Textbook',
        'Classroom Space (requires student passes)'
      ],
      student: [],
      classroom: []
    },
    notIncluded: ['Print Textbook', 'Offline Access'],
    type: 'teacher',
    bestFor: 'Tech-savvy teachers with digital classrooms'
  },
  {
    id: 'teacher-physical',
    name: 'Textbook Only',
    description: 'Physical textbook for teachers',
    basePrice: { teacher: 89, student: 0 },
    volumeDiscounts: { students12Plus: 0, students50Plus: 0 },
    inclusions: {
      teacher: [
        '42 x Complete Lesson Resources',
        '168 x Illustrated Theory Pages',
        '168 x Worksheets',
        'Lesson Plans',
        'Curriculum Alignment Guides'
      ],
      student: [],
      classroom: []
    },
    notIncluded: ['Click & Play Digital Lessons', 'Digital Textbook', 'Classroom Lesson Quizzes', 'Classroom Space'],
    type: 'teacher',
    bestFor: 'Traditional classroom teachers who prefer print materials'
  },
  {
    id: 'teacher-both',
    name: 'Digital Pass + Textbook Bundle',
    description: 'Complete teacher package',
    basePrice: { teacher: 189, student: 0 },
    volumeDiscounts: { students12Plus: 0, students50Plus: 0 },
    inclusions: {
      teacher: [
        '1 x Print & Digital Textbook',
        '1 x Digital Teacher Pass',
        '42 x Click & Play Powerpoint Lessons',
        '168 x Theory Videos + Illustrated Theory Pages',
        '168 x Printable Worksheets',
        'Classroom Lesson Quizzes',
        'Lesson Plans',
        'Curriculum Alignment Guides',
        'Classroom Space (requires student passes)'
      ],
      student: [],
      classroom: []
    },
    isPopular: true,
    type: 'teacher',
    bestFor: 'Teachers who want maximum flexibility and resources'
  }
];

const studentTiers: PricingTier[] = [
  {
    id: 'student-digital',
    name: 'Digital Pass Only',
    description: 'Digital access for students',
    basePrice: { teacher: 0, student: 21 },
    volumeDiscounts: { students12Plus: 18, students50Plus: 15 },
    inclusions: {
      teacher: [],
      student: [
        'Personal Student Account',
        '42 x Digital Lessons',
        '168 x Theory Videos',
        '168 x Gamified Activities',
        'Lesson Quizzes',
        'Lesson Certificates',
        'Micro-Credential Pre & Post Testing'
      ],
      classroom: []
    },
    notIncluded: ['Print Student Textbook', 'Offline Access'],
    type: 'student',
    bestFor: '1:1 device schools and tech-comfortable students'
  },
  {
    id: 'student-physical',
    name: 'Textbook Only',
    description: 'Physical textbook for students',
    basePrice: { teacher: 0, student: 49 },
    volumeDiscounts: { students12Plus: 42, students50Plus: 40 },
    inclusions: {
      teacher: [],
      student: [
        '42 x Complete Lesson Resources',
        '168 x Illustrated Theory Pages',
        '168 x Worksheets',
        'Worksheet Answers'
      ],
      classroom: []
    },
    notIncluded: ['Digital Lesson Access', 'Digital Textbook', 'Micro-Credential Pre & Post Testing'],
    type: 'student',
    bestFor: 'Students who learn better with physical materials'
  },
  {
    id: 'student-both',
    name: 'Digital Pass + Textbook Bundle',
    description: 'Complete student package',
    basePrice: { teacher: 0, student: 55 },
    volumeDiscounts: { students12Plus: 49, students50Plus: 46 },
    inclusions: {
      teacher: [],
      student: [
        '1 x Student Digital Pass',
        '1 x Print Student Textbook',
        '42 x Lessons',
        '168 x Theory Videos + Illustrated Theory Pages',
        '168 x Worksheets + Gamified Activities',
        'Micro-Credential Pre & Post Testing',
        'Lesson Quizzes',
        'Lesson Certificates'
      ],
      classroom: []
    },
    isPopular: true,
    type: 'student',
    bestFor: 'Schools wanting comprehensive learning resources'
  }
];

const unlimitedTier: UnlimitedTier = {
  id: 'unlimited',
  name: 'Unlimited School Access',
  description: 'Complete digital access for entire school',
  basePrice: 3199,
  addOns: {
    teacherBooks: 79,
    studentBooks: 42,
    posterA0: 89
  },
  inclusions: [
    'Unlimited Teacher Digital Passes',
    'Unlimited Student Digital Passes',
    'Unlimited Classroom Spaces'
  ],
  bestFor: 'Perfect for schools prioritising financial empowerment as a core student outcome'
};

const microCredentials: MicroCredential[] = [
  {
    id: 'budgeting',
    title: 'Budgeting',
    description: 'Master personal and household budgeting skills',
    image: '/lovable-uploads/micro-credential-budgeting.png',
    details: 'Students learn to create and manage personal budgets, track expenses, and make informed financial decisions.'
  },
  {
    id: 'banking',
    title: 'Banking & Payments',
    description: 'Understand modern banking and payment systems',
    image: '/lovable-uploads/micro-credential-banking.png',
    details: 'Covers account management, digital payments, fees, and banking services for young adults.'
  },
  {
    id: 'credit',
    title: 'Credit & Debt',
    description: 'Navigate credit products and debt management',
    image: '/lovable-uploads/micro-credential-credit.png',
    details: 'Learn about credit scores, responsible borrowing, and strategies for managing debt effectively.'
  },
  {
    id: 'planning',
    title: 'Financial Planning',
    description: 'Develop long-term financial strategies',
    image: '/lovable-uploads/micro-credential-planning.png',
    details: 'Focus on goal setting, investment basics, insurance, and planning for major life events.'
  }
];

export const QuoteBuilder = () => {
  const [selectedTeacherTiers, setSelectedTeacherTiers] = useState<TierSelection>({});
  const [selectedStudentTiers, setSelectedStudentTiers] = useState<TierSelection>({});
  const [useUnlimited, setUseUnlimited] = useState<boolean>(false);
  const [unlimitedAddOns, setUnlimitedAddOns] = useState({
    teacherBooks: 0,
    studentBooks: 0,
    posterA0: 0
  });
  const [programStartDate, setProgramStartDate] = useState<Date>(new Date());
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>({
    schoolName: '',
    schoolAddress: '',
    schoolABN: '',
    contactPhone: '',
    deliveryAddress: '',
    deliveryIsSameAsSchool: true,
    billingAddress: '',
    billingIsSameAsSchool: true,
    accountsEmail: '',
    coordinatorEmail: '',
    coordinatorName: '',
    coordinatorPosition: '',
    purchaseOrderNumber: '',
    paymentPreference: '',
    supplierSetupForms: ''
  });
  const [flippedCredentials, setFlippedCredentials] = useState<Set<string>>(new Set());

  const GST_RATE = 0.1;
  const SHIPPING_THRESHOLD = 90;
  const SHIPPING_COST = 14;

  const getTotalTeacherCount = (): number => {
    return Object.values(selectedTeacherTiers).reduce((sum, count) => sum + count, 0);
  };

  const getTotalStudentCount = (): number => {
    return Object.values(selectedStudentTiers).reduce((sum, count) => sum + count, 0);
  };

  const hasPhysicalItems = (): boolean => {
    if (useUnlimited) {
      return unlimitedAddOns.teacherBooks > 0 || unlimitedAddOns.studentBooks > 0 || unlimitedAddOns.posterA0 > 0;
    }
    return (selectedTeacherTiers['teacher-physical'] > 0 || 
            selectedTeacherTiers['teacher-both'] > 0 || 
            selectedStudentTiers['student-physical'] > 0 || 
            selectedStudentTiers['student-both'] > 0);
  };

  const calculateStudentPrice = (tier: PricingTier, currentStudentCount: number): number => {
    let studentPrice = tier.basePrice.student;
    
    if (currentStudentCount >= 50) {
      studentPrice = tier.volumeDiscounts.students50Plus;
    } else if (currentStudentCount >= 12) {
      studentPrice = tier.volumeDiscounts.students12Plus;
    }

    return studentPrice;
  };

  const calculateRegularTotal = (): { subtotal: number; gst: number; total: number; shipping: number } => {
    let teacherCost = 0;
    let studentCost = 0;
    
    // Calculate teacher costs
    teacherTiers.forEach(tier => {
      const count = selectedTeacherTiers[tier.id] || 0;
      teacherCost += tier.basePrice.teacher * count;
    });
    
    // Calculate student costs
    const totalStudents = getTotalStudentCount();
    studentTiers.forEach(tier => {
      const count = selectedStudentTiers[tier.id] || 0;
      studentCost += calculateStudentPrice(tier, totalStudents) * count;
    });
    
    let shipping = 0;
    if (hasPhysicalItems()) {
      const subtotalBeforeShipping = (teacherCost + studentCost) / (1 + GST_RATE);
      if (subtotalBeforeShipping < SHIPPING_THRESHOLD) {
        shipping = SHIPPING_COST;
      }
    }
    
    const total = teacherCost + studentCost + shipping;
    const subtotal = (teacherCost + studentCost) / (1 + GST_RATE);
    const gst = total - subtotal - shipping;
    
    return { subtotal, gst, total, shipping };
  };

  const getVolumeNotification = (): string | null => {
    const totalStudents = getTotalStudentCount();
    if (totalStudents > 0 && totalStudents < 12) {
      return `Add ${12 - totalStudents} more students to unlock volume pricing!`;
    } else if (totalStudents >= 12 && totalStudents < 50) {
      return `Add ${50 - totalStudents} more students for maximum volume discount!`;
    }
    return null;
  };

  const getIncludedItems = () => {
    const items = [];
    
    if (useUnlimited) {
      items.push('Unlimited Teacher Digital Passes');
      items.push('Unlimited Student Digital Passes');
      items.push('Unlimited Digital Classroom Spaces');
      if (unlimitedAddOns.teacherBooks > 0) items.push(`${unlimitedAddOns.teacherBooks} x Teacher Print Textbook(s)`);
      if (unlimitedAddOns.studentBooks > 0) items.push(`${unlimitedAddOns.studentBooks} x Student Print Textbook(s)`);
      if (unlimitedAddOns.posterA0 > 0) items.push(`${unlimitedAddOns.posterA0} x A0 Poster(s)`);
    } else {
      const teacherDigital = selectedTeacherTiers['teacher-digital'] || 0;
      const teacherPhysical = selectedTeacherTiers['teacher-physical'] || 0;
      const teacherBoth = selectedTeacherTiers['teacher-both'] || 0;
      const studentDigital = selectedStudentTiers['student-digital'] || 0;
      const studentPhysical = selectedStudentTiers['student-physical'] || 0;
      const studentBoth = selectedStudentTiers['student-both'] || 0;

      const totalTeacherDigital = teacherDigital + teacherBoth;
      const totalTeacherPhysical = teacherPhysical + teacherBoth;
      const totalStudentDigital = studentDigital + studentBoth;
      const totalStudentPhysical = studentPhysical + studentBoth;
      const totalClassrooms = totalTeacherDigital;

      if (totalTeacherDigital > 0) items.push(`${totalTeacherDigital} x Teacher Digital Pass(es)`);
      if (totalTeacherPhysical > 0) items.push(`${totalTeacherPhysical} x Teacher Print Textbook(s)`);
      if (totalClassrooms > 0) items.push(`${totalClassrooms} x Digital Classroom Space(s)`);
      if (totalStudentDigital > 0) items.push(`${totalStudentDigital} x Student Digital Pass(es)`);
      if (totalStudentPhysical > 0) items.push(`${totalStudentPhysical} x Student Print Textbook(s)`);
    }
    
    return items;
  };

  const handleCredentialFlip = (id: string) => {
    setFlippedCredentials(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleTeacherSelection = (tierId: string, count: number) => {
    if (useUnlimited) setUseUnlimited(false);
    setSelectedTeacherTiers(prev => ({
      ...prev,
      [tierId]: count
    }));
  };

  const handleStudentSelection = (tierId: string, count: number) => {
    if (useUnlimited) setUseUnlimited(false);
    setSelectedStudentTiers(prev => ({
      ...prev,
      [tierId]: count
    }));
  };

  const handleUnlimitedSelection = () => {
    if (!useUnlimited) {
      setSelectedTeacherTiers({});
      setSelectedStudentTiers({});
    }
    setUseUnlimited(!useUnlimited);
  };

  const regularPricing = calculateRegularTotal();
  const volumeNotification = getVolumeNotification();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/25655841-ce46-4847-b1b0-63cf9fc9699e.png" 
              alt="Mandy Money High School Program Logo" 
              className="h-24 object-contain"
            />
          </div>
          <div className="flex items-center justify-center gap-8 mb-4">
            <div className="text-6xl bg-gradient-to-r from-[#fe5510] via-[#fea700] to-[#fe8303] bg-clip-text text-transparent">✨</div>
            <h1 className="text-6xl font-extrabold bg-gradient-to-r from-[#fe5510] via-[#fea700] to-[#fe8303] bg-clip-text text-transparent">
              Quote Builder
            </h1>
            <div className="text-6xl bg-gradient-to-r from-[#fe5510] via-[#fea700] to-[#fe8303] bg-clip-text text-transparent">✨</div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Build your custom quote for Australia's leading financial literacy program
          </p>
        </div>

        {/* Video Embed */}
        <VideoEmbed />

        {/* Volume Notification */}
        {volumeNotification && (
          <Card className="mb-8 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
            <div className="text-center">
              <p className="text-orange-800 font-semibold">{volumeNotification}</p>
            </div>
          </Card>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Step 1: Teacher Section */}
            <Card className="mb-8 p-6 bg-white shadow-sm border-2" style={{ borderImage: 'linear-gradient(135deg, #005653, #45c0a9, #80dec4) 1' }}>
              <div className="mb-6">
                <div className="text-center mb-4">
                  <div className="inline-block bg-gradient-to-r from-[#005653] to-[#45c0a9] text-white px-6 py-2 rounded-full text-lg font-bold">
                    Teacher Options
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: '#005653' }}>
                  Step 1: Select your Teacher Program Elements
                </h2>
                <p className="text-center" style={{ color: '#45c0a9' }}>Choose the teaching resources that work best for your classroom</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6 mb-4">
                {teacherTiers.map((tier, index) => (
                  <PricingCard
                    key={tier.id}
                    tier={tier}
                    price={tier.basePrice.teacher}
                    isSelected={selectedTeacherTiers[tier.id] > 0}
                    onSelect={() => {}}
                    teacherCount={selectedTeacherTiers[tier.id] || 0}
                    studentCount={0}
                    animationDelay={index * 100}
                    showImages={true}
                    includeGST={true}
                    colorScheme="teal"
                    customGradient="linear-gradient(135deg, #005653, #45c0a9, #80dec4)"
                    volumeSelector={
                      <VolumeSelector
                        label="Number of Teachers"
                        value={selectedTeacherTiers[tier.id] || 0}
                        onChange={(count) => handleTeacherSelection(tier.id, count)}
                        min={0}
                        max={20}
                        color="teal"
                      />
                    }
                  />
                ))}
              </div>
            </Card>

            {/* Step 2: Student Section */}
            <Card className="mb-8 p-6 bg-white shadow-sm border-2" style={{ borderImage: 'linear-gradient(135deg, #ffb512, #ffde5a, #fea100) 1' }}>
              <div className="mb-6">
                <div className="text-center mb-4">
                  <div className="inline-block bg-gradient-to-r from-[#ffb512] to-[#fea100] text-white px-6 py-2 rounded-full text-lg font-bold">
                    Student Options
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: '#fea100' }}>
                  Step 2: Select your Student Program Elements
                </h2>
                <p className="text-center" style={{ color: '#ffb512' }}>Choose the learning materials that engage your students</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6 mb-4">
                {studentTiers.map((tier, index) => {
                  const currentStudentCount = selectedStudentTiers[tier.id] || 0;
                  const totalStudents = getTotalStudentCount();
                  const currentPrice = calculateStudentPrice(tier, totalStudents);
                  const originalPrice = tier.basePrice.student;
                  const savings = originalPrice - currentPrice;
                  const hasVolumeDiscount = totalStudents >= 12;
                  
                  return (
                    <PricingCard
                      key={tier.id}
                      tier={tier}
                      price={currentPrice}
                      isSelected={selectedStudentTiers[tier.id] > 0}
                      onSelect={() => {}}
                      teacherCount={0}
                      studentCount={selectedStudentTiers[tier.id] || 0}
                      animationDelay={index * 100}
                      showImages={true}
                      studentPrice={currentPrice}
                      includeGST={true}
                      colorScheme="yellow"
                      customGradient="linear-gradient(135deg, #ffb512, #ffde5a, #fea100)"
                      showSavings={savings > 0 && hasVolumeDiscount}
                      savings={savings}
                      volumeSelector={
                        <VolumeSelector
                          label="Number of Students"
                          value={selectedStudentTiers[tier.id] || 0}
                          onChange={(count) => handleStudentSelection(tier.id, count)}
                          min={0}
                          max={200}
                          color="yellow"
                        />
                      }
                    />
                  );
                })}
              </div>
            </Card>

            {/* Unlimited School Access Suggestion */}
            {regularPricing.total > 2000 && !useUnlimited && (
              <Card className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">👇</div>
                  <div>
                    <h3 className="font-bold text-blue-800 text-lg">Consider Our Unlimited School Access Option!</h3>
                    <p className="text-blue-700">
                      Your current quote is ${regularPricing.total.toLocaleString()}. Our Unlimited School Access option might offer exceptional value for your entire school community.
                    </p>
                    <p className="text-blue-600 text-sm mt-1 flex items-center">
                      <ArrowDown className="h-4 w-4 mr-1" />
                      See the unlimited option below for complete school-wide access
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* OR Divider */}
            <div className="mb-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-lg">
                  <span className="bg-gray-50 px-6 text-2xl font-bold text-gray-700">OR</span>
                </div>
              </div>
            </div>

            {/* Unlimited School Access */}
            <div className="mb-8">
              <UnlimitedSchoolCard
                tier={unlimitedTier}
                isSelected={useUnlimited}
                onSelect={handleUnlimitedSelection}
                addOns={unlimitedAddOns}
                onAddOnsChange={setUnlimitedAddOns}
                pricing={regularPricing}
                teacherCount={getTotalTeacherCount()}
                studentCount={getTotalStudentCount()}
                regularPricing={regularPricing}
              />
            </div>

            {useUnlimited && (
              <div className="text-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setUseUnlimited(false)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Unselect Unlimited Option
                </Button>
              </div>
            )}
          </div>

          {/* Running Total Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="p-6 bg-white shadow-sm border-2 border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Complete Package Cost</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="text-3xl font-bold text-gray-800">${regularPricing.total.toLocaleString()} <span className="text-sm text-gray-600">(inc. GST)</span></div>
                  <div className="text-gray-600 text-sm">
                    {getTotalTeacherCount() > 0 ? `${getTotalTeacherCount()} Teacher${getTotalTeacherCount() > 1 ? 's' : ''}` : ''}
                    {getTotalTeacherCount() > 0 && getTotalStudentCount() > 0 ? ' + ' : ''}
                    {getTotalStudentCount() > 0 ? `${getTotalStudentCount()} Student${getTotalStudentCount() > 1 ? 's' : ''}` : ''}
                  </div>
                  <div className="text-xs text-gray-500">Includes 12 month access</div>
                  {regularPricing.shipping > 0 && (
                    <div className="text-xs text-gray-500">+ $14 shipping</div>
                  )}
                </div>

                {/* Program Inclusions */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">What's Included:</h4>
                  <div className="space-y-1">
                    {getIncludedItems().map((item, index) => (
                      <div key={index} className="text-xs text-gray-600">• {item}</div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Official Quote Section */}
        <div className="mt-12 border-t-4 border-green-600 pt-8 bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-8 mb-4">
              <div className="text-4xl bg-gradient-to-r from-green-500 via-green-600 to-green-700 bg-clip-text text-transparent">✨</div>
              <h2 className="text-3xl font-bold text-green-800">📋 Official Program Quote</h2>
              <div className="text-4xl bg-gradient-to-r from-green-500 via-green-600 to-green-700 bg-clip-text text-transparent">✨</div>
            </div>
            
            {/* School Name and Quote Validity */}
            {schoolInfo.schoolName && (
              <div className="text-xl font-semibold text-green-700 mb-2">{schoolInfo.schoolName}</div>
            )}
            <div className="text-sm text-gray-600 mb-4">
              Quote valid until 31st December, {new Date().getFullYear()}
            </div>
            
            {/* School Information Form */}
            <Card className="max-w-4xl mx-auto mb-6 p-6 bg-white">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">School Information</h3>
              <p className="text-sm text-gray-600 mb-4">Information not required unless placing an order</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="School Name *"
                  value={schoolInfo.schoolName}
                  onChange={(e) => setSchoolInfo(prev => ({ ...prev, schoolName: e.target.value }))}
                  className="font-medium"
                />
                <Input
                  placeholder="School ABN"
                  value={schoolInfo.schoolABN}
                  onChange={(e) => setSchoolInfo(prev => ({ ...prev, schoolABN: e.target.value }))}
                />
                <Textarea
                  placeholder="School Address"
                  value={schoolInfo.schoolAddress}
                  onChange={(e) => setSchoolInfo(prev => ({ ...prev, schoolAddress: e.target.value }))}
                  className="md:col-span-2"
                />
                <Input
                  placeholder="Contact Phone"
                  value={schoolInfo.contactPhone}
                  onChange={(e) => setSchoolInfo(prev => ({ ...prev, contactPhone: e.target.value }))}
                />
                <Input
                  placeholder="Coordinator Name"
                  value={schoolInfo.coordinatorName}
                  onChange={(e) => setSchoolInfo(prev => ({ ...prev, coordinatorName: e.target.value }))}
                />
                <Input
                  placeholder="Coordinator Position"
                  value={schoolInfo.coordinatorPosition}
                  onChange={(e) => setSchoolInfo(prev => ({ ...prev, coordinatorPosition: e.target.value }))}
                />
                <Input
                  placeholder="Coordinator Email"
                  value={schoolInfo.coordinatorEmail}
                  onChange={(e) => setSchoolInfo(prev => ({ ...prev, coordinatorEmail: e.target.value }))}
                />
                <Input
                  placeholder="Accounts Email"
                  value={schoolInfo.accountsEmail}
                  onChange={(e) => setSchoolInfo(prev => ({ ...prev, accountsEmail: e.target.value }))}
                />
                <Input
                  placeholder="Purchase Order Number"
                  value={schoolInfo.purchaseOrderNumber}
                  onChange={(e) => setSchoolInfo(prev => ({ ...prev, purchaseOrderNumber: e.target.value }))}
                />
                
                {hasPhysicalItems() && (
                  <>
                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id="deliveryIsSame"
                          checked={schoolInfo.deliveryIsSameAsSchool}
                          onCheckedChange={(checked) => setSchoolInfo(prev => ({ ...prev, deliveryIsSameAsSchool: checked as boolean }))}
                        />
                        <label htmlFor="deliveryIsSame" className="text-sm">Delivery address same as school address</label>
                      </div>
                      {!schoolInfo.deliveryIsSameAsSchool && (
                        <Textarea
                          placeholder="Delivery Address"
                          value={schoolInfo.deliveryAddress}
                          onChange={(e) => setSchoolInfo(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                        />
                      )}
                    </div>
                  </>
                )}
                
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id="billingIsSame"
                      checked={schoolInfo.billingIsSameAsSchool}
                      onCheckedChange={(checked) => setSchoolInfo(prev => ({ ...prev, billingIsSameAsSchool: checked as boolean }))}
                    />
                    <label htmlFor="billingIsSame" className="text-sm">Billing address same as school address</label>
                  </div>
                  {!schoolInfo.billingIsSameAsSchool && (
                    <Textarea
                      placeholder="Billing Address"
                      value={schoolInfo.billingAddress}
                      onChange={(e) => setSchoolInfo(prev => ({ ...prev, billingAddress: e.target.value }))}
                    />
                  )}
                </div>
                
                <Select value={schoolInfo.paymentPreference} onValueChange={(value) => setSchoolInfo(prev => ({ ...prev, paymentPreference: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Payment Preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Card Payment</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={schoolInfo.supplierSetupForms} onValueChange={(value) => setSchoolInfo(prev => ({ ...prev, supplierSetupForms: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Supplier Setup Forms Required?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="not-sure">Not Sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>

          {/* Program Inclusions */}
          <div className="mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Program Inclusions</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {getIncludedItems().map((item, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    {item}
                  </div>
                ))}
              </div>
              {regularPricing.shipping === 0 && hasPhysicalItems() && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="text-green-700 font-medium">✓ Free shipping included (order over $90)</div>
                </div>
              )}
            </div>
          </div>

          <InclusionsDisplay
            teacherTier={null}
            studentTier={null}
            pricing={regularPricing}
            teacherCount={getTotalTeacherCount()}
            studentCount={getTotalStudentCount()}
            studentPrice={0}
            isUnlimited={useUnlimited}
            unlimitedTier={useUnlimited ? unlimitedTier : undefined}
            unlimitedAddOns={unlimitedAddOns}
            programStartDate={programStartDate}
            onStartDateChange={setProgramStartDate}
            programEndDate={addMonths(programStartDate, 12)}
            volumeSavings={0}
          />

          <div className="mt-6">
            <ActionButtons
              selectedTier={{ 
                name: 'Custom Selection',
                id: 'combined'
              }}
              totalPrice={regularPricing.total}
              teacherCount={getTotalTeacherCount()}
              studentCount={getTotalStudentCount()}
            />
          </div>
        </div>

        {/* Explore Materials Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
            <h2 className="text-4xl font-bold mb-2">✨ Explore your included materials ✨</h2>
          </div>
          <div className="flex justify-center items-center mt-4">
            <ArrowDown className="h-6 w-6 text-gray-600 animate-bounce" />
            <span className="ml-2 text-gray-600">Scroll down to explore</span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12">
          <div className="border-t-2 border-gray-300"></div>
        </div>

        {/* Micro-Credentials Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              <h2 className="text-4xl font-bold">✨ 🎓 Your Four Micro-Credentials ✨</h2>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {microCredentials.map((credential) => (
              <Card 
                key={credential.id} 
                className="cursor-pointer transition-all duration-300 hover:scale-105 perspective-1000"
                onClick={() => handleCredentialFlip(credential.id)}
              >
                <div className={`relative w-full h-64 transition-transform duration-500 transform-style-preserve-3d ${flippedCredentials.has(credential.id) ? 'rotate-y-180' : ''}`}>
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden">
                    <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg flex items-center justify-center">
                      <Upload className="h-12 w-12 text-white" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{credential.title}</h3>
                      <p className="text-sm text-gray-600">{credential.description}</p>
                      <div className="mt-3 flex items-center text-blue-600 text-sm">
                        <RotateCw className="h-4 w-4 mr-1" />
                        Click to flip
                      </div>
                    </div>
                  </div>
                  
                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180">
                    <div className="h-full p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg flex flex-col justify-center">
                      <h3 className="font-bold text-lg mb-3 text-center">{credential.title}</h3>
                      <p className="text-sm text-gray-700 text-center leading-relaxed">{credential.details}</p>
                      <div className="mt-3 flex items-center justify-center text-purple-600 text-sm">
                        <RotateCw className="h-4 w-4 mr-1" />
                        Click to flip back
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* See Inside Textbook Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              <h2 className="text-4xl font-bold">✨ See inside the Textbook ✨</h2>
            </div>
          </div>
          
          <Card className="p-8 bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <div className="bg-white rounded-lg p-8 shadow-lg max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Interactive Textbook Preview</h3>
                <div className="bg-gray-100 rounded-lg p-12 mb-4">
                  <p className="text-gray-600 mb-4">FlipHTML5 Embed will be placed here</p>
                  <div className="text-sm text-gray-500">
                    Browse through sample pages, lessons, and activities from the complete textbook
                  </div>
                </div>
                <p className="text-gray-600">
                  Explore the comprehensive content that makes up Australia's leading financial literacy curriculum
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Lesson Explorer */}
        <LessonExplorer />

      </div>
    </div>
  );
};
