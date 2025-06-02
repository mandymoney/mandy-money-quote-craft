
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Image, ChevronDown, ChevronUp, Book } from 'lucide-react';
import { PricingTier } from './QuoteBuilder';

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

const lessons42 = [
  'Introduction to Money', 'Needs vs Wants', 'Earning Money', 'Saving Strategies',
  'Banking Basics', 'Interest & Compound Growth', 'Budgeting Fundamentals', 'Smart Shopping',
  'Comparing Prices', 'Understanding Sales', 'Online Shopping Safety', 'Payment Methods',
  'Credit vs Debit', 'Understanding Debt', 'Good vs Bad Debt', 'Credit Scores',
  'Investment Basics', 'Shares & Stocks', 'Property Investment', 'Risk & Return',
  'Superannuation', 'Insurance Types', 'Emergency Funds', 'Goal Setting',
  'Career Planning', 'Tax Basics', 'GST Understanding', 'Income Tax',
  'Business Basics', 'Entrepreneurship', 'Marketing Fundamentals', 'Customer Service',
  'Digital Payments', 'Cryptocurrency Basics', 'Online Security', 'Scam Prevention',
  'Financial Planning', 'Retirement Planning', 'Estate Planning', 'Philanthropy',
  'Global Economics', 'Supply & Demand', 'Economic Cycles', 'Review & Assessment'
];

export const InclusionsDisplay: React.FC<InclusionsDisplayProps> = ({
  teacherTier,
  studentTier,
  pricing,
  teacherCount,
  studentCount,
  studentPrice
}) => {
  const [showAllLessons, setShowAllLessons] = useState(false);

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
        <div className="h-24 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 mb-8">
          <div className="flex items-center justify-between h-full px-6">
            <div>
              <h2 className="text-white text-2xl font-bold">Your Complete Package</h2>
              <p className="text-white/90">{teacherTier.name} + {studentTier.name}</p>
            </div>
            <div className="text-right">
              <div className="text-white text-3xl font-bold">${pricing.total.toLocaleString()}</div>
              <div className="text-white/90 text-sm">Total (inc. GST)</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Price Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Price Breakdown</h3>
            <div className="space-y-3">
              {getPriceBreakdown().map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 text-sm">{item.label}</span>
                  <span className="font-semibold text-gray-900">${item.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold">${pricing.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-700">GST (10%):</span>
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
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                🎉 Volume discount applied!
              </Badge>
            )}

            {/* Classroom Space Notice */}
            {teacherCount > 0 && studentCount > 0 && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="text-purple-700 font-medium text-sm text-center">
                  ✨ Includes {teacherCount} classroom space{teacherCount > 1 ? 's' : ''} with student progress tracking
                </div>
              </div>
            )}
          </div>

          {/* Teacher Inclusions */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Teacher Features</h3>
            <div className="space-y-3">
              {teacherTier.inclusions.teacher.map((inclusion, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                  <Check className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{inclusion}</span>
                </div>
              ))}
              {teacherTier.inclusions.classroom.map((inclusion, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{inclusion}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Student Inclusions */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Student Features</h3>
            <div className="space-y-3">
              {studentTier.inclusions.student.map((inclusion, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
                  <Check className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{inclusion}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Preview */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Preview Materials</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-300">
                <div className="text-center">
                  <Image className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-purple-600 font-medium">Teacher Materials</p>
                </div>
              </div>
              <div className="aspect-square bg-gradient-to-br from-orange-100 to-pink-100 rounded-lg flex items-center justify-center border-2 border-dashed border-orange-300">
                <div className="text-center">
                  <Image className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-orange-600 font-medium">Student Materials</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Upload your own preview images to customize this section
            </p>
          </div>
        </div>

        {/* 42 Lessons Showcase */}
        <div className="mt-12 border-t pt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
              <Book className="h-6 w-6 mr-2 text-purple-600" />
              All 42 Financial Literacy Lessons Included
            </h3>
            <Button
              variant="outline"
              onClick={() => setShowAllLessons(!showAllLessons)}
              className="flex items-center space-x-2"
            >
              <span>{showAllLessons ? 'Show Less' : 'Show All Lessons'}</span>
              {showAllLessons ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className={cn(
            'grid gap-3 transition-all duration-300',
            showAllLessons ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
          )}>
            {(showAllLessons ? lessons42 : lessons42.slice(0, 8)).map((lesson, index) => (
              <div
                key={index}
                className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:from-purple-50 hover:to-pink-50 hover:border-purple-200 transition-all duration-200"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{lesson}</span>
                </div>
              </div>
            ))}
          </div>
          
          {!showAllLessons && (
            <div className="text-center mt-4">
              <Badge variant="outline" className="text-purple-600 border-purple-200">
                +{lessons42.length - 8} more comprehensive lessons
              </Badge>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
