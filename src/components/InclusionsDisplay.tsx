
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Check, ChevronDown, ChevronUp, Book, DollarSign } from 'lucide-react';
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
  studentSavings?: number;
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
}

const lessonsByMicroCredential = {
  'Level 1': [
    { lesson: 1, title: 'Introduction to Financial Literacy', topic: 'Setting the Scene', chapters: ['The Big Question... What Actually Is Money?', 'What Does It Mean To "Learn About Money"?', 'Why Is Learning About Money Important?'] },
    { lesson: 2, title: 'Basic Budgeting', topic: 'Budgeting Level 1', chapters: ['What Actually Is Budgeting?', 'Why Am I Budgeting At School?', 'How Do I Structure a Budget Plan?', 'What Is My Personal Financial Ecosystem?', 'What Budgeting Maths Do I Need?', 'How Do I Build A Weekly Budget?', 'How Do I Use My Weekly Budget In My Real Life?'] },
    { lesson: 3, title: 'Expenses Deep Dive', topic: 'Spending', chapters: ['What Are Expenses?', 'Why Do I Need to Track My Expenses?', 'How Do I Track My Expenses?', 'What Are My Expenses?', 'How Do I Track My Expenses?', 'What Are My Expenses?', 'How Do I Track My Expenses?'] },
    { lesson: 4, title: 'Smart Spending', topic: 'Spending', chapters: ['What Is Smart Spending?', 'Why Is Smart Spending Important?', 'How Do I Smart Spend?', 'What Is Smart Spending?', 'Why Is Smart Spending Important?', 'How Do I Smart Spend?', 'What Is Smart Spending?'] },
    { lesson: 5, title: 'Introduction to Super', topic: 'Super', chapters: ['What Is Super?', 'Why Do I Need Super?', 'How Do I Get Super?', 'What Is Super?', 'Why Do I Need Super?', 'How Do I Get Super?', 'What Is Super?'] },
    { lesson: 6, title: 'Super Fund Basics', topic: 'Super', chapters: ['What Is a Super Fund?', 'Why Do I Need a Super Fund?', 'How Do I Choose a Super Fund?', 'What Is a Super Fund?', 'Why Do I Need a Super Fund?', 'How Do I Choose a Super Fund?', 'What Is a Super Fund?'] },
    { lesson: 7, title: 'Choosing Your Super Fund', topic: 'Super', chapters: ['How Do I Choose the Right Super Fund?', 'What Are the Key Features of a Super Fund?', 'How Do I Choose the Right Super Fund?', 'What Are the Key Features of a Super Fund?', 'How Do I Choose the Right Super Fund?', 'What Are the Key Features of a Super Fund?', 'How Do I Choose the Right Super Fund?'] },
    { lesson: 8, title: 'Intro to Tax', topic: 'Tax', chapters: ['What Is Tax?', 'Why Do I Need to Pay Tax?', 'How Do I Pay Tax?', 'What Is Tax?', 'Why Do I Need to Pay Tax?', 'How Do I Pay Tax?', 'What Is Tax?'] },
    { lesson: 9, title: 'Income Tax Basics', topic: 'Tax', chapters: ['What Is Income Tax?', 'Why Do I Need to Pay Income Tax?', 'How Do I Pay Income Tax?', 'What Is Income Tax?', 'Why Do I Need to Pay Income Tax?', 'How Do I Pay Income Tax?', 'What Is Income Tax?'] },
    { lesson: 10, title: 'Tax Returns', topic: 'Tax', chapters: ['What Is a Tax Return?', 'Why Do I Need to File a Tax Return?', 'How Do I File a Tax Return?', 'What Is a Tax Return?', 'Why Do I Need to File a Tax Return?', 'How Do I File a Tax Return?', 'What Is a Tax Return?'] }
  ],
  'Level 2': [
    { lesson: 11, title: 'Intermediate Budgeting', topic: 'Budgeting Level 2', chapters: ['What Is Intermediate Budgeting?', 'Why Do I Need Intermediate Budgeting?', 'How Do I Do Intermediate Budgeting?', 'What Is Intermediate Budgeting?', 'Why Do I Need Intermediate Budgeting?', 'How Do I Do Intermediate Budgeting?', 'What Is Intermediate Budgeting?'] },
    { lesson: 12, title: 'Planning Your Future', topic: 'Saving', chapters: ['What Is Planning Your Future?', 'Why Do I Need to Plan My Future?', 'How Do I Plan My Future?', 'What Is Planning Your Future?', 'Why Do I Need to Plan My Future?', 'How Do I Plan My Future?', 'What Is Planning Your Future?'] },
    { lesson: 13, title: 'Setting Savings Goals', topic: 'Saving', chapters: ['What Are Savings Goals?', 'Why Do I Need Savings Goals?', 'How Do I Set Savings Goals?', 'What Are Savings Goals?', 'Why Do I Need Savings Goals?', 'How Do I Set Savings Goals?', 'What Are Savings Goals?'] },
    { lesson: 14, title: 'Career & Education Choices', topic: 'Employment', chapters: ['What Are Career & Education Choices?', 'Why Do I Need to Consider Career & Education Choices?', 'How Do I Consider Career & Education Choices?', 'What Are Career & Education Choices?', 'Why Do I Need to Consider Career & Education Choices?', 'How Do I Consider Career & Education Choices?', 'What Are Career & Education Choices?'] },
    { lesson: 15, title: 'Prepping For Job Applications', topic: 'Employment', chapters: ['What Is Prepping for Job Applications?', 'Why Do I Need to Prep for Job Applications?', 'How Do I Prep for Job Applications?', 'What Is Prepping for Job Applications?', 'Why Do I Need to Prep for Job Applications?', 'How Do I Prep for Job Applications?', 'What Is Prepping for Job Applications?'] },
    { lesson: 16, title: 'Interview Skills', topic: 'Employment', chapters: ['What Are Interview Skills?', 'Why Do I Need Interview Skills?', 'How Do I Develop Interview Skills?', 'What Are Interview Skills?', 'Why Do I Need Interview Skills?', 'How Do I Develop Interview Skills?', 'What Are Interview Skills?'] },
    { lesson: 17, title: 'Starting Your Job', topic: 'Employment', chapters: ['What Is Starting Your Job?', 'Why Do I Need to Start My Job?', 'How Do I Start My Job?', 'What Is Starting Your Job?', 'Why Do I Need to Start My Job?', 'How Do I Start My Job?', 'What Is Starting Your Job?'] },
    { lesson: 18, title: 'Buying & Owning a Car', topic: 'Real World', chapters: ['What Is Buying & Owning a Car?', 'Why Do I Need to Buy & Own a Car?', 'How Do I Buy & Own a Car?', 'What Is Buying & Owning a Car?', 'Why Do I Need to Buy & Own a Car?', 'How Do I Buy & Own a Car?', 'What Is Buying & Owning a Car?'] },
    { lesson: 19, title: 'Tech & Phone Plans', topic: 'Real World', chapters: ['What Are Tech & Phone Plans?', 'Why Do I Need Tech & Phone Plans?', 'How Do I Get Tech & Phone Plans?', 'What Are Tech & Phone Plans?', 'Why Do I Need Tech & Phone Plans?', 'How Do I Get Tech & Phone Plans?', 'What Are Tech & Phone Plans?'] },
    { lesson: 20, title: 'Travel Money', topic: 'Real World', chapters: ['What Is Travel Money?', 'Why Do I Need Travel Money?', 'How Do I Get Travel Money?', 'What Is Travel Money?', 'Why Do I Need Travel Money?', 'How Do I Get Travel Money?', 'What Is Travel Money?'] },
    { lesson: 21, title: 'Moving Out', topic: 'Real World', chapters: ['What Is Moving Out?', 'Why Do I Need to Move Out?', 'How Do I Move Out?', 'What Is Moving Out?', 'Why Do I Need to Move Out?', 'How Do I Move Out?', 'What Is Moving Out?'] }
  ],
  'Level 3': [
    { lesson: 22, title: 'Advanced Budgeting', topic: 'Budgeting Level 3', chapters: ['What Is Advanced Budgeting?', 'Why Do I Need Advanced Budgeting?', 'How Do I Do Advanced Budgeting?', 'What Is Advanced Budgeting?', 'Why Do I Need Advanced Budgeting?', 'How Do I Do Advanced Budgeting?', 'What Is Advanced Budgeting?'] },
    { lesson: 23, title: 'Introduction To Interest', topic: 'Systems', chapters: ['What Is Interest?', 'Why Do I Need to Understand Interest?', 'How Do I Understand Interest?', 'What Is Interest?', 'Why Do I Need to Understand Interest?', 'How Do I Understand Interest?', 'What Is Interest?'] },
    { lesson: 24, title: 'Compound Interest', topic: 'Systems', chapters: ['What Is Compound Interest?', 'Why Do I Need to Understand Compound Interest?', 'How Do I Understand Compound Interest?', 'What Is Compound Interest?', 'Why Do I Need to Understand Compound Interest?', 'How Do I Understand Compound Interest?', 'What Is Compound Interest?'] },
    { lesson: 25, title: 'Financial Products', topic: 'Systems', chapters: ['What Are Financial Products?', 'Why Do I Need Financial Products?', 'How Do I Choose Financial Products?', 'What Are Financial Products?', 'Why Do I Need Financial Products?', 'How Do I Choose Financial Products?', 'What Are Financial Products?'] },
    { lesson: 26, title: 'Banking & Products', topic: 'Systems', chapters: ['What Is Banking?', 'Why Do I Need Banking?', 'How Do I Use Banking?', 'What Is Banking?', 'Why Do I Need Banking?', 'How Do I Use Banking?', 'What Is Banking?'] },
    { lesson: 27, title: 'Money In An Equal Society', topic: 'Systems', chapters: ['What Is Money in an Equal Society?', 'Why Do I Need to Understand Money in an Equal Society?', 'How Do I Understand Money in an Equal Society?', 'What Is Money in an Equal Society?', 'Why Do I Need to Understand Money in an Equal Society?', 'How Do I Understand Money in an Equal Society?', 'What Is Money in an Equal Society?'] },
    { lesson: 28, title: 'Peaceful Money Mind', topic: 'Safety', chapters: ['What Is a Peaceful Money Mind?', 'Why Do I Need a Peaceful Money Mind?', 'How Do I Develop a Peaceful Money Mind?', 'What Is a Peaceful Money Mind?', 'Why Do I Need a Peaceful Money Mind?', 'How Do I Develop a Peaceful Money Mind?', 'What Is a Peaceful Money Mind?'] },
    { lesson: 29, title: 'Insurance & Health Care', topic: 'Safety', chapters: ['What Is Insurance?', 'Why Do I Need Insurance?', 'How Do I Get Insurance?', 'What Is Insurance?', 'Why Do I Need Insurance?', 'How Do I Get Insurance?', 'What Is Insurance?'] },
    { lesson: 30, title: 'Staying Safe', topic: 'Safety', chapters: ['What Is Staying Safe?', 'Why Do I Need to Stay Safe?', 'How Do I Stay Safe?', 'What Is Staying Safe?', 'Why Do I Need to Stay Safe?', 'How Do I Stay Safe?', 'What Is Staying Safe?'] },
    { lesson: 31, title: 'Getting Organised & Supported', topic: 'Safety', chapters: ['What Is Getting Organised & Supported?', 'Why Do I Need to Get Organised & Supported?', 'How Do I Get Organised & Supported?', 'What Is Getting Organised & Supported?', 'Why Do I Need to Get Organised & Supported?', 'How Do I Get Organised & Supported?', 'What Is Getting Organised & Supported?'] }
  ],
  'Level 4': [
    { lesson: 32, title: 'Building Wealth', topic: 'Wealth', chapters: ['What Is Building Wealth?', 'Why Do I Need to Build Wealth?', 'How Do I Build Wealth?', 'What Is Building Wealth?', 'Why Do I Need to Build Wealth?', 'How Do I Build Wealth?', 'What Is Building Wealth?'] },
    { lesson: 33, title: 'Generating Income', topic: 'Wealth', chapters: ['What Is Generating Income?', 'Why Do I Need to Generate Income?', 'How Do I Generate Income?', 'What Is Generating Income?', 'Why Do I Need to Generate Income?', 'How Do I Generate Income?', 'What Is Generating Income?'] },
    { lesson: 34, title: 'Intro to Debt', topic: 'Debt', chapters: ['What Is Debt?', 'Why Do I Need to Understand Debt?', 'How Do I Understand Debt?', 'What Is Debt?', 'Why Do I Need to Understand Debt?', 'How Do I Understand Debt?', 'What Is Debt?'] },
    { lesson: 35, title: 'Key Debt Products', topic: 'Debt', chapters: ['What Are Key Debt Products?', 'Why Do I Need to Understand Key Debt Products?', 'How Do I Understand Key Debt Products?', 'What Are Key Debt Products?', 'Why Do I Need to Understand Key Debt Products?', 'How Do I Understand Key Debt Products?', 'What Are Key Debt Products?'] },
    { lesson: 36, title: 'Being a Smart Borrower', topic: 'Debt', chapters: ['What Is Being a Smart Borrower?', 'Why Do I Need to Be a Smart Borrower?', 'How Do I Be a Smart Borrower?', 'What Is Being a Smart Borrower?', 'Why Do I Need to Be a Smart Borrower?', 'How Do I Be a Smart Borrower?', 'What Is Being a Smart Borrower?'] },
    { lesson: 37, title: 'Investing Basics', topic: 'Investing', chapters: ['What Is Investing?', 'Why Do I Need to Invest?', 'How Do I Invest?', 'What Is Investing?', 'Why Do I Need to Invest?', 'How Do I Invest?', 'What Is Investing?'] },
    { lesson: 38, title: 'Investing Performance', topic: 'Investing', chapters: ['What Is Investing Performance?', 'Why Do I Need to Understand Investing Performance?', 'How Do I Understand Investing Performance?', 'What Is Investing Performance?', 'Why Do I Need to Understand Investing Performance?', 'How Do I Understand Investing Performance?', 'What Is Investing Performance?'] },
    { lesson: 39, title: 'Risk, Return & Diversity', topic: 'Investing', chapters: ['What Is Risk, Return & Diversity?', 'Why Do I Need to Understand Risk, Return & Diversity?', 'How Do I Understand Risk, Return & Diversity?', 'What Is Risk, Return & Diversity?', 'Why Do I Need to Understand Risk, Return & Diversity?', 'How Do I Understand Risk, Return & Diversity?', 'What Is Risk, Return & Diversity?'] },
    { lesson: 40, title: 'Intro to Shares', topic: 'Investing', chapters: ['What Is an Introduction to Shares?', 'Why Do I Need to Understand an Introduction to Shares?', 'How Do I Understand an Introduction to Shares?', 'What Is an Introduction to Shares?', 'Why Do I Need to Understand an Introduction to Shares?', 'How Do I Understand an Introduction to Shares?', 'What Is an Introduction to Shares?'] },
    { lesson: 41, title: 'Choosing & Buying Shares', topic: 'Investing', chapters: ['What Is Choosing & Buying Shares?', 'Why Do I Need to Choose & Buy Shares?', 'How Do I Choose & Buy Shares?', 'What Is Choosing & Buying Shares?', 'Why Do I Need to Choose & Buy Shares?', 'How Do I Choose & Buy Shares?', 'What Is Choosing & Buying Shares?'] },
    { lesson: 42, title: 'Property Investment', topic: 'Investing', chapters: ['What Is Property Investment?', 'Why Do I Need to Invest in Property?', 'How Do I Invest in Property?', 'What Is Property Investment?', 'Why Do I Need to Invest in Property?', 'How Do I Invest in Property?', 'What Is Property Investment?'] }
  ]
};

