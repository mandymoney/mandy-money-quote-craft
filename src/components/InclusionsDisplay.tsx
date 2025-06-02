
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, ChevronUp, Book } from 'lucide-react';
import { PricingTier } from './QuoteBuilder';
import { cn } from '@/lib/utils';

interface InclusionsDisplayProps {
  teacherTier: PricingTier;
  studentTier: PricingTier;
  pricing: {
    subtotal: number;
    gst: number;
    total: number;
  };
  teacherCount: number;
  studentCount: number;
  studentPrice: number;
}

const lessonsByMicroCredential = {
  'Level 1': [
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
  'Level 2': [
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
  'Level 3': [
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
  'Level 4': [
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
  studentPrice
}) => {
  const [showAllLessons, setShowAllLessons] = useState(false);
  const [expandedMicroCredential, setExpandedMicroCredential] = useState<string | null>(null);

  const getPriceBreakdown = () => {
    return [
      { 
        label: `${teacherCount} Teacher${teacherCount > 1 ? 's' : ''} × $${teacherTier.basePrice.teacher}`, 
        amount: teacherTier.basePrice.teacher * teacherCount 
      },
      { 
        label: `${studentCount} Student${studentCount > 1 ? 's' : ''} × $${studentPrice}`, 
        amount: studentPrice * studentCount 
      }
    ];
  };

  return (
    <Card className="mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg animate-fade-in">
      <div className="p-8">
        {/* Header */}
        <div className="h-24 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 mb-8">
          <div className="flex items-center justify-between h-full px-6">
            <div>
              <h2 className="text-white text-2xl font-bold">Your Program Quote</h2>
              <p className="text-white/90">{teacherTier.name} + {studentTier.name}</p>
            </div>
            <div className="text-right">
              <div className="text-white text-3xl font-bold">${pricing.total.toLocaleString()}</div>
              <div className="text-white/90 text-sm">Total (inc. GST)</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Price Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-teal-800 mb-4">Price Breakdown</h3>
            <div className="space-y-3">
              {getPriceBreakdown().map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                  <span className="text-teal-700 text-sm">{item.label}</span>
                  <span className="font-semibold text-teal-900">${item.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="p-3 bg-teal-100 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-teal-700">Subtotal:</span>
                  <span className="font-semibold">${pricing.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-teal-700">GST (10%):</span>
                  <span className="font-semibold">${pricing.gst.toLocaleString()}</span>
                </div>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-2xl">${pricing.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Volume Discount Badge */}
            {studentCount >= 12 && (
              <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">
                🎉 Volume discount applied!
              </Badge>
            )}

            {/* 12 Month Access Notice */}
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
              <div className="text-teal-700 font-medium text-sm text-center">
                📅 Includes 12 month access period
              </div>
            </div>
          </div>

          {/* Teacher Features */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-teal-800 mb-4">Teacher Features</h3>
            <div className="space-y-3">
              {teacherTier.inclusions.teacher.map((inclusion, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg">
                  <Check className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span className="text-teal-700">{inclusion}</span>
                </div>
              ))}
              {teacherTier.inclusions.classroom.map((inclusion, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg">
                  <Check className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span className="text-teal-700">{inclusion}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Student Features */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-teal-800 mb-4">Student Features</h3>
            <div className="space-y-3">
              {studentTier.inclusions.student.map((inclusion, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg">
                  <Check className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span className="text-teal-700">{inclusion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 42 Lessons Showcase by Micro-Credential */}
        <div className="mt-12 border-t pt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-teal-800 flex items-center">
              <Book className="h-6 w-6 mr-2 text-teal-600" />
              All 42 Financial Literacy Lessons by Micro-Credential
            </h3>
            <Button
              variant="outline"
              onClick={() => setShowAllLessons(!showAllLessons)}
              className="flex items-center space-x-2 border-teal-200 text-teal-600 hover:bg-teal-50"
            >
              <span>{showAllLessons ? 'Show Less' : 'Show All Lessons'}</span>
              {showAllLessons ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="space-y-4">
            {Object.entries(lessonsByMicroCredential).map(([microCredential, lessons]) => (
              <div key={microCredential} className="border border-teal-200 rounded-lg">
                <div 
                  className="p-4 bg-teal-50 cursor-pointer hover:bg-teal-100 transition-colors"
                  onClick={() => setExpandedMicroCredential(expandedMicroCredential === microCredential ? null : microCredential)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-teal-600 text-white">{microCredential}</Badge>
                      <span className="font-semibold text-teal-800">{lessons.length} Lessons</span>
                    </div>
                    {expandedMicroCredential === microCredential ? 
                      <ChevronDown className="h-5 w-5 text-teal-600" /> : 
                      <ChevronUp className="h-5 w-5 text-teal-600" />
                    }
                  </div>
                </div>
                
                {(expandedMicroCredential === microCredential || showAllLessons) && (
                  <div className="p-4 bg-white border-t">
                    <div className="grid gap-2">
                      {lessons.map((lesson) => (
                        <div key={lesson.lesson} className="flex items-center space-x-3 p-2 hover:bg-teal-50 rounded">
                          <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {lesson.lesson}
                          </div>
                          <div className="flex-1">
                            <span className="font-medium text-teal-700">{lesson.title}</span>
                            <div className="text-sm text-teal-500">{lesson.topic}</div>
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
