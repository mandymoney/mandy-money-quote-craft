
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Check, Book } from 'lucide-react';
import { format } from 'date-fns';
import { PricingTier, UnlimitedTier } from './QuoteBuilder';
import { ProgramStartDate } from './ProgramStartDate';

interface InclusionsDisplayProps {
  teacherTier?: PricingTier;
  studentTier?: PricingTier;
  pricing: {
    subtotal: number;
    gst: number;
    total: number;
  };
  teacherCount: number;
  studentCount: number;
  studentPrice: number;
  isUnlimited?: boolean;
  unlimitedTier?: UnlimitedTier;
  unlimitedAddOns?: {
    teacherBooks: number;
    studentBooks: number;
    posterA0: number;
  };
  programStartDate: Date;
  onStartDateChange: (date: Date) => void;
  programEndDate: Date;
  volumeSavings?: number;
}

const lessonsByMicroCredential = {
  'Level 1 - Foundations': [
    { lesson: 1, title: 'Introduction to Financial Literacy', topic: 'Setting the Scene' },
    { lesson: 2, title: 'Basic Budgeting', topic: 'Budgeting Level 1' },
    { lesson: 3, title: 'Expenses Deep Dive', topic: 'Spending' },
    { lesson: 4, title: 'Smart Spending', topic: 'Spending' },
    { lesson: 5, title: 'Introduction to Super', topic: 'Super' },
    { lesson: 6, title: 'Super Fund Basics', topic: 'Super' },
    { lesson: 7, title: 'Choosing Your Super Fund', topic: 'Super' },
    { lesson: 8, title: 'Intro to Tax', topic: 'Tax' },
    { lesson: 9, title: 'Income Tax Basics', topic: 'Tax' },
    { lesson: 10, title: 'Tax Returns', topic: 'Tax' }
  ],
  'Level 2 - Building Skills': [
    { lesson: 11, title: 'Intermediate Budgeting', topic: 'Budgeting Level 2' },
    { lesson: 12, title: 'Planning Your Future', topic: 'Saving' },
    { lesson: 13, title: 'Setting Savings Goals', topic: 'Saving' },
    { lesson: 14, title: 'Career & Education Choices', topic: 'Employment' },
    { lesson: 15, title: 'Prepping For Job Applications', topic: 'Employment' },
    { lesson: 16, title: 'Interview Skills', topic: 'Employment' },
    { lesson: 17, title: 'Starting Your Job', topic: 'Employment' },
    { lesson: 18, title: 'Buying & Owning a Car', topic: 'Real World' },
    { lesson: 19, title: 'Tech & Phone Plans', topic: 'Real World' },
    { lesson: 20, title: 'Travel Money', topic: 'Real World' },
    { lesson: 21, title: 'Moving Out', topic: 'Real World' }
  ],
  'Level 3 - Advanced Topics': [
    { lesson: 22, title: 'Advanced Budgeting', topic: 'Budgeting Level 3' },
    { lesson: 23, title: 'Introduction To Interest', topic: 'Systems' },
    { lesson: 24, title: 'Compound Interest', topic: 'Systems' },
    { lesson: 25, title: 'Financial Products', topic: 'Systems' },
    { lesson: 26, title: 'Banking & Products', topic: 'Systems' },
    { lesson: 27, title: 'Money In An Equal Society', topic: 'Systems' },
    { lesson: 28, title: 'Peaceful Money Mind', topic: 'Safety' },
    { lesson: 29, title: 'Insurance & Health Care', topic: 'Safety' },
    { lesson: 30, title: 'Staying Safe', topic: 'Safety' },
    { lesson: 31, title: 'Getting Organised & Supported', topic: 'Safety' }
  ],
  'Level 4 - Mastery': [
    { lesson: 32, title: 'Building Wealth', topic: 'Wealth' },
    { lesson: 33, title: 'Generating Income', topic: 'Wealth' },
    { lesson: 34, title: 'Intro to Debt', topic: 'Debt' },
    { lesson: 35, title: 'Key Debt Products', topic: 'Debt' },
    { lesson: 36, title: 'Being a Smart Borrower', topic: 'Debt' },
    { lesson: 37, title: 'Investing Basics', topic: 'Investing' },
    { lesson: 38, title: 'Investing Performance', topic: 'Investing' },
    { lesson: 39, title: 'Risk, Return & Diversity', topic: 'Investing' },
    { lesson: 40, title: 'Intro to Shares', topic: 'Investing' },
    { lesson: 41, title: 'Choosing & Buying Shares', topic: 'Investing' },
    { lesson: 42, title: 'Property Investment', topic: 'Investing' }
  ]
};

