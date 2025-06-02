
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Check, Book, Calendar } from 'lucide-react';
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
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg border border-gray-300 overflow-hidden">
      {/* Header - Dark background like in the image */}
      <div className="bg-gray-800 text-white px-8 py-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Official Program Quote</h2>
          <p className="text-gray-300 text-lg mt-1">
            {isUnlimited ? unlimitedTier?.name : `${teacherTier?.name || ''}${teacherTier && studentTier ? ' + ' : ''}${studentTier?.name || ''}`}
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold">${pricing.total.toLocaleString()}</div>
          <div className="text-gray-300">Total Price (inc. GST)</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Investment Breakdown */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Investment Breakdown</h3>
            
            <div className="space-y-4 mb-8">
              {isUnlimited ? (
                <div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700">Unlimited School Access</span>
                    <span className="font-bold text-lg">${unlimitedTier?.basePrice.toLocaleString()}</span>
                  </div>
                  
                  {unlimitedAddOns && (unlimitedAddOns.teacherBooks > 0 || unlimitedAddOns.studentBooks > 0 || unlimitedAddOns.posterA0 > 0) && (
                    <div className="ml-4 space-y-2">
                      {unlimitedAddOns.teacherBooks > 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Teacher Books × {unlimitedAddOns.teacherBooks}</span>
                          <span>${(unlimitedAddOns.teacherBooks * (unlimitedTier?.addOns.teacherBooks || 0)).toLocaleString()}</span>
                        </div>
                      )}
                      {unlimitedAddOns.studentBooks > 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Student Books × {unlimitedAddOns.studentBooks}</span>
                          <span>${(unlimitedAddOns.studentBooks * (unlimitedTier?.addOns.studentBooks || 0)).toLocaleString()}</span>
                        </div>
                      )}
                      {unlimitedAddOns.posterA0 > 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>A0 Poster × {unlimitedAddOns.posterA0}</span>
                          <span>${(unlimitedAddOns.posterA0 * (unlimitedTier?.addOns.posterA0 || 0)).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {teacherTier && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-700">{teacherCount} Teacher{teacherCount > 1 ? 's' : ''} × ${teacherTier.basePrice.teacher}</span>
                      <span className="font-bold text-lg">${(teacherTier.basePrice.teacher * teacherCount).toLocaleString()}</span>
                    </div>
                  )}
                  
                  {studentTier && (
                    <div className="py-3 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">{studentCount} Student{studentCount > 1 ? 's' : ''} × ${studentPrice}</span>
                        <span className="font-bold text-lg">${(studentPrice * studentCount).toLocaleString()}</span>
                      </div>
                      {volumeSavings > 0 && (
                        <div className="text-sm text-green-600 mt-1">
                          Volume savings: ${volumeSavings.toLocaleString()} (${((studentTier.basePrice.student - studentPrice) || 0).toFixed(0)} per student)
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-8">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Investment</span>
                <span>${pricing.total.toLocaleString()}</span>
              </div>
              <div className="text-sm text-gray-600 text-right mt-1">
                (Price includes 10% GST)
              </div>
            </div>

            {/* Program Timeline */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Program Timeline</h4>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-gray-700">{formatDate(programStartDate)}</span>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-blue-800 mb-2">12 Month Access Period</h5>
                  <div className="text-sm text-blue-700">
                    <div>Starts: {formatDate(programStartDate)}</div>
                    <div>Ends: {formatDate(programEndDate)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Inclusions */}
          <div>
            <div className="flex items-center mb-6">
              <div className="w-4 h-4 bg-teal-500 rounded-full mr-3"></div>
              <h3 className="text-xl font-semibold text-gray-800">
                {isUnlimited ? 'Unlimited Access Inclusions' : 
                 teacherTier ? 'Teacher Inclusions' : 'Student Inclusions'}
              </h3>
            </div>
            
            <div className="space-y-3">
              {isUnlimited ? (
                unlimitedTier?.inclusions.map((inclusion, index) => (
                  <div key={index} className="flex items-center p-3 bg-teal-50 rounded-lg">
                    <Check className="h-5 w-5 text-teal-600 mr-3 flex-shrink-0" />
                    <span className="text-teal-800">{inclusion}</span>
                  </div>
                ))
              ) : (
                <>
                  {teacherTier && (
                    <>
                      {[...teacherTier.inclusions.teacher, ...teacherTier.inclusions.classroom].map((inclusion, index) => (
                        <div key={index} className="flex items-center p-3 bg-teal-50 rounded-lg">
                          <Check className="h-5 w-5 text-teal-600 mr-3 flex-shrink-0" />
                          <span className="text-teal-800">{inclusion}</span>
                        </div>
                      ))}
                    </>
                  )}
                  
                  {studentTier && (
                    <>
                      {teacherTier && (
                        <div className="flex items-center mt-6 mb-4">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                          <h4 className="text-lg font-semibold text-gray-800">Student Inclusions</h4>
                        </div>
                      )}
                      {studentTier.inclusions.student.map((inclusion, index) => (
                        <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-lg">
                          <Check className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0" />
                          <span className="text-yellow-800">{inclusion}</span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Program Content with Dropdowns */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-green-800 mb-6">📚 All 42 Financial Literacy Lessons Included</h3>
          
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
      </div>
    </div>
  );
};
