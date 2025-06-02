
import React, { useState } from 'react';
import { PricingCard } from './PricingCard';
import { VolumeSelector } from './VolumeSelector';
import { InclusionsDisplay } from './InclusionsDisplay';
import { ActionButtons } from './ActionButtons';
import { UnlimitedSchoolCard } from './UnlimitedSchoolCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  isPopular?: boolean;
  type: 'teacher' | 'student' | 'combined';
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
}

const teacherTiers: PricingTier[] = [
  {
    id: 'teacher-digital',
    name: 'Teacher Digital Pass',
    description: 'Complete digital access for teachers',
    basePrice: { teacher: 119, student: 0 },
    volumeDiscounts: { students12Plus: 0, students50Plus: 0 },
    inclusions: {
      teacher: ['42 Interactive Digital Lessons', 'Teacher Dashboard', 'Lesson Plans & Resources', 'Assessment Tools'],
      student: [],
      classroom: ['1 Classroom Space per Teacher', 'Student Progress Tracking', 'Class Management Tools']
    },
    type: 'teacher'
  },
  {
    id: 'teacher-physical',
    name: 'Teacher Hard-Copy',
    description: 'Physical textbook for teachers',
    basePrice: { teacher: 89, student: 0 },
    volumeDiscounts: { students12Plus: 0, students50Plus: 0 },
    inclusions: {
      teacher: ['42 Lesson Physical Textbook', 'Teacher Guide', 'Print Resources', 'Durable Materials'],
      student: [],
      classroom: ['1 Classroom Space per Teacher', 'Basic Progress Tracking']
    },
    type: 'teacher'
  },
  {
    id: 'teacher-both',
    name: 'Teacher Digital + Physical',
    description: 'Complete teacher package',
    basePrice: { teacher: 189, student: 0 },
    volumeDiscounts: { students12Plus: 0, students50Plus: 0 },
    inclusions: {
      teacher: ['42 Interactive Digital Lessons', '42 Lesson Physical Textbook', 'Teacher Dashboard', 'All Print & Digital Resources'],
      student: [],
      classroom: ['1 Classroom Space per Teacher', 'Advanced Progress Tracking', 'Full Class Management']
    },
    isPopular: true,
    type: 'teacher'
  }
];

const studentTiers: PricingTier[] = [
  {
    id: 'student-digital',
    name: 'Student Digital Pass',
    description: 'Digital access for students',
    basePrice: { teacher: 0, student: 21 },
    volumeDiscounts: { students12Plus: 18, students50Plus: 15 },
    inclusions: {
      teacher: [],
      student: ['42 Interactive Lessons', 'Mobile & Tablet Access', 'Downloadable Resources', 'Progress Tracking'],
      classroom: []
    },
    type: 'student'
  },
  {
    id: 'student-physical',
    name: 'Student Hard-Copy',
    description: 'Physical textbook for students',
    basePrice: { teacher: 0, student: 49 },
    volumeDiscounts: { students12Plus: 42, students50Plus: 40 },
    inclusions: {
      teacher: [],
      student: ['42 Lesson Textbook', 'Workbook Pages', 'No Internet Required', 'Durable Print Materials'],
      classroom: []
    },
    type: 'student'
  },
  {
    id: 'student-both',
    name: 'Student Digital + Physical',
    description: 'Complete student package',
    basePrice: { teacher: 0, student: 55 },
    volumeDiscounts: { students12Plus: 49, students50Plus: 46 },
    inclusions: {
      teacher: [],
      student: ['42 Interactive Lessons', '42 Lesson Textbook', 'Mobile Access', 'All Resources', 'Complete Package'],
      classroom: []
    },
    isPopular: true,
    type: 'student'
  }
];

const unlimitedTier: UnlimitedTier = {
  id: 'unlimited',
  name: 'Unlimited School Access',
  description: 'Complete digital access for entire school',
  basePrice: 3199,
  addOns: {
    teacherBooks: 89,
    studentBooks: 49
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
  ]
};

