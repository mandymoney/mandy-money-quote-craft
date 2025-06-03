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
import { Input } from '@/components/ui/input';
import { X, AlertTriangle, ArrowDown, Check, TrendingUp } from 'lucide-react';
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
    notIncluded: ['Click & Play Digital Lessons', 'Digital Textbook', 'Classroom Lesson Quizzes'],
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
    '42 x Click & Play Powerpoint Lessons',
    '168 x Theory Videos',
    '168 x Printable Worksheets',
    'Classroom Lesson Quizzes',
    'Lesson Plans',
    'Curriculum Alignment Guides',
    'Digital Textbooks',
    'Unlimited Classroom Spaces',
    'Personal Student Accounts',
    '168 x Gamified Activities',
    'Lesson Certificates',
    'Micro-Credential Pre & Post Testing',
    'School-wide License',
    'Priority Support',
    'Admin Dashboard',
    'Advanced Analytics'
  ],
  bestFor: 'Perfect for schools prioritising financial empowerment as a core student outcome'
};

export const QuoteBuilder = () => {
  const [selectedTeacherTier, setSelectedTeacherTier] = useState<string>('');
  const [selectedStudentTier, setSelectedStudentTier] = useState<string>('');
  const [teacherCount, setTeacherCount] = useState<number>(1);
  const [studentCount, setStudentCount] = useState<number>(25);
  const [useUnlimited, setUseUnlimited] = useState<boolean>(false);
  const [unlimitedAddOns, setUnlimitedAddOns] = useState({
    teacherBooks: 0,
    studentBooks: 0,
    posterA0: 0
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
      (unlimitedAddOns.studentBooks * unlimitedTier.addOns.studentBooks) +
      (unlimitedAddOns.posterA0 * unlimitedTier.addOns.posterA0);
    
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
  const hasVolumeDiscount = studentCount >= 12 && selectedStudentData;
  const volumeSavings = selectedStudentData && hasVolumeDiscount ? 
    (selectedStudentData.basePrice.student - calculateStudentPrice(selectedStudentData)) * studentCount : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with stars and improved title gradient */}
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
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#005653' }}>
                  Step 1: Select your Teacher Program Elements
                </h2>
                <p style={{ color: '#45c0a9' }}>Choose the teaching resources that work best for your classroom</p>
              </div>
              
              <div className="mb-6 flex justify-center">
                <div className="w-full max-w-md">
                  <VolumeSelector
                    label="Number of Teachers"
                    value={teacherCount}
                    onChange={setTeacherCount}
                    min={1}
                    max={20}
                    color="teal"
                  />
                </div>
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
                    colorScheme="teal"
                    customGradient="linear-gradient(135deg, #005653, #45c0a9, #80dec4)"
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

            {/* Step 2: Student Section */}
            <Card className="mb-8 p-6 bg-white shadow-sm border-2" style={{ borderImage: 'linear-gradient(135deg, #ffb512, #ffde5a, #fea100) 1' }}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#fea100' }}>
                  Step 2: Select your Student Program Elements
                </h2>
                <p style={{ color: '#ffb512' }}>Choose the learning materials that engage your students</p>
              </div>
              
              <div className="mb-6 flex justify-center">
                <div className="w-full max-w-md">
                  <VolumeSelector
                    label="Number of Students"
                    value={studentCount}
                    onChange={setStudentCount}
                    min={1}
                    max={200}
                    color="yellow"
                  />
                </div>
              </div>

              {nextDiscount && (
                <div className="mb-6 text-center">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-lg px-4 py-2">
                    🎯 Add {nextDiscount.studentsToGo} more student{nextDiscount.studentsToGo > 1 ? 's' : ''} to unlock volume discounts at {nextDiscount.threshold}+ students!
                  </Badge>
                </div>
              )}

              <div className="grid lg:grid-cols-3 gap-6 mb-4">
                {studentTiers.map((tier, index) => {
                  const currentPrice = calculateStudentPrice(tier);
                  const originalPrice = tier.basePrice.student;
                  const savings = originalPrice - currentPrice;
                  
                  return (
                    <div key={tier.id} className="relative">
                      <PricingCard
                        tier={tier}
                        price={currentPrice}
                        isSelected={selectedStudentTier === tier.id}
                        onSelect={() => handleStudentSelection(tier.id)}
                        teacherCount={0}
                        studentCount={studentCount}
                        animationDelay={index * 100}
                        showImages={true}
                        studentPrice={currentPrice}
                        includeGST={true}
                        colorScheme="yellow"
                        customGradient="linear-gradient(135deg, #ffb512, #ffde5a, #fea100)"
                        showSavings={savings > 0 && hasVolumeDiscount}
                        savings={savings}
                      />
                    </div>
                  );
                })}
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
              <Card className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">🎓</div>
                  <div>
                    <h3 className="font-bold text-blue-800 text-lg">Consider Our Unlimited School Access Option!</h3>
                    <p className="text-blue-700">
                      Your current quote is ${regularPricing.total.toLocaleString()}. Our Unlimited School Access option at ${unlimitedPricing.total.toLocaleString()} might offer exceptional value for your entire school community.
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
                pricing={unlimitedPricing}
                teacherCount={teacherCount}
                studentCount={studentCount}
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
                
                {useUnlimited ? (
                  <div className="space-y-3">
                    <div className="text-3xl font-bold text-gray-800">${unlimitedPricing.total.toLocaleString()}</div>
                    <div className="text-gray-600 text-sm">Unlimited School Access (inc. GST)</div>
                    <div className="text-xs text-gray-500">Includes 12 month access</div>
                    
                    <div className="mt-4 space-y-2">
                      <h4 className="font-semibold text-gray-700 text-sm">Key Inclusions:</h4>
                      <div className="text-xs text-gray-600">
                        <div className="flex items-center mb-1">
                          <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          <span>Unlimited Teacher Digital Passes</span>
                        </div>
                        <div className="flex items-center mb-1">
                          <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          <span>{unlimitedAddOns.teacherBooks || 0}x Teacher Print Textbooks</span>
                        </div>
                        <div className="flex items-center mb-1">
                          <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          <span>Unlimited Classroom Spaces</span>
                        </div>
                        <div className="flex items-center mb-1">
                          <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          <span>Unlimited Student Digital Passes</span>
                        </div>
                        <div className="flex items-center mb-1">
                          <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          <span>{unlimitedAddOns.studentBooks || 0}x Student Print Textbooks</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : hasValidSelection ? (
                  <div className="space-y-3">
                    <div className="text-3xl font-bold text-gray-800">${regularPricing.total.toLocaleString()}</div>
                    <div className="text-gray-600 text-sm">
                      {selectedTeacherData ? `${teacherCount} Teacher${teacherCount > 1 ? 's' : ''}` : ''}
                      {selectedTeacherData && selectedStudentData ? ' + ' : ''}
                      {selectedStudentData ? `${studentCount} Student${studentCount > 1 ? 's' : ''}` : ''}
                      {' (inc. GST)'}
                    </div>
                    {selectedStudentData && (
                      <div className="text-sm text-gray-600">
                        ${calculateStudentPrice(selectedStudentData)} per student
                      </div>
                    )}
                    <div className="text-xs text-gray-500">Includes 12 month access</div>
                    
                    {hasVolumeDiscount && volumeSavings > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="text-green-800 font-bold text-sm text-center">
                          🎉 Volume Discount Active!
                        </div>
                        <div className="text-green-700 text-xs text-center">
                          Saving ${volumeSavings.toLocaleString()} total (${((selectedStudentData?.basePrice.student || 0) - calculateStudentPrice(selectedStudentData!)).toFixed(0)} per student)
                        </div>
                      </div>
                    )}

                    <div className="mt-4 space-y-2">
                      <h4 className="font-semibold text-gray-700 text-sm">Key Inclusions:</h4>
                      <div className="text-xs text-gray-600">
                        {selectedTeacherData && (
                          <>
                            <div className="flex items-center mb-1">
                              <Check className="h-3 w-3 text-teal-500 mr-2 flex-shrink-0" />
                              <span>{teacherCount}x Teacher Digital Pass{selectedTeacherData.id.includes('digital') || selectedTeacherData.id.includes('both') ? 'es' : ''}</span>
                            </div>
                            {(selectedTeacherData.id.includes('physical') || selectedTeacherData.id.includes('both')) && (
                              <div className="flex items-center mb-1">
                                <Check className="h-3 w-3 text-teal-500 mr-2 flex-shrink-0" />
                                <span>{teacherCount}x Teacher Print Textbook{teacherCount > 1 ? 's' : ''}</span>
                              </div>
                            )}
                            <div className="flex items-center mb-1">
                              <Check className="h-3 w-3 text-teal-500 mr-2 flex-shrink-0" />
                              <span>{teacherCount}x Classroom Space{teacherCount > 1 ? 's' : ''}</span>
                            </div>
                          </>
                        )}
                        {selectedStudentData && (
                          <>
                            <div className="flex items-center mb-1">
                              <Check className="h-3 w-3 text-yellow-500 mr-2 flex-shrink-0" />
                              <span>{studentCount}x Student Digital Pass{selectedStudentData.id.includes('digital') || selectedStudentData.id.includes('both') ? 'es' : ''}</span>
                            </div>
                            {(selectedStudentData.id.includes('physical') || selectedStudentData.id.includes('both')) && (
                              <div className="flex items-center mb-1">
                                <Check className="h-3 w-3 text-yellow-500 mr-2 flex-shrink-0" />
                                <span>{studentCount}x Student Print Textbook{studentCount > 1 ? 's' : ''}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-gray-500 text-sm mb-2">Select options to see pricing</div>
                    <div className="text-2xl text-gray-400">$0</div>
                  </div>
                )}

                {/* Digital Pass Benefits */}
                {((selectedTeacherData && selectedTeacherData.id.includes('digital')) || 
                  (selectedStudentData && selectedStudentData.id.includes('digital')) || 
                  useUnlimited) && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-blue-800 font-medium text-sm text-center">
                      ✨ Includes free intro lesson + pre & post-program testing
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* Official Quote Section */}
        {((hasValidSelection && !useUnlimited) || useUnlimited) && (
          <div className="mt-12 border-t-4 border-green-600 pt-8 bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-8 mb-4">
                <div className="text-4xl bg-gradient-to-r from-[#fe5510] via-[#fea700] to-[#fe8303] bg-clip-text text-transparent">⭐</div>
                <h2 className="text-3xl font-bold text-green-800">📋 Your Official Program Quote</h2>
                <div className="text-4xl bg-gradient-to-r from-[#fe5510] via-[#fea700] to-[#fe8303] bg-clip-text text-transparent">⭐</div>
              </div>
              <p className="text-lg text-green-700">
                Complete summary of your selections • Download PDF or Place Order
              </p>
              <div className="flex items-center justify-center mt-2">
                <ArrowDown className="h-5 w-5 text-green-600 mr-2 animate-bounce" />
                <span className="text-sm text-green-600 font-semibold">Investment breakdown with lesson details</span>
              </div>
            </div>

            <InclusionsDisplay
              teacherTier={selectedTeacherData}
              studentTier={selectedStudentData}
              pricing={useUnlimited ? unlimitedPricing : regularPricing}
              teacherCount={teacherCount}
              studentCount={studentCount}
              studentPrice={selectedStudentData ? calculateStudentPrice(selectedStudentData) : 0}
              isUnlimited={useUnlimited}
              unlimitedTier={useUnlimited ? unlimitedTier : undefined}
              unlimitedAddOns={unlimitedAddOns}
              programStartDate={programStartDate}
              onStartDateChange={setProgramStartDate}
              programEndDate={addMonths(programStartDate, 12)}
              volumeSavings={volumeSavings}
            />

            {/* Action Buttons with orange gradient */}
            <div className="mt-6">
              <ActionButtons
                selectedTier={useUnlimited ? unlimitedTier : { 
                  name: `${selectedTeacherData?.name || ''}${selectedTeacherData && selectedStudentData ? ' + ' : ''}${selectedStudentData?.name || ''}`,
                  id: 'combined'
                }}
                totalPrice={useUnlimited ? unlimitedPricing.total : regularPricing.total}
                teacherCount={teacherCount}
                studentCount={studentCount}
              />
            </div>
          </div>
        )}

        {/* Divider */}
        {((hasValidSelection && !useUnlimited) || useUnlimited) && (
          <div className="my-12">
            <div className="border-t-2 border-gray-300"></div>
          </div>
        )}

        {/* Extra Materials Section Signpost */}
        {((hasValidSelection && !useUnlimited) || useUnlimited) && (
          <div className="mt-8 text-center">
            <div className="p-6 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">📚 Explore Program Materials</h3>
              <p className="text-lg text-gray-600 mb-4">Browse all 42 lessons, watch preview videos, and explore textbook samples below</p>
              <ArrowDown className="h-6 w-6 text-gray-600 mx-auto animate-bounce" />
            </div>
          </div>
        )}

        {/* Lesson Explorer */}
        <LessonExplorer />
      </div>
    </div>
  );
};
