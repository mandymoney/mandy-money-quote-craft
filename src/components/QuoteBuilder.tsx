import React, { useState } from 'react';
import { PricingCard } from './PricingCard';
import { VolumeSelector } from './VolumeSelector';
import { InclusionsDisplay } from './InclusionsDisplay';
import { ActionButtons } from './ActionButtons';
import { UnlimitedSchoolCard } from './UnlimitedSchoolCard';
import { VideoEmbed } from './VideoEmbed';
import { LessonExplorer } from './LessonExplorer';
import { AddressInput } from './AddressInput';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, ArrowDown, ChevronDown, Upload, RotateCw, Check, CalendarIcon, BarChart3, MessageCircle, Plus } from 'lucide-react';
import { addMonths, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { FormCompletionIndicator } from './FormCompletionIndicator';
import { useFormValidation } from '@/hooks/useFormValidation';

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
interface TierSelection {
  [tierId: string]: number;
}
interface AddressComponents {
  streetNumber: string;
  streetName: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}
interface SchoolInfo {
  schoolName: string;
  schoolAddress: AddressComponents;
  schoolABN: string;
  contactPhone: string;
  deliveryAddress: AddressComponents;
  deliveryIsSameAsSchool: boolean;
  billingAddress: AddressComponents;
  billingIsSameAsSchool: boolean;
  accountsEmail: string;
  coordinatorEmail: string;
  coordinatorName: string;
  coordinatorPosition: string;
  purchaseOrderNumber: string;
  paymentPreference: string;
  supplierSetupForms: string;
  questionsComments: string;
}
interface VideoLinks {
  teacherPassVideo: string;
  studentPassVideo: string;
  microCredentialsVideo: string;
  lessonEmbeds: {
    [key: number]: string;
  };
}
const teacherTiers: PricingTier[] = [{
  id: 'teacher-digital',
  name: 'Digital Pass Only',
  description: 'Complete digital access for teachers',
  basePrice: {
    teacher: 119,
    student: 0
  },
  volumeDiscounts: {
    students12Plus: 0,
    students50Plus: 0
  },
  inclusions: {
    teacher: ['42 x Click & Play Powerpoint Lessons', '168 x Theory Videos', '168 x Printable Worksheets', 'Classroom Lesson Quizzes', 'Lesson Plans', 'Curriculum Alignment Guides', 'Digital Textbook', 'Classroom Space (requires student passes)'],
    student: [],
    classroom: []
  },
  notIncluded: ['Print Textbook', 'Offline Access'],
  type: 'teacher',
  bestFor: 'Tech-savvy teachers with digital classrooms'
}, {
  id: 'teacher-physical',
  name: 'Textbook Only',
  description: 'Physical textbook for teachers',
  basePrice: {
    teacher: 89,
    student: 0
  },
  volumeDiscounts: {
    students12Plus: 0,
    students50Plus: 0
  },
  inclusions: {
    teacher: ['42 x Complete Lesson Resources', '168 x Illustrated Theory Pages', '168 x Worksheets', 'Lesson Plans', 'Curriculum Alignment Guides'],
    student: [],
    classroom: []
  },
  notIncluded: ['Click & Play Digital Lessons', 'Digital Textbook', 'Classroom Lesson Quizzes', 'Classroom Space'],
  type: 'teacher',
  bestFor: 'Traditional classroom teachers who prefer print materials'
}, {
  id: 'teacher-both',
  name: 'Digital Pass + Textbook Bundle',
  description: 'Complete teacher package',
  basePrice: {
    teacher: 189,
    student: 0
  },
  volumeDiscounts: {
    students12Plus: 0,
    students50Plus: 0
  },
  inclusions: {
    teacher: ['1 x Print & Digital Textbook', '1 x Digital Teacher Pass', '42 x Click & Play Powerpoint Lessons', '168 x Theory Videos + Illustrated Theory Pages', '168 x Printable Worksheets', 'Classroom Lesson Quizzes', 'Lesson Plans', 'Curriculum Alignment Guides', 'Classroom Space (requires student passes)'],
    student: [],
    classroom: []
  },
  isPopular: true,
  type: 'teacher',
  bestFor: 'Teachers who want maximum flexibility and resources'
}];
const studentTiers: PricingTier[] = [{
  id: 'student-digital',
  name: 'Digital Pass Only',
  description: 'Digital access for students',
  basePrice: {
    teacher: 0,
    student: 21
  },
  volumeDiscounts: {
    students12Plus: 18,
    students50Plus: 15
  },
  inclusions: {
    teacher: [],
    student: ['Personal Student Account', '42 x Digital Lessons', '168 x Theory Videos', '168 x Gamified Activities', 'Lesson Quizzes', 'Lesson Certificates', 'Micro-Credential Pre & Post Testing'],
    classroom: []
  },
  notIncluded: ['Print Student Textbook', 'Offline Access'],
  type: 'student',
  bestFor: '1:1 device schools and tech-comfortable students'
}, {
  id: 'student-physical',
  name: 'Textbook Only',
  description: 'Physical textbook for students',
  basePrice: {
    teacher: 0,
    student: 49
  },
  volumeDiscounts: {
    students12Plus: 42,
    students50Plus: 40
  },
  inclusions: {
    teacher: [],
    student: ['42 x Complete Lesson Resources', '168 x Illustrated Theory Pages', '168 x Worksheets', 'Worksheet Answers'],
    classroom: []
  },
  notIncluded: ['Digital Lesson Access', 'Digital Textbook', 'Micro-Credential Pre & Post Testing'],
  type: 'student',
  bestFor: 'Students who learn better with physical materials'
}, {
  id: 'student-both',
  name: 'Digital Pass + Textbook Bundle',
  description: 'Complete student package',
  basePrice: {
    teacher: 0,
    student: 55
  },
  volumeDiscounts: {
    students12Plus: 49,
    students50Plus: 46
  },
  inclusions: {
    teacher: [],
    student: ['1 x Student Digital Pass', '1 x Print Student Textbook', '42 x Lessons', '168 x Theory Videos + Illustrated Theory Pages', '168 x Worksheets + Gamified Activities', 'Micro-Credential Pre & Post Testing', 'Lesson Quizzes', 'Lesson Certificates'],
    classroom: []
  },
  isPopular: true,
  type: 'student',
  bestFor: 'Schools wanting comprehensive learning resources'
}];
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
  inclusions: ['Unlimited Teacher Digital Passes', 'Unlimited Student Digital Passes', 'Unlimited Classroom Spaces'],
  bestFor: 'Perfect for schools prioritising financial empowerment as a core student outcome'
};
export const QuoteBuilder = () => {
  const [selectedTeacherTiers, setSelectedTeacherTiers] = useState<TierSelection>({});
  const [selectedStudentTiers, setSelectedStudentTiers] = useState<TierSelection>({});
  const [useUnlimited, setUseUnlimited] = useState<boolean>(false);
  const [unlimitedAddOns, setUnlimitedAddOns] = useState({
    teacherBooks: 0,
    studentBooks: 0,
    posterA0: 0
  });
  const [programStartDate, setProgramStartDate] = useState<Date>(new Date());
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>({
    schoolName: '',
    schoolAddress: {
      streetNumber: '',
      streetName: '',
      suburb: '',
      state: '',
      postcode: '',
      country: 'Australia'
    },
    schoolABN: '',
    contactPhone: '',
    deliveryAddress: {
      streetNumber: '',
      streetName: '',
      suburb: '',
      state: '',
      postcode: '',
      country: 'Australia'
    },
    deliveryIsSameAsSchool: true,
    billingAddress: {
      streetNumber: '',
      streetName: '',
      suburb: '',
      state: '',
      postcode: '',
      country: 'Australia'
    },
    billingIsSameAsSchool: true,
    accountsEmail: '',
    coordinatorEmail: '',
    coordinatorName: '',
    coordinatorPosition: '',
    purchaseOrderNumber: '',
    paymentPreference: '',
    supplierSetupForms: '',
    questionsComments: ''
  });
  const [videoLinks, setVideoLinks] = useState<VideoLinks>({
    teacherPassVideo: '',
    studentPassVideo: '',
    microCredentialsVideo: '',
    lessonEmbeds: {}
  });
  const GST_RATE = 0.1;
  const SHIPPING_THRESHOLD = 90;
  const SHIPPING_COST = 14;
  const getTotalTeacherCount = (): number => {
    return Object.values(selectedTeacherTiers).reduce((sum, count) => sum + count, 0);
  };
  const getTotalStudentCount = (): number => {
    return Object.values(selectedStudentTiers).reduce((sum, count) => sum + count, 0);
  };
  const hasPhysicalItems = (): boolean => {
    if (useUnlimited) {
      return unlimitedAddOns.teacherBooks > 0 || unlimitedAddOns.studentBooks > 0 || unlimitedAddOns.posterA0 > 0;
    }
    return selectedTeacherTiers['teacher-physical'] > 0 || selectedTeacherTiers['teacher-both'] > 0 || selectedStudentTiers['student-physical'] > 0 || selectedStudentTiers['student-both'] > 0;
  };
  const calculateStudentPrice = (tier: PricingTier, currentStudentCount: number): number => {
    let studentPrice = tier.basePrice.student;
    if (currentStudentCount >= 50) {
      studentPrice = tier.volumeDiscounts.students50Plus;
    } else if (currentStudentCount >= 12) {
      studentPrice = tier.volumeDiscounts.students12Plus;
    }
    return studentPrice;
  };
  const calculateUnlimitedTotal = (): { subtotal: number; gst: number; total: number; shipping: number } => {
    const basePrice = unlimitedTier.basePrice;
    const addOnsCost = 
      (unlimitedAddOns.teacherBooks * unlimitedTier.addOns.teacherBooks) +
      (unlimitedAddOns.studentBooks * unlimitedTier.addOns.studentBooks) +
      (unlimitedAddOns.posterA0 * unlimitedTier.addOns.posterA0);

    const hasPhysicalItems = unlimitedAddOns.teacherBooks > 0 || unlimitedAddOns.studentBooks > 0 || unlimitedAddOns.posterA0 > 0;
    
    let shipping = 0;
    if (hasPhysicalItems) {
      const subtotalBeforeShipping = (basePrice + addOnsCost) / (1 + GST_RATE);
      if (subtotalBeforeShipping < SHIPPING_THRESHOLD) {
        shipping = SHIPPING_COST;
      }
    }

    const total = basePrice + addOnsCost + shipping;
    const subtotal = (basePrice + addOnsCost) / (1 + GST_RATE);
    const gst = total - subtotal - shipping;

    return {
      subtotal,
      gst,
      total,
      shipping
    };
  };

  const calculateRegularTotal = (): {
    subtotal: number;
    gst: number;
    total: number;
    shipping: number;
  } => {
    let teacherCost = 0;
    let studentCost = 0;

    // Calculate teacher costs
    teacherTiers.forEach(tier => {
      const count = selectedTeacherTiers[tier.id] || 0;
      teacherCost += tier.basePrice.teacher * count;
    });

    // Calculate student costs
    const totalStudents = getTotalStudentCount();
    studentTiers.forEach(tier => {
      const count = selectedStudentTiers[tier.id] || 0;
      studentCost += calculateStudentPrice(tier, totalStudents) * count;
    });
    let shipping = 0;
    if (hasPhysicalItems()) {
      const subtotalBeforeShipping = (teacherCost + studentCost) / (1 + GST_RATE);
      if (subtotalBeforeShipping < SHIPPING_THRESHOLD) {
        shipping = SHIPPING_COST;
      }
    }
    const total = teacherCost + studentCost + shipping;
    const subtotal = (teacherCost + studentCost) / (1 + GST_RATE);
    const gst = total - subtotal - shipping;
    return {
      subtotal,
      gst,
      total,
      shipping
    };
  };
  const getVolumeNotification = (): string | null => {
    const totalStudents = getTotalStudentCount();
    if (totalStudents > 0 && totalStudents < 12) {
      return `Add ${12 - totalStudents} more students to unlock volume pricing!`;
    } else if (totalStudents >= 12 && totalStudents < 50) {
      return `Add ${50 - totalStudents} more students for maximum volume discount!`;
    }
    return null;
  };
  const getIncludedItems = () => {
    const items = [];
    if (useUnlimited) {
      items.push(`Unlimited Teacher Digital Passes`);
      items.push(`Unlimited Student Digital Passes`);
      
      // Only include classroom spaces if we have both teacher and student passes selected for unlimited
      const hasTeacherPasses = unlimitedAddOns.teacherBooks > 0 || true; // Unlimited always has teacher passes
      const hasStudentPasses = true; // Unlimited always has student passes
      if (hasTeacherPasses && hasStudentPasses) {
        items.push(`Unlimited Digital Classroom Spaces`);
      }
      
      if (unlimitedAddOns.teacherBooks > 0) {
        items.push(`${unlimitedAddOns.teacherBooks} x Teacher Print Textbook${unlimitedAddOns.teacherBooks > 1 ? 's' : ''}`);
      }
      if (unlimitedAddOns.studentBooks > 0) {
        items.push(`${unlimitedAddOns.studentBooks} x Student Print Textbook${unlimitedAddOns.studentBooks > 1 ? 's' : ''}`);
      }
      if (unlimitedAddOns.posterA0 > 0) {
        items.push(`${unlimitedAddOns.posterA0} x A0 Poster${unlimitedAddOns.posterA0 > 1 ? 's' : ''}`);
      }
    } else {
      const teacherDigital = selectedTeacherTiers['teacher-digital'] || 0;
      const teacherPhysical = selectedTeacherTiers['teacher-physical'] || 0;
      const teacherBoth = selectedTeacherTiers['teacher-both'] || 0;
      const studentDigital = selectedStudentTiers['student-digital'] || 0;
      const studentPhysical = selectedStudentTiers['student-physical'] || 0;
      const studentBoth = selectedStudentTiers['student-both'] || 0;

      const totalTeacherDigital = teacherDigital + teacherBoth;
      const totalTeacherPhysical = teacherPhysical + teacherBoth;
      const totalStudentDigital = studentDigital + studentBoth;
      const totalStudentPhysical = studentPhysical + studentBoth;
      
      // Only include classroom spaces if we have both teacher digital passes AND any student passes
      const hasStudentPasses = totalStudentDigital > 0 || totalStudentPhysical > 0;
      const totalClassrooms = totalTeacherDigital > 0 && hasStudentPasses ? totalTeacherDigital : 0;

      if (totalTeacherDigital > 0) {
        items.push({
          text: `${totalTeacherDigital} x Teacher Digital Pass${totalTeacherDigital > 1 ? 'es' : ''}`,
          type: 'teacher'
        });
      }
      if (totalTeacherPhysical > 0) {
        items.push({
          text: `${totalTeacherPhysical} x Teacher Print Textbook${totalTeacherPhysical > 1 ? 's' : ''}`,
          type: 'teacher'
        });
      }
      if (totalClassrooms > 0) {
        items.push({
          text: `${totalClassrooms} x Digital Classroom Space${totalClassrooms > 1 ? 's' : ''}`,
          type: 'teacher'
        });
      }
      if (totalStudentDigital > 0) {
        items.push({
          text: `${totalStudentDigital} x Student Digital Pass${totalStudentDigital > 1 ? 'es' : ''}`,
          type: 'student'
        });
      }
      if (totalStudentPhysical > 0) {
        items.push({
          text: `${totalStudentPhysical} x Student Print Textbook${totalStudentPhysical > 1 ? 's' : ''}`,
          type: 'student'
        });
      }
    }
    return items;
  };
  const getDetailedBreakdown = () => {
    const breakdown = [];
    if (useUnlimited) {
      breakdown.push({
        item: 'Unlimited School Access',
        count: 1,
        unitPrice: unlimitedTier.basePrice,
        totalPrice: unlimitedTier.basePrice,
        type: 'base',
        description: 'Unlimited Teacher Digital Passes, Student Digital Passes & Classroom Spaces'
      });
      if (unlimitedAddOns.teacherBooks > 0) {
        breakdown.push({
          item: 'Teacher Print Textbooks',
          count: unlimitedAddOns.teacherBooks,
          unitPrice: unlimitedTier.addOns.teacherBooks,
          totalPrice: unlimitedAddOns.teacherBooks * unlimitedTier.addOns.teacherBooks,
          type: 'teacher',
          description: 'Physical teacher textbooks'
        });
      }
      if (unlimitedAddOns.studentBooks > 0) {
        breakdown.push({
          item: 'Student Print Textbooks',
          count: unlimitedAddOns.studentBooks,
          unitPrice: unlimitedTier.addOns.studentBooks,
          totalPrice: unlimitedAddOns.studentBooks * unlimitedTier.addOns.studentBooks,
          type: 'student',
          description: 'Physical student textbooks'
        });
      }
      if (unlimitedAddOns.posterA0 > 0) {
        breakdown.push({
          item: 'A0 Posters',
          count: unlimitedAddOns.posterA0,
          unitPrice: unlimitedTier.addOns.posterA0,
          totalPrice: unlimitedAddOns.posterA0 * unlimitedTier.addOns.posterA0,
          type: 'addon',
          description: 'Large format classroom posters'
        });
      }
    } else {
      const totalStudents = getTotalStudentCount();
      teacherTiers.forEach(tier => {
        const count = selectedTeacherTiers[tier.id] || 0;
        if (count > 0) {
          breakdown.push({
            item: tier.name,
            count,
            unitPrice: tier.basePrice.teacher,
            totalPrice: tier.basePrice.teacher * count,
            type: 'teacher',
            description: tier.description
          });
        }
      });
      studentTiers.forEach(tier => {
        const count = selectedStudentTiers[tier.id] || 0;
        if (count > 0) {
          const unitPrice = calculateStudentPrice(tier, totalStudents);
          const originalPrice = tier.basePrice.student;
          const savings = originalPrice - unitPrice;
          breakdown.push({
            item: tier.name,
            count,
            unitPrice,
            totalPrice: unitPrice * count,
            type: 'student',
            description: tier.description,
            originalUnitPrice: originalPrice,
            savings: savings > 0 ? savings : 0
          });
        }
      });
    }
    return breakdown;
  };
  const getTotalSavings = (): number => {
    const totalStudents = getTotalStudentCount();
    let totalSavings = 0;
    studentTiers.forEach(tier => {
      const count = selectedStudentTiers[tier.id] || 0;
      if (count > 0) {
        const currentPrice = calculateStudentPrice(tier, totalStudents);
        const originalPrice = tier.basePrice.student;
        const savings = originalPrice - currentPrice;
        if (savings > 0) {
          totalSavings += savings * count;
        }
      }
    });
    return totalSavings;
  };
  const getVolumeDiscountDetails = () => {
    const totalStudents = getTotalStudentCount();
    if (totalStudents < 12) return null;
    let originalTotal = 0;
    let discountedTotal = 0;
    let totalStudentsWithDiscount = 0;
    studentTiers.forEach(tier => {
      const count = selectedStudentTiers[tier.id] || 0;
      if (count > 0) {
        originalTotal += tier.basePrice.student * count;
        discountedTotal += calculateStudentPrice(tier, totalStudents) * count;
        totalStudentsWithDiscount += count;
      }
    });
    if (totalStudentsWithDiscount === 0) return null;
    const originalPerStudent = originalTotal / totalStudentsWithDiscount;
    const discountedPerStudent = discountedTotal / totalStudentsWithDiscount;
    const savingsPerStudent = originalPerStudent - discountedPerStudent;
    return {
      originalPerStudent,
      discountedPerStudent,
      savingsPerStudent,
      totalSavings: originalTotal - discountedTotal
    };
  };
  const handleCredentialFlip = (id: string) => {
    // This function was used for micro-credentials flip cards, now removed
  };
  const handleTeacherSelection = (tierId: string, count: number) => {
    if (useUnlimited) setUseUnlimited(false);
    setSelectedTeacherTiers(prev => ({
      ...prev,
      [tierId]: count
    }));
  };
  const handleStudentSelection = (tierId: string, count: number) => {
    if (useUnlimited) setUseUnlimited(false);
    setSelectedStudentTiers(prev => ({
      ...prev,
      [tierId]: count
    }));
  };
  const handleUnlimitedSelection = () => {
    if (!useUnlimited) {
      setSelectedTeacherTiers({});
      setSelectedStudentTiers({});
    }
    setUseUnlimited(!useUnlimited);
  };
  const { errors, isBasicInfoValid, isEssentialInfoValid, isFullInfoValid } = useFormValidation();
  
  // Use the pure validation functions for different completion levels
  const isBasicComplete = isBasicInfoValid(schoolInfo);
  const isEssentialComplete = isEssentialInfoValid(schoolInfo);
  const isFormComplete = isFullInfoValid(schoolInfo);

  const regularPricing = calculateRegularTotal();
  const volumeNotification = getVolumeNotification();
  const totalSavings = getTotalSavings();
  const volumeDiscountDetails = getVolumeDiscountDetails();
  const unlimitedPricing = useUnlimited ? calculateUnlimitedTotal() : regularPricing;
  const finalPricing = useUnlimited ? unlimitedPricing : regularPricing;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src="/lovable-uploads/25655841-ce46-4847-b1b0-63cf9fc9699e.png" alt="Mandy Money High School Program Logo" className="h-24 object-contain" />
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
            <Card className="mb-8 p-6 bg-white shadow-sm border-2" style={{
            borderImage: 'linear-gradient(135deg, #005653, #45c0a9, #80dec4) 1'
          }}>
              <div className="mb-6">
                <div className="text-center mb-4">
                  <div className="inline-block bg-gradient-to-r from-[#005653] to-[#45c0a9] text-white px-6 py-2 rounded-full text-lg font-bold">
                    Teacher Options
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-center" style={{
                color: '#005653'
              }}>
                  Step 1: Select your Teacher Program Elements
                </h2>
                <p className="text-center" style={{
                color: '#45c0a9'
              }}>Choose the teaching resources that work best for your classroom</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6 mb-4">
                {teacherTiers.map((tier, index) => <PricingCard key={tier.id} tier={{
                  ...tier,
                  bestFor: tier.bestFor ? tier.bestFor : undefined
                }} price={tier.basePrice.teacher} isSelected={selectedTeacherTiers[tier.id] > 0} onSelect={() => {}} teacherCount={selectedTeacherTiers[tier.id] || 0} studentCount={0} animationDelay={index * 100} showImages={true} includeGST={true} colorScheme="teal" customGradient="linear-gradient(135deg, #005653, #45c0a9, #80dec4)" volumeSelector={<VolumeSelector label="Teachers" value={selectedTeacherTiers[tier.id] || 0} onChange={count => handleTeacherSelection(tier.id, count)} min={0} max={20} color="teal" />} />)}
              </div>
            </Card>

            {/* Step 2: Student Section */}
            <Card className="mb-8 p-6 bg-white shadow-sm border-2" style={{
            borderImage: 'linear-gradient(135deg, #ffb512, #ffde5a, #fea100) 1'
          }}>
              <div className="mb-6">
                <div className="text-center mb-4">
                  <div className="inline-block bg-gradient-to-r from-[#ffb512] to-[#fea100] text-white px-6 py-2 rounded-full text-lg font-bold">
                    Student Options
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-center" style={{
                color: '#fea100'
              }}>
                  Step 2: Select your Student Program Elements
                </h2>
                <p className="text-center" style={{
                color: '#ffb512'
              }}>Choose personalised access to the program for your students</p>
                
                {/* Volume Notification */}
                {volumeNotification && <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-medium text-center text-sm">
                      🎉 {volumeNotification}
                    </p>
                  </div>}
              </div>

              <div className="grid lg:grid-cols-3 gap-6 mb-4">
                {studentTiers.map((tier, index) => {
                const currentStudentCount = selectedStudentTiers[tier.id] || 0;
                const totalStudents = getTotalStudentCount();
                const currentPrice = calculateStudentPrice(tier, totalStudents);
                const originalPrice = tier.basePrice.student;
                const savings = originalPrice - currentPrice;
                const hasVolumeDiscount = totalStudents >= 12;
                return <PricingCard key={tier.id} tier={{
                  ...tier,
                  bestFor: tier.bestFor ? tier.bestFor : undefined
                }} price={currentPrice} isSelected={selectedStudentTiers[tier.id] > 0} onSelect={() => {}} teacherCount={0} studentCount={selectedStudentTiers[tier.id] || 0} animationDelay={index * 100} showImages={true} studentPrice={currentPrice} includeGST={true} colorScheme="yellow" customGradient="linear-gradient(135deg, #ffb512, #ffde5a, #fea100)" showSavings={false} volumeSelector={<VolumeSelector label="Students" value={selectedStudentTiers[tier.id] || 0} onChange={count => handleStudentSelection(tier.id, count)} min={0} max={200} color="yellow" />} />;
              })}
              </div>

              {/* Volume discount celebration notification */}
              {totalSavings > 0 && <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-medium text-center text-sm">
                    🎉 Volume discount applied: Save ${totalSavings.toFixed(0)} total!
                  </p>
                </div>}
            </Card>

            {/* Unlimited School Access Suggestion */}
            {regularPricing.total > 2000 && !useUnlimited && <Card className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">👇</div>
                  <div>
                    <h3 className="font-bold text-green-800 text-lg">Consider Our Unlimited School Access Option!</h3>
                    <p className="text-green-700">
                      Your current quote is ${regularPricing.total.toLocaleString()}. Our Unlimited School Access option might offer exceptional value for your entire school community.
                    </p>
                    <p className="text-green-600 text-sm mt-1 flex items-center">
                      <ArrowDown className="h-4 w-4 mr-1" />
                      See the unlimited option below for complete school-wide access
                    </p>
                  </div>
                </div>
              </Card>}

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
              <UnlimitedSchoolCard tier={unlimitedTier} isSelected={useUnlimited} onSelect={handleUnlimitedSelection} addOns={unlimitedAddOns} onAddOnsChange={setUnlimitedAddOns} pricing={finalPricing} teacherCount={getTotalTeacherCount()} studentCount={getTotalStudentCount()} regularPricing={regularPricing} />
            </div>

            {useUnlimited && <div className="text-center mt-4">
                <Button variant="outline" onClick={() => setUseUnlimited(false)} className="text-red-600 border-red-200 hover:bg-red-50">
                  <X className="h-4 w-4 mr-2" />
                  Unselect Unlimited Option
                </Button>
              </div>}
          </div>

          {/* Running Total Sidebar - Hidden on mobile */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-6">
              <Card className="p-6 bg-white shadow-sm border-2 border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Complete Package Cost</h3>
                
                <div className="space-y-3 mb-4">
                  <div className={cn(
                    "mb-6 rounded-lg p-4 text-center",
                    useUnlimited ? 'bg-green-50' : 'bg-teal-50'
                  )}>
                    <div className={cn(
                      "text-2xl font-bold",
                      useUnlimited ? 'text-green-900' : 'text-teal-900'
                    )}>
                      ${finalPricing.total.toLocaleString()}
                    </div>
                    <div className={cn(
                      "text-sm",
                      useUnlimited ? 'text-green-600' : 'text-teal-600'
                    )}>
                      {hasPhysicalItems() || (useUnlimited && (unlimitedAddOns.teacherBooks > 0 || unlimitedAddOns.studentBooks > 0 || unlimitedAddOns.posterA0 > 0)) 
                        ? finalPricing.shipping > 0 
                          ? `inc. $${finalPricing.shipping} shipping + GST`
                          : 'inc. free shipping + GST'
                        : 'inc. GST'
                      }
                    </div>
                  </div>
                  
                  <div className={cn(
                    "text-gray-600 text-sm",
                    useUnlimited ? 'text-green-600' : 'text-teal-600'
                  )}>
                    {getTotalTeacherCount() > 0 ? `${getTotalTeacherCount()} Teacher${getTotalTeacherCount() > 1 ? 's' : ''}` : ''}
                    {getTotalTeacherCount() > 0 && getTotalStudentCount() > 0 ? ' + ' : ''}
                    {getTotalStudentCount() > 0 ? `${getTotalStudentCount()} Student${getTotalStudentCount() > 1 ? 's' : ''}` : ''}
                  </div>
                  <div className="text-xs text-gray-500">Includes 12 month access</div>
                  
                  {/* Simplified Volume Discount Display */}
                  {totalSavings > 0 && <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 mt-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-green-700">🎉 Volume discount: Save ${totalSavings.toFixed(0)}</span>
                      </div>
                    </div>}
                </div>

                {/* Program Inclusions */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">What's Included:</h4>
                  <div className="space-y-2">
                    {getIncludedItems().map((item, index) => {
                    if (useUnlimited) {
                      // Color coding for unlimited items
                      let itemType = 'both';
                      if (typeof item === 'string') {
                        if (item.includes('Teacher')) itemType = 'teacher';
                        else if (item.includes('Student')) itemType = 'student';
                      }
                      
                      return <div key={index} className={`text-xs p-2 rounded-lg flex items-center ${itemType === 'teacher' ? 'bg-gradient-to-r from-teal-50 to-teal-100' : itemType === 'student' ? 'bg-gradient-to-r from-yellow-50 to-yellow-100' : 'bg-gradient-to-r from-blue-50 to-blue-100'}`}>
                          <Check className={`h-3 w-3 mr-2 flex-shrink-0 ${itemType === 'teacher' ? 'text-teal-600' : itemType === 'student' ? 'text-yellow-600' : 'text-blue-600'}`} />
                          <span className={itemType === 'teacher' ? 'text-teal-700' : itemType === 'student' ? 'text-yellow-700' : 'text-blue-700'}>{item}</span>
                        </div>;
                    } else {
                      const itemType = typeof item === 'object' ? item.type : 'both';
                      const itemText = typeof item === 'object' ? item.text : item;
                      return <div key={index} className={`text-xs p-2 rounded-lg flex items-center ${itemType === 'teacher' ? 'bg-gradient-to-r from-teal-50 to-teal-100' : itemType === 'student' ? 'bg-gradient-to-r from-yellow-50 to-yellow-100' : 'bg-gradient-to-r from-blue-50 to-blue-100'}`}>
                          <Check className={`h-3 w-3 mr-2 flex-shrink-0 ${itemType === 'teacher' ? 'text-teal-600' : itemType === 'student' ? 'text-yellow-600' : 'text-blue-600'}`} />
                          <span className={itemType === 'teacher' ? 'text-teal-700' : itemType === 'student' ? 'text-yellow-700' : 'text-blue-700'}>{itemText}</span>
                        </div>;
                    }
                  })}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12">
          <div className="border-t-2 border-gray-300"></div>
        </div>

        {/* Official Quote Header */}
        <div className="rounded-lg p-8 text-center mb-8">
          <div className="bg-gradient-to-r from-[#fe5510] via-[#fea700] to-[#fe8303] bg-clip-text text-transparent">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="text-4xl">✨</div>
              <h2 className="text-4xl font-bold">Your Official Program Quote</h2>
              <div className="text-4xl">✨</div>
            </div>
          </div>
          <p className="text-xl text-gray-600">For internal use or to place an order</p>
          <div className="mt-6 animate-bounce">
            <ArrowDown className="h-8 w-8 mx-auto text-gray-600" />
          </div>
        </div>

        {/* Official Quote Section with Light Green Background */}
        <div className="bg-gradient-to-b from-green-50 to-emerald-50 rounded-lg shadow-lg overflow-hidden border border-green-100 pb-8 md:pb-0">
          {/* Navy Header Banner */}
          <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white p-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="text-3xl">📋</div>
                <h2 className="text-3xl font-bold">Official Program Quote</h2>
                <div className="text-3xl">📋</div>
              </div>
              
              {/* School Name and Quote Validity */}
              {schoolInfo.schoolName && <div className="text-xl font-semibold mb-2">{schoolInfo.schoolName}</div>}
              <div className="text-sm opacity-90">
                Quote valid until 31st December, {new Date().getFullYear()}
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Two Column Layout for Official Quote */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Left Column - Investment Breakdown */}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-green-200/50">
                <h3 className="text-2xl font-semibold mb-4 text-slate-800 flex items-center">
                  <BarChart3 className="h-7 w-7 mr-3" />
                  Investment Breakdown
                </h3>
                
                <div className="space-y-4">
                  {getDetailedBreakdown().map((item, index) => <div key={index} className="border-b border-slate-200 pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${item.type === 'teacher' ? 'bg-teal-500' : item.type === 'student' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                            <div className="font-semibold text-slate-800">{item.item}</div>
                            <Badge variant="outline" className={`text-xs ${item.type === 'teacher' ? 'border-teal-300 text-teal-700' : item.type === 'student' ? 'border-yellow-300 text-yellow-700' : 'border-blue-300 text-blue-700'}`}>
                              {item.type === 'teacher' ? 'Teacher' : item.type === 'student' ? 'Student' : 'Add-on'}
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-600 mt-1 ml-5">{item.description}</div>
                          <div className="text-sm text-slate-700 mt-2 ml-5">
                            <span className="font-medium">{item.count}</span> × <span className="font-medium">${item.unitPrice.toLocaleString()}</span>
                            {item.savings && item.savings > 0 && <span className="text-green-600 ml-2 font-medium">
                                (Save ${item.savings.toFixed(0)} each!)
                              </span>}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-bold text-lg text-slate-800">${item.totalPrice.toLocaleString()}</div>
                          {item.originalUnitPrice && item.originalUnitPrice > item.unitPrice && <div className="text-xs text-slate-400 line-through">
                              ${(item.originalUnitPrice * item.count).toLocaleString()}
                            </div>}
                        </div>
                      </div>
                    </div>)}
                  
                  {/* Shipping */}
                  {(hasPhysicalItems() || (useUnlimited && (unlimitedAddOns.teacherBooks > 0 || unlimitedAddOns.studentBooks > 0 || unlimitedAddOns.posterA0 > 0))) && <div className="border-b border-slate-200 pb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-slate-800">Shipping</div>
                          <div className="text-xs text-slate-600">
                            {finalPricing.shipping === 0 ? 'Free shipping (order over $90)' : 'Standard shipping'}
                          </div>
                        </div>
                        <div className="font-bold text-lg text-slate-800">
                          {finalPricing.shipping === 0 ? <span className="text-green-600">FREE</span> : `$${finalPricing.shipping}`}
                        </div>
                      </div>
                    </div>}
                  
                  {/* Tax breakdown */}
                  <div className="space-y-2 py-4 bg-slate-100 rounded-lg px-4">
                    <div className="flex justify-between items-center text-sm text-slate-600">
                      <span>Subtotal (exc. GST)</span>
                      <span>${finalPricing.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-slate-600">
                      <span>GST (10%)</span>
                      <span>${finalPricing.gst.toFixed(2)}</span>
                    </div>
                    {finalPricing.shipping > 0 && <div className="flex justify-between items-center text-sm text-slate-600">
                        <span>Shipping</span>
                        <span>${finalPricing.shipping}</span>
                      </div>}
                  </div>
                  
                  {/* Total */}
                  <div className="bg-green-600 text-white p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="text-xl font-bold">Total Investment</div>
                      <div className="text-2xl font-bold">${finalPricing.total.toLocaleString()}</div>
                    </div>
                    <div className="text-sm opacity-90 text-right mt-1">
                      (Price includes 10% GST)
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Program Inclusions */}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-green-200/50">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">What's Included</h3>
                
                <div className="space-y-3 mb-6">
                  {getIncludedItems().map((item, index) => {
                  if (useUnlimited) {
                    // Color coding for unlimited items
                    let itemType = 'both';
                    if (typeof item === 'string') {
                      if (item.includes('Teacher')) itemType = 'teacher';
                      else if (item.includes('Student')) itemType = 'student';
                    }
                    
                    return <div key={index} className={`p-3 rounded-lg flex items-center ${itemType === 'teacher' ? 'bg-gradient-to-r from-teal-50 to-teal-100' : itemType === 'student' ? 'bg-gradient-to-r from-yellow-50 to-yellow-100' : 'bg-gradient-to-r from-blue-50 to-blue-100'}`}>
                        <Check className={`h-4 w-4 mr-3 flex-shrink-0 ${itemType === 'teacher' ? 'text-teal-600' : itemType === 'student' ? 'text-yellow-600' : 'text-blue-600'}`} />
                        <span className={`text-sm font-medium ${itemType === 'teacher' ? 'text-teal-800' : itemType === 'student' ? 'text-yellow-800' : 'text-blue-800'}`}>{item}</span>
                      </div>;
                  } else {
                    const itemType = typeof item === 'object' ? item.type : 'both';
                    const itemText = typeof item === 'object' ? item.text : item;
                    return <div key={index} className={`p-3 rounded-lg flex items-center ${itemType === 'teacher' ? 'bg-gradient-to-r from-teal-50 to-teal-100' : itemType === 'student' ? 'bg-gradient-to-r from-yellow-50 to-yellow-100' : 'bg-gradient-to-r from-blue-50 to-blue-100'}`}>
                        <Check className={`h-4 w-4 mr-3 flex-shrink-0 ${itemType === 'teacher' ? 'text-teal-600' : itemType === 'student' ? 'text-yellow-600' : 'text-blue-600'}`} />
                        <span className={`text-sm font-medium ${itemType === 'teacher' ? 'text-teal-800' : itemType === 'student' ? 'text-yellow-800' : 'text-blue-800'}`}>{itemText}</span>
                      </div>;
                  }
                })}
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Access Period Summary</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <div><strong>Program starts:</strong> {format(programStartDate, 'MMMM d, yyyy')}</div>
                    <div><strong>Access ends:</strong> {format(addMonths(programStartDate, 12), 'MMMM d, yyyy')}</div>
                    <div className="text-xs mt-2 text-green-600">Full 12-month access to all digital content and resources</div>
                  </div>
                </div>
              </div>
            </div>

            {/* School Information Form - Updated with clearer requirements */}
            <Card className="mb-8 p-6 bg-white/80 backdrop-blur-sm border border-green-200/50" data-form-section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">School Information</h3>
                <FormCompletionIndicator schoolInfo={schoolInfo} isComplete={isFormComplete} />
              </div>
              
              {/* Requirements explanation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">Information Requirements by Action:</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <div><strong>Export Quote:</strong> No requirements (but recommended: school name, coordinator, email)</div>
                  <div><strong>Make Enquiry:</strong> School name + coordinator name + email required</div>
                  <div><strong>Place Order:</strong> Complete form required</div>
                </div>
              </div>
              
              {/* Program Start Date */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-700 mb-3">Program Access Period</h4>
                <div className="flex items-center gap-4 mb-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-64 justify-start text-left font-normal", !programStartDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {programStartDate ? format(programStartDate, 'PPP') : <span>Pick start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={programStartDate} onSelect={date => date && setProgramStartDate(date)} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="text-sm text-gray-600">
                  Access period: {format(programStartDate, 'PPP')} to {format(addMonths(programStartDate, 12), 'PPP')}
                </div>
              </div>

              {/* Essential Information Section */}
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Essential for Enquiries & Orders
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Input 
                      placeholder="School Name *" 
                      value={schoolInfo.schoolName} 
                      onChange={e => setSchoolInfo(prev => ({
                        ...prev,
                        schoolName: e.target.value
                      }))} 
                      className={`font-medium ${errors.schoolName ? 'border-red-300 focus:border-red-500' : isEssentialComplete ? 'border-green-300' : ''}`}
                    />
                    {errors.schoolName && (
                      <p className="text-red-500 text-xs mt-1">{errors.schoolName}</p>
                    )}
                  </div>
                  <div>
                    <Input 
                      placeholder="Coordinator Name *" 
                      value={schoolInfo.coordinatorName} 
                      onChange={e => setSchoolInfo(prev => ({
                        ...prev,
                        coordinatorName: e.target.value
                      }))} 
                      className={`${errors.coordinatorName ? 'border-red-300 focus:border-red-500' : isEssentialComplete ? 'border-green-300' : ''}`}
                    />
                    {errors.coordinatorName && (
                      <p className="text-red-500 text-xs mt-1">{errors.coordinatorName}</p>
                    )}
                  </div>
                  <div>
                    <Input 
                      placeholder="Coordinator Email *" 
                      value={schoolInfo.coordinatorEmail} 
                      onChange={e => setSchoolInfo(prev => ({
                        ...prev,
                        coordinatorEmail: e.target.value
                      }))} 
                      className={`${errors.coordinatorEmail ? 'border-red-300 focus:border-red-500' : isEssentialComplete ? 'border-green-300' : ''}`}
                    />
                    {errors.coordinatorEmail && (
                      <p className="text-red-500 text-xs mt-1">{errors.coordinatorEmail}</p>
                    )}
                  </div>
                  <Input 
                    placeholder="Coordinator Position" 
                    value={schoolInfo.coordinatorPosition} 
                    onChange={e => setSchoolInfo(prev => ({
                      ...prev,
                      coordinatorPosition: e.target.value
                    }))} 
                  />
                </div>
              </div>

              {/* Additional Information Section - Required for Orders */}
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Additional Details for Orders
                </h4>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <Input 
                    placeholder="School ABN" 
                    value={schoolInfo.schoolABN} 
                    onChange={e => setSchoolInfo(prev => ({
                      ...prev,
                      schoolABN: e.target.value
                    }))} 
                  />
                  <div>
                    <Input 
                      placeholder="Contact Phone *" 
                      value={schoolInfo.contactPhone} 
                      onChange={e => setSchoolInfo(prev => ({
                        ...prev,
                        contactPhone: e.target.value
                      }))} 
                      className={errors.contactPhone ? 'border-red-300 focus:border-red-500' : ''}
                    />
                    {errors.contactPhone && (
                      <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>
                    )}
                  </div>
                </div>

                {/* School Address */}
                <div className="mb-4">
                  <AddressInput
                    label="School Address *"
                    value={schoolInfo.schoolAddress}
                    onChange={(address) => setSchoolInfo(prev => ({
                      ...prev,
                      schoolAddress: address
                    }))}
                    placeholder="Search for your school address..."
                  />
                  {errors.schoolAddress && (
                    <p className="text-red-500 text-xs mt-1">{errors.schoolAddress}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input 
                    placeholder="Accounts Email" 
                    value={schoolInfo.accountsEmail} 
                    onChange={e => setSchoolInfo(prev => ({
                      ...prev,
                      accountsEmail: e.target.value
                    }))} 
                  />
                  <Input 
                    placeholder="Purchase Order Number" 
                    value={schoolInfo.purchaseOrderNumber} 
                    onChange={e => setSchoolInfo(prev => ({
                      ...prev,
                      purchaseOrderNumber: e.target.value
                    }))} 
                  />
                </div>
              </div>
                
              {/* Delivery and Billing Addresses - Only show if physical items */}
              {(hasPhysicalItems() || (useUnlimited && (unlimitedAddOns.teacherBooks > 0 || unlimitedAddOns.studentBooks > 0 || unlimitedAddOns.posterA0 > 0))) && (
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox id="deliveryIsSame" checked={schoolInfo.deliveryIsSameAsSchool} onCheckedChange={checked => setSchoolInfo(prev => ({
                    ...prev,
                    deliveryIsSameAsSchool: checked as boolean
                  }))} />
                    <label htmlFor="deliveryIsSame" className="text-sm">Delivery address same as school address</label>
                  </div>
                  {!schoolInfo.deliveryIsSameAsSchool && (
                    <AddressInput
                      label="Delivery Address"
                      value={schoolInfo.deliveryAddress}
                      onChange={(address) => setSchoolInfo(prev => ({
                        ...prev,
                        deliveryAddress: address
                      }))}
                      placeholder="Search for your delivery address..."
                    />
                  )}
                </div>
              )}
              
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox id="billingIsSame" checked={schoolInfo.billingIsSameAsSchool} onCheckedChange={checked => setSchoolInfo(prev => ({
                  ...prev,
                  billingIsSameAsSchool: checked as boolean
                }))} />
                  <label htmlFor="billingIsSame" className="text-sm">Billing address same as school address</label>
                </div>
                {!schoolInfo.billingIsSameAsSchool && (
                  <AddressInput
                    label="Billing Address"
                    value={schoolInfo.billingAddress}
                    onChange={(address) => setSchoolInfo(prev => ({
                      ...prev,
                      billingAddress: address
                    }))}
                    placeholder="Search for your billing address..."
                  />
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Select value={schoolInfo.paymentPreference} onValueChange={value => setSchoolInfo(prev => ({
                ...prev,
                paymentPreference: value
              }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Payment Preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Card Payment</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={schoolInfo.supplierSetupForms} onValueChange={value => setSchoolInfo(prev => ({
                ...prev,
                supplierSetupForms: value
              }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Supplier Setup Forms Required?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="not-sure">Not Sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Questions/Comments Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Any Questions or Comments?</label>
                <Textarea placeholder="Please share any questions, special requirements, or additional information..." value={schoolInfo.questionsComments} onChange={e => setSchoolInfo(prev => ({
                ...prev,
                questionsComments: e.target.value
              }))} className="min-h-20" />
              </div>

              {/* Join Community Checkbox */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="joinCommunity" 
                    checked={joinCommunity} 
                    onCheckedChange={checked => setJoinCommunity(checked as boolean)}
                  />
                  <label htmlFor="joinCommunity" className="text-sm font-medium text-green-800 cursor-pointer">
                    Join The Mandy Money Community
                  </label>
                </div>
                <p className="text-xs text-green-600 mt-2 ml-6">
                  Get updates on new resources, teaching tips, and exclusive offers for educators
                </p>
              </div>
            </Card>

            <div className="mt-8">
              <ActionButtons 
                selectedTier={{
                  name: 'Custom Selection',
                  id: 'combined'
                }} 
                totalPrice={finalPricing.total} 
                teacherCount={getTotalTeacherCount()} 
                studentCount={getTotalStudentCount()}
                schoolInfo={schoolInfo}
                quoteItems={getDetailedBreakdown()}
                pricing={finalPricing}
                programStartDate={programStartDate}
                isUnlimited={useUnlimited}
              />
            </div>
          </div>

          {/* ... keep existing code (running total sidebar) exactly the same */}
        </div>

        {/* ... keep existing code (rest of the component - dividers, official quote section, lesson explorer) exactly the same */}
      </div>
    </div>
  );
};