export const QuoteBuilder = () => {
  const [selectedTeacherTier, setSelectedTeacherTier] = useState<string>('teacher-both');
  const [selectedStudentTier, setSelectedStudentTier] = useState<string>('student-both');
  const [teacherCount, setTeacherCount] = useState<number>(1);
  const [studentCount, setStudentCount] = useState<number>(25);
  const [useUnlimited, setUseUnlimited] = useState<boolean>(false);
  const [unlimitedAddOns, setUnlimitedAddOns] = useState({
    teacherBooks: 0,
    studentBooks: 0
  });

  const GST_RATE = 0.1;

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
    
    const subtotal = teacherCost + studentCost;
    const gst = subtotal * GST_RATE;
    const total = subtotal + gst;
    
    return { subtotal, gst, total };
  };

  const calculateUnlimitedTotal = (): { subtotal: number; gst: number; total: number } => {
    const subtotal = unlimitedTier.basePrice + 
      (unlimitedAddOns.teacherBooks * unlimitedTier.addOns.teacherBooks) +
      (unlimitedAddOns.studentBooks * unlimitedTier.addOns.studentBooks);
    
    const gst = subtotal * GST_RATE;
    const total = subtotal + gst;
    
    return { subtotal, gst, total };
  };

  const selectedTeacherData = teacherTiers.find(tier => tier.id === selectedTeacherTier);
  const selectedStudentData = studentTiers.find(tier => tier.id === selectedStudentTier);
  const regularPricing = calculateRegularTotal();
  const unlimitedPricing = calculateUnlimitedTotal();
  const nextDiscount = getNextDiscountThreshold();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-4">
            The Mandy Money Program
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Build your custom quote and see live pricing for Australia's leading financial literacy program
          </p>
        </div>

        {/* Volume Selectors */}
        <Card className="mb-8 p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            How many teachers and students?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <VolumeSelector
              label="Number of Teachers"
              value={teacherCount}
              onChange={setTeacherCount}
              min={1}
              max={20}
              color="purple"
            />
            <VolumeSelector
              label="Number of Students"
              value={studentCount}
              onChange={setStudentCount}
              min={1}
              max={200}
              color="pink"
            />
          </div>
          
          {/* Discount Progress */}
          {nextDiscount && (
            <div className="mt-6 text-center">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-lg px-4 py-2">
                🎯 Add {nextDiscount.studentsToGo} more student{nextDiscount.studentsToGo > 1 ? 's' : ''} to unlock volume discounts at {nextDiscount.threshold}+ students!
              </Badge>
            </div>
          )}
        </Card>

        {/* Teacher Options */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Teacher Options</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {teacherTiers.map((tier, index) => (
              <PricingCard
                key={tier.id}
                tier={tier}
                price={tier.basePrice.teacher * teacherCount}
                isSelected={selectedTeacherTier === tier.id}
                onSelect={() => setSelectedTeacherTier(tier.id)}
                teacherCount={teacherCount}
                studentCount={0}
                animationDelay={index * 100}
                showImages={true}
              />
            ))}
          </div>
        </div>

        {/* Student Options */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Student Options</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {studentTiers.map((tier, index) => (
              <PricingCard
                key={tier.id}
                tier={tier}
                price={calculateStudentPrice(tier) * studentCount}
                isSelected={selectedStudentTier === tier.id}
                onSelect={() => setSelectedStudentTier(tier.id)}
                teacherCount={0}
                studentCount={studentCount}
                animationDelay={index * 100}
                showImages={true}
                studentPrice={calculateStudentPrice(tier)}
              />
            ))}
          </div>
        </div>

        {/* OR Divider */}
        <div className="mb-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-lg">
              <span className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 px-6 text-2xl font-bold text-gray-700">OR</span>
            </div>
          </div>
        </div>

        {/* Unlimited School Access */}
        <UnlimitedSchoolCard
          tier={unlimitedTier}
          isSelected={useUnlimited}
          onSelect={() => setUseUnlimited(!useUnlimited)}
          addOns={unlimitedAddOns}
          onAddOnsChange={setUnlimitedAddOns}
          pricing={unlimitedPricing}
          teacherCount={teacherCount}
          studentCount={studentCount}
        />

        {/* Selected Options Details */}
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
            name: `${selectedTeacherData?.name} + ${selectedStudentData?.name}`,
            id: 'combined'
          }}
          totalPrice={useUnlimited ? unlimitedPricing.total : regularPricing.total}
          teacherCount={teacherCount}
          studentCount={studentCount}
        />
      </div>
    </div>
  );
};
