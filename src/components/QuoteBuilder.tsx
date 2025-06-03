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
import { X, ArrowDown } from 'lucide-react';
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
  const [schoolName, setSchoolName] = useState<string>('');

  const GST_RATE = 0.1;

  const getTotalTeacherCount = (): number => {
    return Object.values(selectedTeacherTiers).reduce((sum, count) => sum + count, 0);
  };

  const getTotalStudentCount = (): number => {
    return Object.values(selectedStudentTiers).reduce((sum, count) => sum + count, 0);
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

  const calculateRegularTotal = (): { subtotal: number; gst: number; total: number } => {
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
    
    const total = teacherCost + studentCost;
    const subtotal = total / (1 + GST_RATE);
    const gst = total - subtotal;
    
    return { subtotal, gst, total };
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
                
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-gray-800">${regularPricing.total.toLocaleString()} <span className="text-sm text-gray-600">(inc. GST)</span></div>
                  <div className="text-gray-600 text-sm">
                    {getTotalTeacherCount() > 0 ? `${getTotalTeacherCount()} Teacher${getTotalTeacherCount() > 1 ? 's' : ''}` : ''}
                    {getTotalTeacherCount() > 0 && getTotalStudentCount() > 0 ? ' + ' : ''}
                    {getTotalStudentCount() > 0 ? `${getTotalStudentCount()} Student${getTotalStudentCount() > 1 ? 's' : ''}` : ''}
                  </div>
                  <div className="text-xs text-gray-500">Includes 12 month access</div>
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
              <h2 className="text-3xl font-bold text-green-800">📋 Your Official Program Quote</h2>
              <div className="text-4xl bg-gradient-to-r from-green-500 via-green-600 to-green-700 bg-clip-text text-transparent">✨</div>
            </div>
            
            {/* School Name Input */}
            <div className="mt-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your school name"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="text-center text-lg font-medium"
              />
            </div>
            
            {/* Date Stamp */}
            <div className="mt-2 text-sm text-gray-600">
              Quote generated on {format(new Date(), 'MMMM d, yyyy')}
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

        {/* Divider */}
        <div className="my-12">
          <div className="border-t-2 border-gray-300"></div>
        </div>

        {/* Lesson Explorer with Icon */}
        <LessonExplorer />

      </div>
    </div>
  );
};
