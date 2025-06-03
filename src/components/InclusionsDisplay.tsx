
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Check, Book, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { PricingTier, UnlimitedTier } from './QuoteBuilder';
import { cn } from '@/lib/utils';

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
      {/* Header - Dark background */}
      <div className="bg-gray-800 text-white px-8 py-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Official Program Quote</h2>
          <p className="text-gray-300 text-lg mt-1">
            {isUnlimited ? unlimitedTier?.name : `${teacherTier?.name || ''}${teacherTier && studentTier ? ' + ' : ''}${studentTier?.name || ''}`}
          </p>
          {studentTier && !isUnlimited && (
            <p className="text-gray-400 text-sm mt-1">
              ${studentPrice} per student
            </p>
          )}
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
                  <div className="text-sm text-gray-500 ml-4 mb-2">
                    Includes: Unlimited Teacher Digital Passes, Unlimited Student Digital Passes, Unlimited Classroom Spaces
                  </div>
                  
                  {unlimitedAddOns && (unlimitedAddOns.teacherBooks > 0 || unlimitedAddOns.studentBooks > 0 || unlimitedAddOns.posterA0 > 0) && (
                    <div className="ml-4 space-y-2">
                      {unlimitedAddOns.teacherBooks > 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Print Teacher Textbooks × {unlimitedAddOns.teacherBooks}</span>
                          <span>${(unlimitedAddOns.teacherBooks * (unlimitedTier?.addOns.teacherBooks || 0)).toLocaleString()}</span>
                        </div>
                      )}
                      {unlimitedAddOns.studentBooks > 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Print Student Textbooks × {unlimitedAddOns.studentBooks}</span>
                          <span>${(unlimitedAddOns.studentBooks * (unlimitedTier?.addOns.studentBooks || 0)).toLocaleString()}</span>
                        </div>
                      )}
                      {unlimitedAddOns.posterA0 > 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>A0 Posters × {unlimitedAddOns.posterA0}</span>
                          <span>${(unlimitedAddOns.posterA0 * (unlimitedTier?.addOns.posterA0 || 0)).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {teacherTier && (
                    <div className="py-3 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">{teacherCount} Teacher{teacherCount > 1 ? 's' : ''} × ${teacherTier.basePrice.teacher}</span>
                        <span className="font-bold text-lg">${(teacherTier.basePrice.teacher * teacherCount).toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {teacherTier.name}
                        {teacherTier.id.includes('digital') && ' - Includes Teacher Digital Passes'}
                        {teacherTier.id.includes('physical') && ' - Includes Print Teacher Textbooks'}
                        {teacherTier.id.includes('both') && ' - Includes Teacher Digital Passes + Print Teacher Textbooks'}
                        , Classroom Spaces
                      </div>
                    </div>
                  )}
                  
                  {studentTier && (
                    <div className="py-3 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">{studentCount} Student{studentCount > 1 ? 's' : ''} × ${studentPrice}</span>
                        <span className="font-bold text-lg">${(studentPrice * studentCount).toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {studentTier.name}
                        {studentTier.id.includes('digital') && ' - Includes Student Digital Passes'}
                        {studentTier.id.includes('physical') && ' - Includes Print Student Textbooks'}
                        {studentTier.id.includes('both') && ' - Includes Student Digital Passes + Print Student Textbooks'}
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
              
              {/* GST Breakdown */}
              <div className="py-2 border-b border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal (exc. GST)</span>
                  <span>${pricing.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>GST (10%)</span>
                  <span>${pricing.gst.toFixed(2)}</span>
                </div>
              </div>
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

            {/* Program Timeline with integrated date selector */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
              <h4 className="text-lg font-semibold text-blue-800 mb-4">Program Timeline</h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-blue-800 mb-3">Select Program Start Date</h5>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !programStartDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {programStartDate ? format(programStartDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={programStartDate}
                        onSelect={(date) => date && onStartDateChange(date)}
                        initialFocus
                        className="p-3"
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <div className="text-sm text-blue-700 mt-3">
                    <div><strong>Program starts:</strong> {formatDate(programStartDate)}</div>
                    <div><strong>Access ends:</strong> {formatDate(programEndDate)}</div>
                    <div className="text-xs mt-1 text-blue-600">12 months of full access included</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500 italic">
              Quote valid until end of current calendar year
            </div>
          </div>

          {/* Right Column - Simplified Inclusions */}
          <div>
            <div className="flex items-center mb-6">
              <div className="w-4 h-4 bg-teal-500 rounded-full mr-3"></div>
              <h3 className="text-xl font-semibold text-gray-800">
                {isUnlimited ? 'Unlimited Access Inclusions' : 'Program Inclusions'}
              </h3>
            </div>
            
            <div className="space-y-3">
              {isUnlimited ? (
                <>
                  <div className="flex items-center p-3 bg-teal-50 rounded-lg">
                    <Check className="h-5 w-5 text-teal-600 mr-3 flex-shrink-0" />
                    <span className="text-teal-800">Unlimited Teacher Digital Passes</span>
                  </div>
                  <div className="flex items-center p-3 bg-teal-50 rounded-lg">
                    <Check className="h-5 w-5 text-teal-600 mr-3 flex-shrink-0" />
                    <span className="text-teal-800">{unlimitedAddOns?.teacherBooks || 0}x Print Teacher Textbooks</span>
                  </div>
                  <div className="flex items-center p-3 bg-teal-50 rounded-lg">
                    <Check className="h-5 w-5 text-teal-600 mr-3 flex-shrink-0" />
                    <span className="text-teal-800">Unlimited Classroom Spaces</span>
                  </div>
                  <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                    <Check className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0" />
                    <span className="text-yellow-800">Unlimited Student Digital Passes</span>
                  </div>
                  <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                    <Check className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0" />
                    <span className="text-yellow-800">{unlimitedAddOns?.studentBooks || 0}x Print Student Textbooks</span>
                  </div>
                  {(unlimitedAddOns?.posterA0 || 0) > 0 && (
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <Check className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                      <span className="text-blue-800">{unlimitedAddOns?.posterA0}x A0 Posters</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {teacherTier && (
                    <>
                      <div className="flex items-center p-3 bg-teal-50 rounded-lg">
                        <Check className="h-5 w-5 text-teal-600 mr-3 flex-shrink-0" />
                        <span className="text-teal-800">{teacherCount}x Teacher Digital Pass{(teacherTier.id.includes('digital') || teacherTier.id.includes('both')) ? 'es' : ''}</span>
                      </div>
                      {(teacherTier.id.includes('physical') || teacherTier.id.includes('both')) && (
                        <div className="flex items-center p-3 bg-teal-50 rounded-lg">
                          <Check className="h-5 w-5 text-teal-600 mr-3 flex-shrink-0" />
                          <span className="text-teal-800">{teacherCount}x Print Teacher Textbook{teacherCount > 1 ? 's' : ''}</span>
                        </div>
                      )}
                      <div className="flex items-center p-3 bg-teal-50 rounded-lg">
                        <Check className="h-5 w-5 text-teal-600 mr-3 flex-shrink-0" />
                        <span className="text-teal-800">{teacherCount}x Classroom Space{teacherCount > 1 ? 's' : ''}</span>
                      </div>
                    </>
                  )}
                  
                  {studentTier && (
                    <>
                      <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                        <Check className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0" />
                        <span className="text-yellow-800">{studentCount}x Student Digital Pass{(studentTier.id.includes('digital') || studentTier.id.includes('both')) ? 'es' : ''}</span>
                      </div>
                      {(studentTier.id.includes('physical') || studentTier.id.includes('both')) && (
                        <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                          <Check className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0" />
                          <span className="text-yellow-800">{studentCount}x Print Student Textbook{studentCount > 1 ? 's' : ''}</span>
                        </div>
                      )}
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