export const InclusionsDisplay: React.FC<InclusionsDisplayProps> = ({
  teacherTier,
  studentTier,
  pricing,
  teacherCount,
  studentCount,
  studentPrice,
  studentSavings = 0,
  isUnlimited = false,
  unlimitedTier,
  unlimitedAddOns,
  programStartDate,
  onStartDateChange,
  programEndDate
}) => {
  const [showAllLessons, setShowAllLessons] = useState(false);
  const [expandedMicroCredential, setExpandedMicroCredential] = useState<string | null>(null);

  const getPriceBreakdown = () => {
    if (isUnlimited && unlimitedTier) {
      const breakdown = [
        { label: 'Unlimited School Access', amount: unlimitedTier.basePrice }
      ];
      if (unlimitedAddOns?.teacherBooks) {
        breakdown.push({
          label: `${unlimitedAddOns.teacherBooks} Teacher Book${unlimitedAddOns.teacherBooks > 1 ? 's' : ''} × $${unlimitedTier.addOns.teacherBooks}`,
          amount: unlimitedAddOns.teacherBooks * unlimitedTier.addOns.teacherBooks
        });
      }
      if (unlimitedAddOns?.studentBooks) {
        breakdown.push({
          label: `${unlimitedAddOns.studentBooks} Student Book${unlimitedAddOns.studentBooks > 1 ? 's' : ''} × $${unlimitedTier.addOns.studentBooks}`,
          amount: unlimitedAddOns.studentBooks * unlimitedTier.addOns.studentBooks
        });
      }
      if (unlimitedAddOns?.posterA0) {
        breakdown.push({
          label: `${unlimitedAddOns.posterA0} A0 Poster${unlimitedAddOns.posterA0 > 1 ? 's' : ''} × $${unlimitedTier.addOns.posterA0}`,
          amount: unlimitedAddOns.posterA0 * unlimitedTier.addOns.posterA0
        });
      }
      return breakdown;
    }

    const breakdown = [];
    if (teacherTier) {
      breakdown.push({ 
        label: `${teacherCount} Teacher${teacherCount > 1 ? 's' : ''} × $${teacherTier.basePrice.teacher}`, 
        amount: teacherTier.basePrice.teacher * teacherCount 
      });
    }
    if (studentTier) {
      const originalPrice = studentTier.basePrice.student;
      const savings = studentCount >= 12 ? (originalPrice - studentPrice) * studentCount : 0;
      breakdown.push({ 
        label: `${studentCount} Student${studentCount > 1 ? 's' : ''} × $${studentPrice}`, 
        amount: studentPrice * studentCount,
        savings: savings > 0 ? savings : undefined,
        originalAmount: savings > 0 ? originalPrice * studentCount : undefined,
        savingsPerStudent: savings > 0 ? originalPrice - studentPrice : undefined
      });
    }
    return breakdown;
  };

  return (
    <Card className="mb-8 bg-white border-2 border-gray-800 shadow-2xl">
      <div className="p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Official Program Quote</h2>
              <p className="text-gray-200">
                {isUnlimited ? 'Unlimited School Access' : 
                  `${teacherTier?.name || ''}${teacherTier && studentTier ? ' + ' : ''}${studentTier?.name || ''}`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">${pricing.total.toLocaleString()}</div>
              <div className="text-gray-200">Total Price (inc. GST)</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Investment Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-6">
              <DollarSign className="h-6 w-6 text-green-600" />
              <h3 className="text-2xl font-semibold text-gray-800">Investment Breakdown</h3>
            </div>
            
            <div className="space-y-3">
              {getPriceBreakdown().map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                    <span className="text-gray-700 font-medium">{item.label}</span>
                    <div className="text-right">
                      {item.originalAmount && (
                        <div className="text-sm text-gray-500 line-through">
                          ${item.originalAmount.toLocaleString()}
                        </div>
                      )}
                      <span className="font-bold text-gray-900 text-lg">${item.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  {item.savings && item.savingsPerStudent && (
                    <div className="text-center mt-2">
                      <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">
                        💰 You save ${item.savingsPerStudent}/student = ${item.savings.toLocaleString()} total!
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="border-t-2 pt-4 mt-4">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span>Total Investment</span>
                  <span className="text-3xl text-green-600">${pricing.total.toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-600 text-right mt-1">
                  (Includes 10% GST)
                </div>
              </div>
            </div>

            {/* Program Timeline */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Program Timeline
              </h4>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mb-3",
                      !programStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {programStartDate ? format(programStartDate, 'PPP') : <span>Pick start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={programStartDate}
                    onSelect={(date) => date && onStartDateChange(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <div className="text-blue-800 text-sm space-y-1">
                <p><span className="font-semibold">12 Month Access Period</span></p>
                <p>Starts: <span className="font-medium">{format(programStartDate, 'PPP')}</span></p>
                <p>Ends: <span className="font-medium">{format(programEndDate, 'PPP')}</span></p>
              </div>
            </div>
          </div>

          {/* Inclusions */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Check className="h-6 w-6 text-green-600 mr-2" />
              What's Included
            </h3>

            {/* Teacher Inclusions */}
            {(teacherTier || isUnlimited) && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-teal-800 flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-teal-800 to-teal-400 rounded mr-2"></div>
                  Teacher Resources
                </h4>
                <div className="space-y-2">
                  {(isUnlimited ? unlimitedTier?.inclusions.slice(0, 5) : 
                    [...(teacherTier?.inclusions.teacher || []), ...(teacherTier?.inclusions.classroom || [])]
                  )?.map((inclusion, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg border border-teal-200">
                      <Check className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span className="text-teal-700 text-sm">{inclusion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Student Inclusions */}
            {(studentTier || isUnlimited) && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-yellow-800 flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded mr-2"></div>
                  Student Resources
                </h4>
                <div className="space-y-2">
                  {(isUnlimited ? unlimitedTier?.inclusions.slice(5) : 
                    studentTier?.inclusions.student
                  )?.map((inclusion, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                      <Check className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-yellow-700 text-sm">{inclusion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Digital Pass Benefits */}
            {((teacherTier && teacherTier.id.includes('digital')) || 
              (studentTier && studentTier.id.includes('digital')) || 
              isUnlimited) && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-green-800 font-medium text-center">
                  ✨ Includes free intro lesson + pre & post-program testing
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 42 Lessons Showcase */}
        <div className="mt-12 border-t-2 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
              <Book className="h-6 w-6 mr-2 text-green-600" />
              All 42 Financial Literacy Lessons Included
            </h3>
            <Button
              variant="outline"
              onClick={() => setShowAllLessons(!showAllLessons)}
              className="flex items-center space-x-2 border-green-200 text-green-600 hover:bg-green-50"
            >
              <span>{showAllLessons ? 'Show Less' : 'Show All Lessons'}</span>
              {showAllLessons ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="space-y-4">
            {Object.entries(lessonsByMicroCredential).map(([microCredential, lessons]) => (
              <div key={microCredential} className="border border-green-200 rounded-lg">
                <div 
                  className="p-4 bg-green-50 cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => setExpandedMicroCredential(expandedMicroCredential === microCredential ? null : microCredential)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-green-600 text-white">{microCredential}</Badge>
                      <span className="font-semibold text-green-800">{lessons.length} Lessons</span>
                    </div>
                    {expandedMicroCredential === microCredential ? 
                      <ChevronUp className="h-5 w-5 text-green-600" /> : 
                      <ChevronDown className="h-5 w-5 text-green-600" />
                    }
                  </div>
                </div>
                
                {(expandedMicroCredential === microCredential || showAllLessons) && (
                  <div className="p-4 bg-white border-t">
                    <div className="grid gap-2">
                      {lessons.map((lesson) => (
                        <div key={lesson.lesson} className="flex items-center space-x-3 p-2 hover:bg-green-50 rounded">
                          <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {lesson.lesson}
                          </div>
                          <div className="flex-1">
                            <span className="font-medium text-green-700">{lesson.title}</span>
                            <div className="text-sm text-green-500">{lesson.topic}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
