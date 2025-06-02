import React, { useState } from 'react';
import { PricingCard } from './PricingCard';
import { VolumeSelector } from './VolumeSelector';
import { InclusionsDisplay } from './InclusionsDisplay';
import { ActionButtons } from './ActionButtons';
import { UnlimitedSchoolCard } from './UnlimitedSchoolCard';
import { VideoEmbed } from './VideoEmbed';
import { ProgramStartDate } from './ProgramStartDate';
import { LessonExplorer } from './LessonExplorer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle } from 'lucide-react';
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
  };
  inclusions: string[];
  bestFor: string;
}

const teacherTiers: PricingTier[] = [
  {
    id: 'teacher-digital',
    name: 'Teacher Digital Pass',
    description: 'Complete digital access for teachers',
    basePrice: { teacher: 119, student: 0 }, // GST inclusive
    volumeDiscounts: { students12Plus: 0, students50Plus: 0 },
    inclusions: {
      teacher: ['42 Interactive Digital Lessons', 'Teacher Dashboard', 'Lesson Plans & Resources', 'Assessment Tools'],
      student: [],
      classroom: ['1 Classroom Space per Teacher', 'Student Progress Tracking', 'Class Management Tools']
    },
    notIncluded: ['Physical Textbook', 'Print Resources', 'Offline Access'],
    type: 'teacher',
    bestFor: 'Tech-savvy teachers with digital classrooms'
  },
  {
    id: 'teacher-physical',
    name: 'Teacher Hard-Copy',
    description: 'Physical textbook for teachers',
    basePrice: { teacher: 89, student: 0 }, // GST inclusive
    volumeDiscounts: { students12Plus: 0, students50Plus: 0 },
    inclusions: {
      teacher: ['42 Lesson Physical Textbook', 'Teacher Guide', 'Print Resources', 'Durable Materials'],
      student: [],
      classroom: ['1 Classroom Space per Teacher', 'Basic Progress Tracking']
    },
    notIncluded: ['Digital Interactive Lessons', 'Teacher Dashboard', 'Mobile Access'],
    type: 'teacher',
    bestFor: 'Traditional classroom teachers who prefer print materials'
  },
  {
    id: 'teacher-both',
    name: 'Teacher Digital + Physical',
    description: 'Complete teacher package',
    basePrice: { teacher: 189, student: 0 }, // GST inclusive
    volumeDiscounts: { students12Plus: 0, students50Plus: 0 },
    inclusions: {
      teacher: ['42 Interactive Digital Lessons', '42 Lesson Physical Textbook', 'Teacher Dashboard', 'All Print & Digital Resources'],
      student: [],
      classroom: ['1 Classroom Space per Teacher', 'Advanced Progress Tracking', 'Full Class Management']
    },
    isPopular: true,
    type: 'teacher',
    bestFor: 'Teachers who want maximum flexibility and resources'
  }
];