export const InclusionsDisplay: React.FC<InclusionsDisplayProps> = ({
  teacherTier,
  studentTier,
  pricing,
  teacherCount,
  studentCount,
  studentPrice,
  isUnlimited,
  unlimitedTier,
  unlimitedAddOns,
  programStartDate,
  onStartDateChange,
  programEndDate,
  volumeSavings = 0
}) => {
  const [openLevels, setOpenLevels] = useState<string[]>([]);

  const toggleLevel = (level: string) => {
    setOpenLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const formatDate = (date: Date) => format(date, 'MMMM d, yyyy');

  return (
    <Card className="mb-8 p-8 bg-white shadow-lg border-2 border-green-200">
      {/* Investment Breakdown Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-green-800 mb-2">📊 Investment Breakdown</h3>
        <p className="text-green-600">Complete breakdown of your financial literacy program investment</p>
      </div>

      {/* Program Details and Start Date - Horizontal Layout */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-green-800">Program Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">12 months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Start:</span>
              <span className="font-medium">{formatDate(programStartDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">End:</span>
              <span className="font-medium">{formatDate(programEndDate)}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-green-800 mb-4">Program Start Date</h4>
          <ProgramStartDate
            startDate={programStartDate}
            onStartDateChange={onStartDateChange}
            endDate={programEndDate}
          />
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-green-800 mb-2">Total Investment</h4>
          <div className="text-3xl font-bold text-green-900">${pricing.total.toLocaleString()}</div>
          <div className="text-green-600 text-sm">Including GST</div>
          {volumeSavings > 0 && (
            <div className="text-green-700 font-medium text-sm mt-1">
              💰 Includes ${volumeSavings.toLocaleString()} volume savings!
            </div>
          )}
        </div>
      </div>

      {/* Your Selections - Horizontal Layout */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-green-800 mb-4">Your Selections</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {isUnlimited ? (
            <div className="md:col-span-2">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-green-800">{unlimitedTier?.name}</span>
                  <span className="text-green-700 font-bold">${unlimitedTier?.basePrice.toLocaleString()}</span>
                </div>
                <p className="text-green-600 text-sm">Unlimited access for all teachers and students</p>
                
                {unlimitedAddOns && (unlimitedAddOns.teacherBooks > 0 || unlimitedAddOns.studentBooks > 0 || unlimitedAddOns.posterA0 > 0) && (
                  <div className="mt-3 space-y-2">
                    <h5 className="font-medium text-gray-700">Add-ons:</h5>
                    {unlimitedAddOns.teacherBooks > 0 && (
                      <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                        <span>Teacher Books × {unlimitedAddOns.teacherBooks}</span>
                        <span className="font-medium">${(unlimitedAddOns.teacherBooks * (unlimitedTier?.addOns.teacherBooks || 0)).toLocaleString()}</span>
                      </div>
                    )}
                    {unlimitedAddOns.studentBooks > 0 && (
                      <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                        <span>Student Books × {unlimitedAddOns.studentBooks}</span>
                        <span className="font-medium">${(unlimitedAddOns.studentBooks * (unlimitedTier?.addOns.studentBooks || 0)).toLocaleString()}</span>
                      </div>
                    )}
                    {unlimitedAddOns.posterA0 > 0 && (
                      <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                        <span>A0 Poster × {unlimitedAddOns.posterA0}</span>
                        <span className="font-medium">${(unlimitedAddOns.posterA0 * (unlimitedTier?.addOns.posterA0 || 0)).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {teacherTier && (
                <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, #005653, #45c0a9, #80dec4)', color: 'white' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{teacherTier.name} × {teacherCount}</span>
                    <span className="font-bold">${(teacherTier.basePrice.teacher * teacherCount).toLocaleString()}</span>
                  </div>
                  <div className="text-sm opacity-90">
                    ${teacherTier.basePrice.teacher}/teacher
                  </div>
                  <div className="mt-2 space-y-1">
                    <h5 className="font-medium text-sm opacity-90">All Inclusions:</h5>
                    {[...teacherTier.inclusions.teacher, ...teacherTier.inclusions.classroom].map((inclusion, index) => (
                      <div key={index} className="flex items-center text-xs opacity-80">
                        <Check className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span>{inclusion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {studentTier && (
                <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, #ffb512, #ffde5a, #fea100)', color: 'white' }}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium">{studentTier.name} × {studentCount}</span>
                      <div className="text-sm opacity-90">${studentPrice}/student</div>
                      {volumeSavings > 0 && (
                        <div className="text-sm font-bold text-green-200">
                          💰 Volume Savings: ${volumeSavings.toLocaleString()} total (${((studentTier.basePrice.student - studentPrice) || 0).toFixed(0)} per student)
                        </div>
                      )}
                    </div>
                    <span className="font-bold">${(studentPrice * studentCount).toLocaleString()}</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <h5 className="font-medium text-sm opacity-90">All Inclusions:</h5>
                    {studentTier.inclusions.student.map((inclusion, index) => (
                      <div key={index} className="flex items-center text-xs opacity-80">
                        <Check className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span>{inclusion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Program Content with Dropdowns */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-green-800 mb-4">📚 All 42 Financial Literacy Lessons Included</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(lessonsByMicroCredential).map(([level, lessons]) => (
            <div key={level} className="border border-gray-200 rounded-lg">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto text-left hover:bg-gray-50"
                    onClick={() => toggleLevel(level)}
                  >
                    <div>
                      <h4 className="font-semibold text-gray-800">{level}</h4>
                      <p className="text-sm text-gray-600">Lessons {lessons[0].lesson}-{lessons[lessons.length - 1].lesson}</p>
                    </div>
                    {openLevels.includes(level) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {lessons.map((lesson) => (
                      <div key={lesson.lesson} className="flex items-center p-2 bg-gray-50 rounded text-sm">
                        <Book className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium mr-2">Lesson {lesson.lesson}:</span>
                        <span>{lesson.title}</span>
                        <span className="ml-auto text-xs text-gray-500">({lesson.topic})</span>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
