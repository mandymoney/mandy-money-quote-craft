
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, Users, BookOpen, Globe, Laptop, FileText, Target, TrendingUp, Award, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PricingTier } from './QuoteBuilder';

interface InclusionsDisplayProps {
  selectedTier: PricingTier | null;
  teacherCount: number;
  studentCount: number;
  showBothTiers?: boolean;
  colorScheme?: 'teal' | 'yellow' | 'green' | 'purple';
  unlimitedAccess?: boolean;
}

export const InclusionsDisplay: React.FC<InclusionsDisplayProps> = ({
  selectedTier,
  teacherCount,
  studentCount,
  showBothTiers = true,
  colorScheme = 'teal',
  unlimitedAccess = false
}) => {
  if (!selectedTier) return null;

  const getIcon = (inclusion: string) => {
    const lower = inclusion.toLowerCase();
    if (lower.includes('digital') || lower.includes('platform')) return Globe;
    if (lower.includes('textbook') || lower.includes('physical')) return BookOpen;
    if (lower.includes('lesson') || lower.includes('plan')) return FileText;
    if (lower.includes('assessment') || lower.includes('tool')) return Target;
    if (lower.includes('tracking') || lower.includes('progress')) return TrendingUp;
    if (lower.includes('development') || lower.includes('professional')) return Award;
    if (lower.includes('gamified') || lower.includes('challenge')) return Zap;
    if (lower.includes('interactive') || lower.includes('module')) return Laptop;
    return Check;
  };

  const getColorClasses = (type: 'teacher' | 'student' | 'classroom' = 'teacher') => {
    const schemes = {
      teal: {
        teacher: 'from-teal-800 to-teal-600 bg-teal-50 text-teal-700 border-teal-200',
        student: 'from-blue-800 to-blue-600 bg-blue-50 text-blue-700 border-blue-200',
        classroom: 'from-green-800 to-green-600 bg-green-50 text-green-700 border-green-200'
      },
      yellow: {
        teacher: 'from-yellow-800 to-yellow-600 bg-yellow-50 text-yellow-700 border-yellow-200',
        student: 'from-orange-800 to-orange-600 bg-orange-50 text-orange-700 border-orange-200',
        classroom: 'from-amber-800 to-amber-600 bg-amber-50 text-amber-700 border-amber-200'
      },
      green: {
        teacher: 'from-green-800 to-green-600 bg-green-50 text-green-700 border-green-200',
        student: 'from-emerald-800 to-emerald-600 bg-emerald-50 text-emerald-700 border-emerald-200',
        classroom: 'from-teal-800 to-teal-600 bg-teal-50 text-teal-700 border-teal-200'
      },
      purple: {
        teacher: 'from-purple-800 to-purple-600 bg-purple-50 text-purple-700 border-purple-200',
        student: 'from-indigo-800 to-indigo-600 bg-indigo-50 text-indigo-700 border-indigo-200',
        classroom: 'from-violet-800 to-violet-600 bg-violet-50 text-violet-700 border-violet-200'
      }
    };
    return schemes[colorScheme][type];
  };

  const renderInclusionsList = (inclusions: string[], type: 'teacher' | 'student' | 'classroom', count?: number) => {
    if (!inclusions || inclusions.length === 0) return null;

    const colorClasses = getColorClasses(type);
    const [gradientClasses, bgClasses] = colorClasses.split(' bg-');
    const [bgClass, textClasses] = bgClasses.split(' text-');
    const [textClass, borderClass] = textClasses.split(' border-');

    return (
      <Card className={cn("p-6 border-2", `bg-${bgClass}`, `border-${borderClass}`)}>
        <div className="mb-4">
          <div className={cn("rounded-lg p-3 bg-gradient-to-r", gradientClasses)}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-lg capitalize flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {type === 'teacher' ? 'Teachers' : type === 'student' ? 'Students' : 'Classroom'}
              </h3>
              {count !== undefined && (
                <Badge className="bg-white/20 text-white border-white/30">
                  {count.toLocaleString()} {type}s
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {inclusions.map((inclusion, index) => {
            const IconComponent = getIcon(inclusion);
            return (
              <div key={index} className="flex items-start space-x-3">
                <IconComponent className={cn("h-5 w-5 mt-0.5 flex-shrink-0", `text-${textClass}`)} />
                <span className={cn("text-sm font-medium", `text-${textClass}`)}>{inclusion}</span>
              </div>
            );
          })}
        </div>

        {unlimitedAccess && type === 'student' && (
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-bold text-purple-800">Unlimited Access</span>
            </div>
            <p className="text-xs text-purple-700 mt-1">No per-student limits - entire school can access!</p>
          </div>
        )}
      </Card>
    );
  };

  const renderNotIncluded = () => {
    if (!selectedTier.notIncluded || selectedTier.notIncluded.length === 0) return null;

    return (
      <Card className="p-6 border-2 bg-gray-50 border-gray-200">
        <div className="mb-4">
          <h3 className="font-bold text-gray-700 text-lg flex items-center">
            <X className="h-5 w-5 mr-2 text-red-500" />
            What's Not Included
          </h3>
        </div>
        
        <div className="space-y-2">
          {selectedTier.notIncluded.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <X className="h-4 w-4 text-red-400 flex-shrink-0" />
              <span className="text-sm text-gray-600">{item}</span>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">What's Included</h2>
        <p className="text-gray-600">Everything you need for a successful financial literacy program</p>
      </div>

      <div className="grid gap-6">
        {/* Teacher inclusions */}
        {renderInclusionsList(selectedTier.inclusions.teacher, 'teacher', teacherCount)}
        
        {/* Student inclusions */}
        {renderInclusionsList(selectedTier.inclusions.student, 'student', studentCount)}
        
        {/* Classroom inclusions */}
        {renderInclusionsList(selectedTier.inclusions.classroom, 'classroom')}
        
        {/* What's not included */}
        {renderNotIncluded()}
      </div>
    </div>
  );
};