const studentTiers: PricingTier[] = [
  {
    id: 'student-digital',
    name: 'Student Digital Pass',
    description: 'Digital access for students',
    basePrice: { teacher: 0, student: 21 }, // GST inclusive
    volumeDiscounts: { students12Plus: 18, students50Plus: 15 }, // GST inclusive
    inclusions: {
      teacher: [],
      student: ['42 Interactive Lessons', 'Mobile & Tablet Access', 'Downloadable Resources', 'Progress Tracking'],
      classroom: []
    },
    notIncluded: ['Physical Textbook', 'Workbook Pages', 'Offline Access'],
    type: 'student',
    bestFor: '1:1 device schools and tech-comfortable students'
  },
  {
    id: 'student-physical',
    name: 'Student Hard-Copy',
    description: 'Physical textbook for students',
    basePrice: { teacher: 0, student: 49 }, // GST inclusive
    volumeDiscounts: { students12Plus: 42, students50Plus: 40 }, // GST inclusive
    inclusions: {
      teacher: [],
      student: ['42 Lesson Textbook', 'Workbook Pages', 'No Internet Required', 'Durable Print Materials'],
      classroom: []
    },
    notIncluded: ['Digital Interactive Lessons', 'Mobile Access', 'Online Progress Tracking'],
    type: 'student',
    bestFor: 'Students who learn better with physical materials'
  },
  {
    id: 'student-both',
    name: 'Student Digital + Physical',
    description: 'Complete student package',
    basePrice: { teacher: 0, student: 55 }, // GST inclusive
    volumeDiscounts: { students12Plus: 49, students50Plus: 46 }, // GST inclusive
    inclusions: {
      teacher: [],
      student: ['42 Interactive Lessons', '42 Lesson Textbook', 'Mobile Access', 'All Resources', 'Complete Package'],
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
  basePrice: 3199, // GST inclusive
  addOns: {
    teacherBooks: 89, // GST inclusive
    studentBooks: 49 // GST inclusive
  },
  inclusions: [
    'Unlimited Digital Access',
    'All Teachers & Students',
    '42 Interactive Lessons',
    'School-wide License',
    'Priority Support',
    'Admin Dashboard',
    'Unlimited Classroom Spaces',
    'Advanced Analytics'
  ],
  bestFor: 'Large schools with 50+ students seeking maximum value'
};

export const QuoteBuilder = () => {
  const [selectedTeacherTier, setSelectedTeacherTier] = useState<string>('');
  const [selectedStudentTier, setSelectedStudentTier] = useState<string>('');
  const [teacherCount, setTeacherCount] = useState<number>(1);
  const [studentCount, setStudentCount] = useState<number>(25);
  const [useUnlimited, setUseUnlimited] = useState<boolean>(false);
  const [unlimitedAddOns, setUnlimitedAddOns] = useState({
    teacherBooks: 0,
    studentBooks: 0
  });
  const [programStartDate, setProgramStartDate] = useState<Date>(new Date());

  const GST_RATE = 0.1;
  const programEndDate = addMonths(programStartDate, 12);

  const calculateStudentPrice = (tier: PricingTier): number => {
    let studentPrice = tier.basePrice.student;
    
    if (studentCount >= 50) {
      studentPrice = tier.volumeDiscounts.students50Plus;
    } else if (studentCount >= 12) {
      studentPrice = tier.volumeDiscounts.students12Plus;
    }

    return studentPrice;
  };

  const getNextDiscountThreshold = (): { threshold: number; studentsToGo: number } | null => {
    if (studentCount < 12) {
      return { threshold: 12, studentsToGo: 12 - studentCount };
    } else if (studentCount < 50) {
      return { threshold: 50, studentsToGo: 50 - studentCount };
    }
    return null;
  };

  const calculateRegularTotal = (): { subtotal: number; gst: number; total: number } => {
    const selectedTeacher = teacherTiers.find(tier => tier.id === selectedTeacherTier);
    const selectedStudent = studentTiers.find(tier => tier.id === selectedStudentTier);
    
    const teacherCost = selectedTeacher ? selectedTeacher.basePrice.teacher * teacherCount : 0;
    const studentCost = selectedStudent ? calculateStudentPrice(selectedStudent) * studentCount : 0;
    
    const total = teacherCost + studentCost;
    const subtotal = total / (1 + GST_RATE);
    const gst = total - subtotal;
    
    return { subtotal, gst, total };
  };

  const calculateUnlimitedTotal = (): { subtotal: number; gst: number; total: number } => {
    const total = unlimitedTier.basePrice + 
      (unlimitedAddOns.teacherBooks * unlimitedTier.addOns.teacherBooks) +
      (unlimitedAddOns.studentBooks * unlimitedTier.addOns.studentBooks);
    
    const subtotal = total / (1 + GST_RATE);
    const gst = total - subtotal;
    
    return { subtotal, gst, total };
  };

  const handleTeacherSelection = (tierId: string) => {
    if (useUnlimited) setUseUnlimited(false);
    setSelectedTeacherTier(tierId);
  };

  const handleStudentSelection = (tierId: string) => {
    if (useUnlimited) setUseUnlimited(false);
    setSelectedStudentTier(tierId);
  };

  const handleUnlimitedSelection = () => {
    if (!useUnlimited) {
      setSelectedTeacherTier('');
      setSelectedStudentTier('');
    }
    setUseUnlimited(!useUnlimited);
  };

  const selectedTeacherData = teacherTiers.find(tier => tier.id === selectedTeacherTier);
  const selectedStudentData = studentTiers.find(tier => tier.id === selectedStudentTier);
  const regularPricing = calculateRegularTotal();
  const unlimitedPricing = calculateUnlimitedTotal();
  const nextDiscount = getNextDiscountThreshold();

  const hasValidSelection = selectedTeacherData || selectedStudentData;
  const showUnlimitedSuggestion = regularPricing.total > 2000 && !useUnlimited && hasValidSelection;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/25655841-ce46-4847-b1b0-63cf9fc9699e.png" 
              alt="Mandy Money High School Program Logo" 
              className="h-24 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-teal-900 mb-4">
            Quote Builder
          </h1>
          <p className="text-xl text-teal-700 max-w-2xl mx-auto">
            Build your custom quote for Australia's leading financial literacy program
          </p>
        </div>

        {/* Video Embed */}
        <VideoEmbed />

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Teacher Section */}
            <Card className="mb-8 p-6 bg-white shadow-sm border-teal-200">
              <h2 className="text-2xl font-semibold text-teal-800 mb-6">Teacher Options</h2>
              
              <div className="mb-6">
                <VolumeSelector
                  label="Number of Teachers"
                  value={teacherCount}
                  onChange={setTeacherCount}
                  min={1}
                  max={20}
                  color="purple"
                />
              </div>

              <div className="grid lg:grid-cols-3 gap-6 mb-4">
                {teacherTiers.map((tier, index) => (
                  <PricingCard
                    key={tier.id}
                    tier={tier}
                    price={tier.basePrice.teacher}
                    isSelected={selectedTeacherTier === tier.id}
                    onSelect={() => handleTeacherSelection(tier.id)}
                    teacherCount={teacherCount}
                    studentCount={0}
                    animationDelay={index * 100}
                    showImages={true}
                    includeGST={true}
                  />
                ))}
              </div>

              {selectedTeacherTier && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTeacherTier('')}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Unselect Teacher Option
                  </Button>
                </div>
              )}
            </Card>

            {/* Student Section */}
            <Card className="mb-8 p-6 bg-white shadow-sm border-teal-200">
              <h2 className="text-2xl font-semibold text-teal-800 mb-6">Student Options</h2>
              
              <div className="mb-6">
                <VolumeSelector
                  label="Number of Students"
                  value={studentCount}
                  onChange={setStudentCount}
                  min={1}
                  max={200}
                  color="pink"
                />
              </div>

              {nextDiscount && (
                <div className="mb-6 text-center">
                  <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100 text-lg px-4 py-2">
                    🎯 Add {nextDiscount.studentsToGo} more student{nextDiscount.studentsToGo > 1 ? 's' : ''} to unlock volume discounts at {nextDiscount.threshold}+ students!
                  </Badge>
                </div>
              )}

              <div className="grid lg:grid-cols-3 gap-6 mb-4">
                {studentTiers.map((tier, index) => (
                  <PricingCard
                    key={tier.id}
                    tier={tier}
                    price={calculateStudentPrice(tier)}
                    isSelected={selectedStudentTier === tier.id}
                    onSelect={() => handleStudentSelection(tier.id)}
                    teacherCount={0}
                    studentCount={studentCount}
                    animationDelay={index * 100}
                    showImages={true}
                    studentPrice={calculateStudentPrice(tier)}
                    includeGST={true}
                  />
                ))}
              </div>

              {selectedStudentTier && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedStudentTier('')}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Unselect Student Option
                  </Button>
                </div>
              )}
            </Card>

            {/* Unlimited School Access Suggestion */}
            {showUnlimitedSuggestion && (
              <Card className="mb-8 p-6 bg-orange-50 border-orange-200">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-orange-800">Consider Unlimited School Access</h3>
                    <p className="text-orange-700">
                      Your current quote is ${regularPricing.total.toLocaleString()}. The Unlimited School Access option might offer better value at ${unlimitedPricing.total.toLocaleString()}.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* OR Divider */}
            <div className="mb-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-teal-300"></div>
                </div>
                <div className="relative flex justify-center text-lg">
                  <span className="bg-gray-50 px-6 text-2xl font-bold text-teal-700">OR</span>
                </div>
              </div>
            </div>

            {/* Unlimited School Access */}
            <UnlimitedSchoolCard
              tier={unlimitedTier}
              isSelected={useUnlimited}
              onSelect={handleUnlimitedSelection}
              addOns={unlimitedAddOns}
              onAddOnsChange={setUnlimitedAddOns}
              pricing={unlimitedPricing}
              teacherCount={teacherCount}
              studentCount={studentCount}
            />

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
              <Card className="p-6 bg-white shadow-sm border-2 border-teal-200">
                <h3 className="text-xl font-bold mb-4 text-teal-900">Running Total</h3>
                
                {useUnlimited ? (
                  <div className="space-y-3">
                    <div className="text-3xl font-bold text-teal-900">${unlimitedPricing.total.toLocaleString()}</div>
                    <div className="text-teal-600 text-sm">Unlimited School Access (inc. GST)</div>
                    <div className="text-xs text-teal-500">Includes 12 month access</div>
                  </div>
                ) : hasValidSelection ? (
                  <div className="space-y-3">
                    <div className="text-3xl font-bold text-teal-900">${regularPricing.total.toLocaleString()}</div>
                    <div className="text-teal-600 text-sm">
                      {selectedTeacherData ? `${teacherCount} Teacher${teacherCount > 1 ? 's' : ''}` : ''}
                      {selectedTeacherData && selectedStudentData ? ' + ' : ''}
                      {selectedStudentData ? `${studentCount} Student${studentCount > 1 ? 's' : ''}` : ''}
                      {' (inc. GST)'}
                    </div>
                    <div className="text-xs text-teal-500">Includes 12 month access</div>
                    
                    {studentCount >= 12 && selectedStudentData && (
                      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100 w-full justify-center">
                        🎉 Volume discount active!
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-teal-500 text-sm mb-2">Select options to see pricing</div>
                    <div className="text-2xl text-teal-400">$0</div>
                  </div>
                )}

                {/* Digital Pass Benefits */}
                {((selectedTeacherData && selectedTeacherData.id.includes('digital')) || 
                  (selectedStudentData && selectedStudentData.id.includes('digital')) || 
                  useUnlimited) && (
                  <div className="mt-4 p-3 bg-teal-50 rounded-lg">
                    <div className="text-teal-800 font-medium text-sm text-center">
                      ✨ Includes free intro lesson + pre & post-program testing
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* Program Start Date */}
        {((hasValidSelection && !useUnlimited) || useUnlimited) && (
          <ProgramStartDate
            startDate={programStartDate}
            onStartDateChange={setProgramStartDate}
            endDate={programEndDate}
          />
        )}

        {/* Detailed Quote Breakdown */}
        {((hasValidSelection && !useUnlimited) || useUnlimited) && (
          <>
            {!useUnlimited && selectedTeacherData && selectedStudentData && (
              <InclusionsDisplay
                teacherTier={selectedTeacherData}
                studentTier={selectedStudentData}
                pricing={regularPricing}
                teacherCount={teacherCount}
                studentCount={studentCount}
                studentPrice={calculateStudentPrice(selectedStudentData)}
              />
            )}

            {/* Action Buttons */}
            <ActionButtons
              selectedTier={useUnlimited ? unlimitedTier : { 
                name: `${selectedTeacherData?.name || ''}${selectedTeacherData && selectedStudentData ? ' + ' : ''}${selectedStudentData?.name || ''}`,
                id: 'combined'
              }}
              totalPrice={useUnlimited ? unlimitedPricing.total : regularPricing.total}
              teacherCount={teacherCount}
              studentCount={studentCount}
            />
          </>
        )}

        {/* Lesson Explorer */}
        <LessonExplorer />
      </div>
    </div>
  );
};
