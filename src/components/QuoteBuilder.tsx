
import React, { useState } from 'react';
import { PricingCard } from './PricingCard';
import { VolumeSelector } from './VolumeSelector';
import { InclusionsDisplay } from './InclusionsDisplay';
import { ActionButtons } from './ActionButtons';
import { Card } from '@/components/ui/card';

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
  inclusions: string[];
  isPopular?: boolean;
  isUnlimited?: boolean;
  unlimitedPrice?: number;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'digital',
    name: 'Digital Pass Only',
    description: 'Complete digital access to all 42 lessons',
    basePrice: { teacher: 119, student: 21 },
    volumeDiscounts: { students12Plus: 18, students50Plus: 15 },
    inclusions: [
      '42 Interactive Digital Lessons',
      'Student Progress Tracking',
      'Downloadable Resources',
      'Mobile & Tablet Access'
    ]
  },
  {
    id: 'physical',
    name: 'Hard-Copy Textbook Only',
    description: 'Physical textbook with all lesson materials',
    basePrice: { teacher: 89, student: 49 },
    volumeDiscounts: { students12Plus: 42, students50Plus: 40 },
    inclusions: [
      '42 Lesson Physical Textbook',
      'Durable Print Materials',
      'No Internet Required',
      'Traditional Learning Format'
    ]
  },
  {
    id: 'both',
    name: 'Digital + Physical Bundle',
    description: 'Best value - Complete access to everything!',
    basePrice: { teacher: 189, student: 55 },
    volumeDiscounts: { students12Plus: 49, students50Plus: 46 },
    inclusions: [
      '42 Interactive Digital Lessons',
      '42 Lesson Physical Textbook',
      'Student Progress Tracking',
      'Downloadable Resources',
      'Mobile & Tablet Access',
      'Durable Print Materials'
    ],
    isPopular: true
  },
  {
    id: 'unlimited',
    name: 'Unlimited School Access',
    description: 'Complete digital access for entire school',
    basePrice: { teacher: 3199, student: 0 },
    volumeDiscounts: { students12Plus: 0, students50Plus: 0 },
    inclusions: [
      'Unlimited Digital Access',
      'All Teachers & Students',
      '42 Interactive Lessons',
      'School-wide License',
      'Priority Support',
      'Admin Dashboard'
    ],
    isUnlimited: true,
    unlimitedPrice: 3199
  }
];

export const QuoteBuilder = () => {
  const [selectedTier, setSelectedTier] = useState<string>('both');
  const [teacherCount, setTeacherCount] = useState<number>(1);
  const [studentCount, setStudentCount] = useState<number>(25);

  const calculatePrice = (tier: PricingTier): number => {
    if (tier.isUnlimited) {
      return tier.unlimitedPrice || 0;
    }

    let studentPrice = tier.basePrice.student;
    
    if (studentCount >= 50) {
      studentPrice = tier.volumeDiscounts.students50Plus;
    } else if (studentCount >= 12) {
      studentPrice = tier.volumeDiscounts.students12Plus;
    }

    return (tier.basePrice.teacher * teacherCount) + (studentPrice * studentCount);
  };

  const selectedTierData = pricingTiers.find(tier => tier.id === selectedTier);
  const totalPrice = selectedTierData ? calculatePrice(selectedTierData) : 0;

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
        </Card>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          {pricingTiers.map((tier, index) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              price={calculatePrice(tier)}
              isSelected={selectedTier === tier.id}
              onSelect={() => setSelectedTier(tier.id)}
              teacherCount={teacherCount}
              studentCount={studentCount}
              animationDelay={index * 100}
            />
          ))}
        </div>

        {/* Selected Tier Details */}
        {selectedTierData && (
          <InclusionsDisplay
            tier={selectedTierData}
            price={totalPrice}
            teacherCount={teacherCount}
            studentCount={studentCount}
          />
        )}

        {/* Action Buttons */}
        <ActionButtons
          selectedTier={selectedTierData}
          totalPrice={totalPrice}
          teacherCount={teacherCount}
          studentCount={studentCount}
        />
      </div>
    </div>
  );
};
